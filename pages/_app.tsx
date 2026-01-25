import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeechProvider } from "../context/SpeechContext";
import { Toaster } from "@/components/ui/sonner";
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/img/logo.png" />
        <link rel="shortcut icon" href="/img/logo.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SpeechProvider>
          <Component {...pageProps} />
          <Toaster />
        </SpeechProvider>
      </QueryClientProvider>
    </>
  );
}
