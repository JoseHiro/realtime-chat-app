import Chat from "./Chat";
import { SpeechProvider } from "../context/SpeechContext";

export default function Index() {
  return (
    <SpeechProvider>
      <Chat />
    </SpeechProvider>
  );
}
