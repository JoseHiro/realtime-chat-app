import React, { useState } from "react";

export const SoundWave = ({ audioUrl }: { audioUrl: string }) => {
  const [bars, setBars] = useState<number[]>([]);

  const fetchAudioWaveData = async () => {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const rawData = audioBuffer.getChannelData(0);
    const samples = 20; // 表示する棒の数
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData: number[] = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[i * blockSize + j]);
      }
      filteredData.push(sum / blockSize);
    }

    // 正規化（0~1）
    const max = Math.max(...filteredData);
    const normalizedData = filteredData.map((n) => n / max);

    setBars(normalizedData);
  };
  if (audioUrl) {
    fetchAudioWaveData();
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: "40px" }}>
      {bars.map((value, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: `${value * 40}px`,
            backgroundColor: "#4caf50",
            marginRight: "2px",
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
};
