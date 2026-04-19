import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface Chat {
  id: number;
  title?: string;
  theme?: string;
  level?: string;
  characterName?: string;
  createdAt: string;
  message: { id: string }[];
}

export default function ChatsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: () => fetch("/api/chats/get").then((r) => r.json()),
  });

  const chats: Chat[] = data?.chats ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Chat History</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {chats.length} session{chats.length !== 1 ? "s" : ""}
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No chats yet. Start a conversation!</p>
            <Link href="/chat" className="mt-4 inline-block text-sm font-medium text-gray-900 dark:text-gray-100 underline underline-offset-2">
              Go to Chat
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.id}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {chat.title || chat.theme || "Untitled chat"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {chat.level && <span className="mr-2">{chat.level}</span>}
                    {chat.characterName && <span className="mr-2">· {chat.characterName}</span>}
                    {chat.message.length} messages · {new Date(chat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-4 shrink-0 transition-colors">
                  View →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
