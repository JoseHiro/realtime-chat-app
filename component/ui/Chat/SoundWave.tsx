import { useQuery } from "@tanstack/react-query";

async function fetchWaveData(audioUrl: string) {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();

  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const rawData = audioBuffer.getChannelData(0);
  const samples = 50;
  const blockSize = Math.floor(rawData.length / samples);
  const filteredData: number[] = [];

  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[i * blockSize + j]);
    }
    filteredData.push(sum / blockSize);
  }

  const max = Math.max(...filteredData);
  return filteredData.map((n) => n / max);
}

export const SoundWave = ({
  audioUrl,
  currentPlayingId,
}: {
  audioUrl: string;
  currentPlayingId: boolean;
}) => {
  const { data: bars, isLoading } = useQuery({
    queryKey: ["waveData", audioUrl],
    queryFn: () => fetchWaveData(audioUrl),
    staleTime: Infinity, // キャッシュをずっと有効
    // cacheTime: Infinity, // 再マウントしてもキャッシュ保持
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-8 w-full">
        <div className="flex items-end space-x-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gray-200 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 16 + 4}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const isPlaying = false;

  return (
    <div className="flex items-end justify-center h-8 w-full space-x-0.5 px-2">
      {bars?.map((value, i: number) => {
        const minHeight = 3;
        const maxHeight = 24;
        const barHeight = Math.max(value * maxHeight, minHeight);

        return (
          <div
            key={i}
            className={`
              w-1 rounded-full transition-all duration-300 ease-out
              ${
                currentPlayingId
                  ? "bg-green-300 shadow-sm animate-pulse"
                  : "bg-gray-300 hover:bg-green-400"
              }
            `}
            style={{
              height: `${barHeight}px`,
              animationDelay: isPlaying ? `${i * 0.05}s` : "0s",
              transform: isPlaying ? "scaleY(1.1)" : "scaleY(1)",
            }}
          />
        );
      })}
    </div>
  );
};
