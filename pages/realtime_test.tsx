import React from "react";

const RealtimeTest = () => {
  const handleClick = async () => {
    // 1️⃣ Create RTCPeerConnection
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel("oai-events");
    dc.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // if (msg.type === "response.audio_transcript.delta") {
      //   console.log("AI (Transcript):", msg.delta);
      // }

      if (msg.type === "response.audio_transcript.done") {
        const fullText = msg.transcript; // 結合済みの全文章が入っている
        console.log("保存するテキスト:", fullText);

        // DB保存用のAPIを叩く
        // await saveToDatabase({ role: "assistant", content: fullText });
      }
    };

    // 🔊 AI → User audio
    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;

    pc.ontrack = (event) => {
      console.log("AI audio received");
      audioEl.srcObject = event.streams[0];
    };

    // 🎤 User → AI audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // 2️⃣ Create SDP offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // 3️⃣ Get ephemeral session token from backend
    const tokenRes = await fetch("/api/realtime_test", {
      method: "POST",
    });

    const session = await tokenRes.json();
    const EPHEMERAL_KEY = session.client_secret.value;

    // 4️⃣ Send offer SDP to Realtime API
    const sdpRes = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
      {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      },
    );

    // 5️⃣ Apply answer SDP
    const answerSDP = await sdpRes.text();
    await pc.setRemoteDescription({
      type: "answer",
      sdp: answerSDP,
    });

    console.log("Realtime audio connected");
  };

  return (
    <div>
      <button onClick={handleClick}>Start Realtime Session</button>
    </div>
  );
};

export default RealtimeTest;
