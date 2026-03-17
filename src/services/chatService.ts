
export async function streamChat(thread_id: string, message: string) {

  const res = await fetch("http://localhost:8000/chat", {
    method: "POST",
    body: JSON.stringify({ thread_id, message }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.body;
}