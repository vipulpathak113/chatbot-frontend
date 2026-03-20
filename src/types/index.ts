export interface Message {
  id: string; 
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  isThinking?: boolean;
  isStreaming?: boolean;
}

export interface ChatInputProps {
  threadId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface ChatMessagesProps {
  messages: Message[];
}
