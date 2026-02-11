import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter, Playfair_Display, Quicksand } from "next/font/google";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "../context/AppProviders";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${quicksand.variable} font-sans`}>
      <Head>
        <link rel="icon" href="/img/logo.png" />
        <link rel="shortcut icon" href="/img/logo.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Component {...pageProps} />
          <Toaster />
        </AppProviders>
      </QueryClientProvider>
    </div>
  );
}
