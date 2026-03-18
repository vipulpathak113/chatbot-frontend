"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useThreadStore } from "@/store/threadStore";
import { Thread } from "@/types/thread";
import { deleteThread } from "@/services/threadService";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Sidebar() {
  const { threads, fetchThreads } = useThreadStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();

  const activeId = params?.threadId as string;

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleNewChat = () => {
    const id = crypto.randomUUID();
    router.push(`/chat/${id}`);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteId) return;

    const idToDelete: string = deleteId;

    // delete thread
    await deleteThread(idToDelete);

    // refresh latest threads
    await fetchThreads();

    // get latest threads from store
    const updatedThreads = useThreadStore.getState().threads;

    const currentIndex = updatedThreads.findIndex(
      (t: Thread) => t.id === idToDelete,
    );

    const nextThread =
      updatedThreads[currentIndex + 1] || updatedThreads[currentIndex - 1];

    if (activeId === idToDelete) {
      if (nextThread) {
        router.push(`/chat/${nextThread.id}`);
      } else {
        router.push("/");
      }
    }

    setDeleteId(null);
  };

  const cancelDelete = (): void => {
    setDeleteId(null);
  };

  return (
    <>
      <div className="w-64 bg-gray-900 text-white h-screen p-4">
        <button
          onClick={handleNewChat}
          className="w-full mb-4 bg-gray-700 p-2 rounded"
        >
          + New Chat
        </button>

        <div className="space-y-2">
          {threads.map((t: Thread) => (
            <div
              key={t.id}
              onClick={() => router.push(`/chat/${t.id}`)}
              className={`group flex items-center justify-between p-2 rounded cursor-pointer ${
                activeId === t.id ? "bg-gray-700" : "hover:bg-gray-800"
              }`}
            >
              {/* Title */}
              <span className="truncate">{t.title || "New Chat"}</span>

              {/* Delete Button (hover only) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(t.id); // open dialog
                }}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete this chat?"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
