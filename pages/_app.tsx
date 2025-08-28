import type { AppProps } from "next/app";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeechProvider } from "../context/SpeechContext";
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SpeechProvider>
        <Component {...pageProps} />
      </SpeechProvider>
    </QueryClientProvider>
  );
}
