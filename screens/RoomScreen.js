import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc-web-shim';
import io from 'socket.io-client';

const RoomScreen = ({ route }) => {
    const { roomId } = route.params;
    const socket = useRef(null);
    const localStream = useRef(null);
    const [localStreamObject, setLocalStreamObject] = useState(null);
    const [remoteStreamObject, setRemoteStreamObject] = useState(null);
    const pc = useRef(new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ],
    }));
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.current = io('https://mighty-oasis-96312-f0778e903b79.herokuapp.com/');
        socket.current.on('connect', () => {
            console.log('Connected to server');
            socket.current.emit('join-room', roomId, socket.current.id);
        });

        mediaDevices.getUserMedia({
            audio: true,
            video: true,
        }).then(stream => {
            localStream.current = stream;
            setLocalStreamObject(stream);
            pc.current.addStream(stream);
            setIsConnected(true);
        }).catch(error => {
            console.error('Error accessing media devices.', error);
        });

        pc.current.onaddstream = (event) => {
            setRemoteStreamObject(event.stream);
        };

        socket.current.on('user-connected', userId => {
            console.log('User connected:', userId);
            createOffer();
        });

        socket.current.on('offer', handleOffer);
        socket.current.on('answer', handleAnswer);
        socket.current.on('ice-candidate', handleNewICECandidateMsg);

        return () => {
            socket.current.disconnect();
            if (pc.current) {
                pc.current.close();
            }
        };
    }, []);

    const createOffer = () => {
        pc.current.createOffer().then(offer => {
            return pc.current.setLocalDescription(offer);
        }).then(() => {
            socket.current.emit('offer', { offer: pc.current.localDescription, roomId });
        }).catch(error => {
            console.error('Error creating offer:', error);
        });
    };

    const handleOffer = ({ offer }) => {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
            return pc.current.createAnswer();
        }).then(answer => {
            return pc.current.setLocalDescription(answer);
        }).then(() => {
            socket.current.emit('answer', { answer: pc.current.localDescription, roomId });
        }).catch(error => {
            console.error('Error handling offer:', error);
        });
    };

    const handleAnswer = ({ answer }) => {
        pc.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(error => {
            console.error('Error setting remote description:', error);
        });
    };

    const handleNewICECandidateMsg = ({ candidate }) => {
        const iceCandidate = new RTCIceCandidate(candidate);
        pc.current.addIceCandidate(iceCandidate).catch(error => {
            console.error('Error adding received ice candidate', error);
        });
    };

    return (
        <View style={styles.container}>
            {localStreamObject && (
                <RTCView stream={localStreamObject} style={styles.video} />
            )}
            {remoteStreamObject && (
                <RTCView stream={remoteStreamObject} style={styles.video} />
            )}
            <Button title="Start Call" onPress={createOffer} disabled={!isConnected} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
});

export default RoomScreen;
