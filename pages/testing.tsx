import React, { useRef } from "react";

const Testing = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTestConnectRealtime = async () => {
    try {
      console.log("接続開始...");

      // 1. WebRTCの準備
      const pc = new RTCPeerConnection();

      // AIの音声を受け取るための設定
      pc.ontrack = (event) => {
        console.log("AIの音声を受信しました！");
        if (audioRef.current) {
          audioRef.current.srcObject = event.streams[0];
        }
      };

      // データチャネルの作成
      const dc = pc.createDataChannel("oai-events");
      dc.onopen = () => {
        console.log("DataChannelが開きました。設定を送り、挨拶を要求します。");

        // 1. まず「あなたは何者か」を教える
        dc.send(
          JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["audio", "text"],
              instructions:
                "あなたは日本語教師です。短く元気に挨拶してください。",
              // ★ ここを null にするか、削除してください
              input_audio_transcription: null,
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
              },
            },
          }),
        );

        // 2. 少しだけ（100ms）待ってから発話を要求する（設定の反映を確実にするため）
        setTimeout(() => {
          console.log("発話リクエスト送信");
          dc.send(
            JSON.stringify({
              type: "response.create",
              response: {
                modalities: ["audio", "text"],
              },
            }),
          );
        }, 100);
      };
      dc.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("AIからのイベント:", msg.type, msg);
      };

      // 2. マイクの取得（これがないとエラーになる場合があります）
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 3. サーバーから一時トークンを取得
      const tokenRes = await fetch("/api/chat/start_realtime_chat_session", {
        method: "POST",
      });
      const session = await tokenRes.json();
      const EPHEMERAL_KEY = session.client_secret.value;

      // 4. SDP Offerの作成と送信
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview",
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        },
      );

      const answerSDP = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });

      console.log("WebRTC接続完了！");
    } catch (error) {
      console.error("エラー発生:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime API 疎通テスト</h1>
      <button
        onClick={handleTestConnectRealtime}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        接続テスト開始
      </button>
      {/* 画面上にオーディオ要素を置いておく（自動再生ブロック対策） */}
      <audio ref={audioRef} autoPlay />
      <p>※コンソール（F12）を開いてログを確認してください</p>
    </div>
  );
};

export default Testing;
