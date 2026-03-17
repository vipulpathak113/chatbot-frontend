"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useThreadStore } from "@/store/threadStore";
import { Thread } from "@/types/thread";

export default function Sidebar() {
  const { threads, fetchThreads } = useThreadStore();

  const router = useRouter();
  const params = useParams();

  const activeId = params?.threadId as string;

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleNewChat = () => {
    const id = crypto.randomUUID();
    router.push(`/chat/${id}`);
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      <button
        onClick={handleNewChat}
        className="w-full mb-4 bg-gray-700 p-2 rounded"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {threads.map((t: Thread) => (
          <div
            key={t.id}
            onClick={() => router.push(`/chat/${t.id}`)}
            className={`p-2 rounded cursor-pointer ${
              activeId === t.id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            {t.title || "New Chat"}
          </div>
        ))}
      </div>
    </div>
  );
}