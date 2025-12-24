import { useEffect } from "react";
import { useRouter } from "next/router";

// Redirect old /setting route to new /settings route
const Setting = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings");
  }, [router]);

  return null;
};

export default Setting;
