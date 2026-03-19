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
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await streamChat(threadId, input);

    const reader = response?.getReader();
    const decoder = new TextDecoder();

    const assistantMessage: Message = {
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, assistantMessage]);

    if (!reader) return;

    while (true) {

      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const lines = chunk.split("\n\n");

      for (const line of lines) {

        if (!line.startsWith("data:")) continue;

        try {
          const data = JSON.parse(line.replace("data:", "").trim()) as {
            type: string;
            content: string;
          };

          if (data.type === "assistant") {

            assistantMessage.content += data.content;

            setMessages((prev) => {

              const updated = [...prev];
              updated[updated.length - 1] = assistantMessage;

              return updated;
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