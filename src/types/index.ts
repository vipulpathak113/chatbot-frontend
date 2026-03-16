export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInputProps {
  threadId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface ChatMessagesProps {
  messages: Message[];
}
