import { useEffect, useRef } from "react";
import { Message, ChatMessagesProps } from "@/types";
import MessageRender from "./MessageRender";

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((m: Message) => (
        <div key={m.id} className="space-y-1">
          {/* Thinking */}
          {m.isThinking && (
            <div className="text-gray-400 text-sm animate-pulse">
              Thinking...
            </div>
          )}

          {/* Tool usage */}
          {m.tools && m.tools.length > 0 && (
            <div className="text-xs text-blue-400 mb-1">
              Using: {m.tools.join(", ")}
            </div>
          )}

          {/* Actual message */}
          {m.content && (
            <MessageRender id={m.id} role={m.role} content={m.content} />
          )}

          {/* Streaming cursor */}
          {m.isStreaming && m.content && (
            <span className="animate-pulse ml-1">|</span>
          )}
        </div>
      ))}
      {/* auto scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
