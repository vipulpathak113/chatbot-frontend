"use client";

import ReactMarkdown from "react-markdown";
import { Message } from "@/types";
import remarkGfm from "remark-gfm";

export default function MessageRender({ id, role, content }: Message) {
  return (
    <div
      className={`p-3 rounded max-w-2xl ${
        role === "user"
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-white"
      }`}
    >
      <div
        className="prose prose-invert max-w-none 
                prose-a:text-blue-400 
                hover:prose-a:text-blue-300 
                prose-a:no-underline 
                hover:prose-a:underline"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
