"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getThreads } from "@/services/threadService";

export default function Sidebar() {

  const [threads, setThreads] = useState([]);
  const router = useRouter();
  const params = useParams();

  const activeId = params?.threadId;

const fetchThreads = async () => {
  const data = await getThreads();
  setThreads(data);
};

    useEffect(() => {
    fetchThreads();
  }, []);

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
        {threads.map((t: any) => (
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