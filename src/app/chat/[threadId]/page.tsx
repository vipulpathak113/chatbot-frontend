"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import { Message } from "@/types";

export default function ChatPage() {
  const { threadId } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const res = await fetch(
        `http://localhost:8000/threads/${threadId}/messages`,
      );

      const data = await res.json();

      setMessages(
        data.map((m: Message) => ({
          id: m.id || crypto.randomUUID(),
          role: m.role,
          content: m.content,
        })),
      );
    };

    loadHistory();
  }, [threadId]);

  return (
    <div className="flex flex-col h-screen">
      <ChatMessages messages={messages} />

      <ChatInput threadId={threadId as string} setMessages={setMessages} messages={messages} />
    </div>
  );
}
