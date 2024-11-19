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
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar a Socket.IO
    console.log("Connecting to socket...");
    socket.current = io("https://mighty-oasis-96312-f0778e903b79.herokuapp.com", {
      //transports: ['websocket', 'polling'], // Asegúrate de soportar ambos transportes
      timeout: 10000, // Ajusta el tiempo de espera a 10 segundos
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server");
      socket.current.emit("join-room", roomId, socket.current.id);
      console.log("Room:", roomId, "UserID:", socket.current.id);
    });

    socket.current.on("connect_error", (error) => {
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
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        console.log("User media obtained");
        localStream.current = stream;
        setLocalStreamObject(stream);
        pc.current.addStream(stream); // Aquí usamos addStream
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        alert("Error accessing media devices: " + error.message);
      });

    // Manejar el track remoto (cuando otro usuario se conecta)
    pc.current.ontrack = (event) => {
      console.log("Remote track added", event);
      if (event.streams && event.streams[0]) {
        setRemoteStreamObject(event.streams[0]);
      }
      console.log("Remote stream object:", remoteStreamObject);
    };

    // Manejo de la señalización cuando un usuario se conecta o desconecta
    socket.current.on("user-connected", (userId) => {
      console.log("User connected:", userId);
      createOffer();
    });

    socket.current.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
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
        console.log('setRemoteDescription');
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
  };

  const handleAnswer = (answer) => {
    console.log("Handling answer:", answer);
    pc.current
      .setRemoteDescription(new RTCSessionDescription(answer))
      .catch((error) => {
        console.error("Error setting remote description:", error);
      });
  };

  const handleNewICECandidateMsg = (msg) => {
    console.log("Handling new ICE candidate:", msg);
    const candidate = new RTCIceCandidate(msg);
    pc.current.addIceCandidate(candidate).catch((error) => {
      console.error("Error adding received ICE candidate", error);
    });
  };

  // Enviar candidato ICE local al servidor
  pc.current.onicecandidate = (event) => {
    if (event.candidate) {
      socket.current.emit("ice-candidate", { ...event.candidate, roomId });
      console.log("ice-candidate", event.candidate);
    }
  };

  return (
    <View style={styles.container}>
      {localStreamObject && (
        <RTCView stream={localStreamObject} style={styles.video} />
      )}
      {remoteStreamObject ? (
        remoteStreamObject && (
          <RTCView stream={remoteStreamObject} style={styles.video} />
        )
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
  },
  video: {
    width: 300,
    height: 300,
    margin: 10,
    backgroundColor: "black",
  },
  message: {
    fontSize: 18,
    color: "gray",
  },
});

export default RoomScreen;
