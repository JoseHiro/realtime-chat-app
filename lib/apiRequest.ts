import { useRouter } from "next/router";
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const router = useRouter();
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));

      if (data.error === "Not authenticated") {
        router.push("/login");
        return null;
      }

      // 他のエラーもここで throw しておくと扱いやすい
      throw new Error(data.error || "Request failed");
    }

    return await res.json();
  } catch (err) {
    console.error("API Request Error:", err);
    return null; // 失敗時は null を返す
  }
};
