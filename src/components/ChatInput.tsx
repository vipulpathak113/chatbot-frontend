"use client";

import { useState } from "react";
import { Message, ChatInputProps } from "@/types";
import { streamChat } from "@/services/chatService";
import { useThreadStore } from "@/store/threadStore";

export default function ChatInput({ threadId, setMessages }: ChatInputProps) {
  const [input, setInput] = useState("");
  const fetchThreads = useThreadStore((state) => state.fetchThreads);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await streamChat(threadId, input);

    const reader = response?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        try {
          const data = JSON.parse(line.replace("data:", "").trim());

          if (data.type === "thinking") {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "",
                isThinking: true,
                isStreaming: true,
                tools: [],
              },
            ]);
          }

          if (data.type === "tool_call") {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last) return prev;

              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  tools: [...(last.tools || []), data.tool],
                },
              ];
            });
          }
          if (data.type === "done") {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last) return prev;

              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  isStreaming: false,
                },
              ];
            });
          }

          if (data.type === "assistant") {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (!last) return prev;

              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  content: last.content + data.content,
                  isThinking: false,
                },
              ];
            });
          }
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      }
    }

    setInput("");
    await fetchThreads();
  };

  return (
    <div className="p-4 border-t flex gap-3">
      <input
        className="flex-1 border p-3 rounded"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-5 py-3 rounded cursor-pointer"
      >
        Send
      </button>
    </div>
  );
}
