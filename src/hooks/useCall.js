import { useEffect, useRef, useState } from "react";
import { callCollection } from "../db/signalDB";

export function useCall(roomId) {
  const pcRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    pcRef.current = new RTCPeerConnection();

    const unsub = callCollection.find({ roomId }).onSnapshot(async (offers) => {
      for (const offer of offers) {
        if (offer.type === "offer") {
          await pcRef.current.setRemoteDescription(offer.sdp);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          callCollection.insert({ roomId, type: "answer", sdp: answer });
        }
      }
    });

    return () => unsub();
  }, [roomId]);

  const startCall = async (stream) => {
    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    callCollection.insert({ roomId, type: "offer", sdp: offer });
  };

  return { remoteStream, startCall };
}
