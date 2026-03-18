import { Message, ChatMessagesProps } from "@/types";
import MessageRender from "./MessageRender";

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((m: Message, i: number) => (
        <div key={i}>
          <MessageRender role={m.role} content={m.content} />
        </div>
      ))}
    </div>
  );
}