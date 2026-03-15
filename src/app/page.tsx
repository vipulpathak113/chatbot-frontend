"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  const startChat = () => {
    const id = uuidv4();
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">
        How can I help you today?
      </h1>

      <button
        onClick={startChat}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Start New Chat
      </button>
    </div>
  );
}