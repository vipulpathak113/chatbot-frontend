import api from "./api";

export const getThreads = async () => {
  const res = await api.get("/threads");
  return res.data;
};

export const createThread = async (title: string) => {
  const res = await api.post("/threads", { title });
  return res.data;
};

export const deleteThread = async (id: string) => {
  await api.delete(`/threads/${id}`);
};

export const getThreadMessages = async (id: string) => {
  const res = await api.get(`/threads/${id}/messages`);
  return res.data;
};