export interface ChatEventThinking {
  type: "thinking";
}

export interface ChatEventTool {
  type: "tool_call";
  tool: string;
}

export interface ChatEventAssistant {
  type: "assistant";
  content: string;
}

export interface ChatEventDone {
  type: "done";
}

export type ChatEvent =
  | ChatEventThinking
  | ChatEventTool
  | ChatEventAssistant
  | ChatEventDone;

// UI message
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  isStreaming?: boolean;
  isThinking?: boolean;
}