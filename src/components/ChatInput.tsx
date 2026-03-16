"use client";

import { useState } from "react";
import { Message, ChatInputProps } from "@/types";

export default function ChatInput({ threadId, setMessages }: ChatInputProps) {

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: threadId,
        message: input,
      }),
    });

    const reader = response.body?.getReader();
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
  };

  return (
    <div className="p-4 border-t flex gap-3">

      <input
        className="flex-1 border p-3 rounded"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-5 py-3 rounded"
      >
        Send
      </button>

    </div>
  );
}