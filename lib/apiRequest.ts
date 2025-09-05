export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return null;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Request failed with ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API Request Error:", err);
    return null;
  }
};
