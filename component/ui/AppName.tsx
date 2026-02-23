import { useRouter } from "next/router";
import Image from "next/image";

export const AppName = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/img/logo.png"
        alt="Kaiwa Kun Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer"
      >
        <Image
          src="/img/title_logo.png"
          alt="Kaiwa Kun"
          width={150}
          height={40}
          className="object-contain"
        />
      </button>
    </div>
  );
};

export const SidebarAppName = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 mb-1 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/img/logo.png"
        alt="Kaiwa Kun Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <Image
        src="/img/title_logo.png"
        alt="Kaiwa Kun"
        width={120}
        height={32}
        className="object-contain"
      />
    </button>
  );
};
