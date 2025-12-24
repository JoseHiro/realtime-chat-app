import { toast } from "sonner";

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include", // Always include cookies
    });

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        // Check if this is an admin route
        if (url.includes("/admin/")) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }
      return null;
    }

    if (res.status === 204) {
      return { status: 204, message: "No content" };
    }

    // Read the response body once
    let data;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!res.ok) {
      const errorMessage = data.error || data.message || "Something went wrong";
      console.error(`API Error (${res.status}):`, errorMessage, data);
      toast.error(errorMessage);
      // Return null instead of throwing to maintain backward compatibility
      return null;
    }

    return data;
  } catch (err: any) {
    console.error("API Request Error:", err);
    return null;
  }
};
