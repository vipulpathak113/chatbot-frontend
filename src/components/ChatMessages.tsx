import { Message, ChatMessagesProps } from "@/types";

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((m: Message, i: number) => (
        <div key={i}>
          <b>{m.role}:</b> {m.content}
        </div>
      ))}
    </div>
  );
}