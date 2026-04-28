import { useEffect } from "react";
import { useRouter } from "next/router";

export default function VocabularyRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const query: Record<string, string> = { tab: "vocabulary" };
    if (router.query.add) query.add = router.query.add as string;
    void router.replace({ pathname: "/flashcards", query });
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
