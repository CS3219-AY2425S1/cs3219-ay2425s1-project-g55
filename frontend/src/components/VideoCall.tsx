import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import DefaultAvatarPic from "../assets/Default Avatar Pic.png";
import { BACKEND_WEBSOCKET_VIDEO } from "@/lib/common";
import { getToken } from "@/lib/utils";
import { useAuth } from "@/hooks/auth/useAuth";

interface VideoCallProps {
  showVideo: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ showVideo }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const signalingSocket = useRef<WebSocket | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const auth = useAuth();
  const localUserName = auth?.user?.userName || "Local User";
  const remoteUserName = "Partner";

  useEffect(() => {
    if (!showVideo) {
      // If showVideo is false, clean up connections and streams
      peerConnection?.close();
      signalingSocket.current?.close();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
      setPeerConnection(null);
      return;
    }

    // Set up WebSocket and WebRTC connection if showVideo is true
    signalingSocket.current = new WebSocket(
      `${BACKEND_WEBSOCKET_VIDEO}?token=${getToken()}`
    );

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeerConnection(pc);

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        const [remoteStream] = event.streams;
        remoteVideoRef.current.srcObject = remoteStream;
        setRemoteVideoOn(true);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingSocket.current?.send(
          JSON.stringify({ type: "ice-candidate", candidate: event.candidate })
        );
      }
    };

    // Get local video and audio stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            signalingSocket.current?.send(
              JSON.stringify({ type: "offer", sdp: pc.localDescription })
            );
          })
          .catch((error) => console.error("Error creating offer:", error));
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    // Handle WebSocket signaling messages
    signalingSocket.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        signalingSocket.current?.send(
          JSON.stringify({ type: "answer", sdp: pc.localDescription })
        );
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } else if (data.type === "ice-candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    return () => {
      // Clean up connections and streams on component unmount
      pc.close();
      signalingSocket.current?.close();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setLocalStream(null);
      setPeerConnection(null);
    };
  }, [showVideo]); // Re-run the effect when showVideo changes

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn((prev) => !prev);
    }
  };

  return (
    <div className="video-call flex items-center gap-2">
      {showVideo && (
        <div className="video-container flex gap-2 items-center z-20">
          <div
            className="local-video-wrapper relative"
            style={{
              width: "240px",
              height: "180px",
              border: "2px solid #ccc",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.85rem",
              }}
            >
              {localUserName}
            </div>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="local-video"
              style={{ width: "100%", height: "100%", backgroundColor: 'white' }}
            ></video>
            <div
              className="icon-controls"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <FontAwesomeIcon
                icon={isMicOn ? faMicrophone : faMicrophoneSlash}
                onClick={toggleMic}
              />
            </div>
          </div>
          <div
            className="remote-video-wrapper relative"
            style={{
              width: "240px",
              height: "180px",
              border: "2px solid #ccc",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.85rem",
              }}
            >
              {remoteUserName}
            </div>
            {remoteVideoOn ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                className="remote-video"
                style={{ width: "100%", height: "100%", backgroundColor: 'white' }}
              ></video>
            ) : (
              <img
                src={DefaultAvatarPic}
                alt="Default Avatar"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
