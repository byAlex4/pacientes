import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc-web-shim";
import { io } from "socket.io-client";

const RoomScreen = ({ route }) => {
  const { roomId } = route.params;
  const socket = useRef(null);
  const localStream = useRef(null);
  const [localStreamObject, setLocalStreamObject] = useState(null);
  const [remoteStreamObject, setRemoteStreamObject] = useState(null);
  const pc = useRef(
    new RTCPeerConnection({
      iceServers: [{ url: 'stun:stun01.sipphone.com' },
        { url: 'stun:stun.ekiga.net' },
        { url: 'stun:stun.fwdnet.net' },
        { url: 'stun:stun.ideasip.com' },
        { url: 'stun:stun.iptel.org' },
        { url: 'stun:stun.rixtelecom.se' },
        { url: 'stun:stun.schlund.de' },
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        { url: 'stun:stunserver.org' },
        { url: 'stun:stun.softjoys.com' },
        { url: 'stun:stun.voiparound.com' },
        { url: 'stun:stun.voipbuster.com' },
        { url: 'stun:stun.voipstunt.com' },
        { url: 'stun:stun.voxgratia.org' },
        { url: 'stun:stun.xten.com' },],
    })
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar a Socket.IO
    console.log("Connecting to socket...");
    socket.current = io(
      "https://mighty-oasis-96312-f0778e903b79.herokuapp.com",
      {
        //transports: ['websocket', 'polling'], // Asegúrate de soportar ambos transportes
        timeout: 10000, // Ajusta el tiempo de espera a 10 segundos
      }
    );

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      socket.current.emit("join-room", roomId, socket.current.id);
      console.log("Room:", roomId, "UserID:", socket.current.id);
    });

    socket.current.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Obtener el stream local (audio y video)
    console.log("Requesting user media...");
    mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("User media obtained");
        localStream.current = stream;

        // Muestra el video local en la UI
        setLocalStreamObject(stream);

        // Asegúrate de añadir el flujo al RTCPeerConnection
        stream.getTracks().forEach((track) => {
          pc.current.addTrack(track, stream);
        });

        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert("Error accessing media devices: " + error.message);
      });

    // Manejar el track remoto (cuando otro usuario se conecta)
    pc.current.ontrack = (event) => {
      console.log("Remote track added:", event);
      if (event.streams && event.streams[0]) {
        setRemoteStreamObject(event.streams[0]);
        console.log("Remote stream object set successfully.");
      } else {
        console.warn("No remote streams available.");
      }
    };

    // Manejo de la señalización cuando un usuario se conecta o desconecta
    socket.current.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      createOffer();
    });

    socket.current.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
      setRemoteStream(null);
      setIsConnected(false);
      if (pc.current) {
        pc.current.close();
        pc.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        // Reagregar el stream local al nuevo RTCPeerConnection
        if (localStream.current) {
          pc.current.addStream(localStream.current);
        }
      }
    });

    socket.current.on("offer", (offer) => {
      console.log("Received offer:", offer);
      handleOffer(offer);
    });

    socket.current.on("answer", (answer) => {
      console.log("Received answer:", answer);
      handleAnswer(answer);
    });

    socket.current.on("ice-candidate", (candidate) => {
      console.log("Received ICE candidate:", candidate);
      handleNewICECandidateMsg(candidate);
    });

    pc.current.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.current.iceConnectionState);

      if (pc.current.iceConnectionState === "failed") {
        console.error("ICE connection failed. Retrying...");
        // Opcional: Implementar reinicio de ICE aquí
      }
    };

    // Cleanup cuando el componente se desmonta
    return () => {
      console.log("Cleaning up...");
      if (socket.current) {
        socket.current.disconnect();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      if (pc.current) {
        pc.current.close();
      }
    };
  }, []);

  const createOffer = () => {
    console.log("Creating offer...");
    pc.current
      .createOffer()
      .then((offer) => {
        console.log("Offer created:", offer);
        return pc.current.setLocalDescription(offer);
      })
      .then(() => {
        socket.current.emit("offer", pc.current.localDescription);
        console.log("Local description set (createOffer)");
        console.log("Offer sent:", pc.current.localDescription);
      })
      .catch((error) => {
        console.error("Error creating offer:", error);
      });
  };

  const handleOffer = (offer) => {
    console.log("Handling offer:", offer);
    pc.current
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        console.log("setRemoteDescription");
        processCandidateQueue();
        return pc.current.createAnswer();
      })
      .then((answer) => {
        console.log("Answer created:", answer);
        return pc.current.setLocalDescription(answer);
      })
      .then(() => {
        console.log("Local description set (handleOffer)");
        socket.current.emit("answer", pc.current.localDescription);
        console.log("Answer sent:", pc.current.localDescription);
      })
      .catch((error) => {
        console.error("Error handling offer:", error);
      });
    console.log("Peer connection state:", pc.current.connectionState);
  };

  const handleAnswer = (answer) => {
    console.log("Handling answer:", answer);
    pc.current
      .setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => {
        processCandidateQueue();
      })
      .catch((error) => {
        console.error("Error setting remote description:", error);
      });
  };

  const candidateQueue = [];
  const handleNewICECandidateMsg = (msg) => {
    if (!pc.current.remoteDescription) {
      console.log("Remote description not set yet. Candidate will be queued.");
      candidateQueue.push(msg);
      return;
    }

    // Verificar que sdpMid y sdpMLineIndex no sean nulos
    if (!msg.candidate || msg.sdpMid === null || msg.sdpMLineIndex === null) {
      console.error(
        "Invalid ICE candidate: missing sdpMid or sdpMLineIndex",
        msg
      );
      return; // Salir si el mensaje es inválido
    }

    console.log("Received ICE candidate:", msg);

    try {
      const candidate = new RTCIceCandidate(msg.candidate);
      pc.current
        .addIceCandidate(candidate)
        .then(() =>
          console.log("ICE candidate added successfully:", msg.candidate)
        )
        .catch((error) => {
          console.error("Error adding received ICE candidate:", error);
        });
      console.log("Handling new ICE candidate:", msg);
    } catch (error) {
      console.error("Invalid ICE candidate received:", error, msg.candidate);
    }
  };

  const processCandidateQueue = () => {
    while (candidateQueue.length > 0) {
      const msg = candidateQueue.shift();
      handleNewICECandidateMsg(msg);
    }
  };

  // Enviar candidato ICE local al servidor
  pc.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.current.emit("ice-candidate", {
        room: roomId,
        candidate: event.candidate,
      });
    } else {
      console.log("Todos los candidatos locales han sido enviados");
    }
  };

  return (
    <View style={styles.container}>
      {isConnected && (
        <RTCView stream={localStreamObject} style={styles.localVideo} />
      )}
      {remoteStreamObject ? (
        <RTCView stream={remoteStreamObject} style={styles.remoteVideo} />
      ) : (
        <Text style={styles.message}>No hay usuarios conectados</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34", // Fondo oscuro
  },
  localVideo: {
    width: 250,
    height: 200,
    margin: 10,
    borderColor: "#3b5998", // Borde azul
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  remoteVideo: {
    width: 250,
    height: 200,
    margin: 10,
    borderColor: "#fff", // Borde blanco
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    color: "#ccc", // Color gris claro
    margin: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default RoomScreen;
