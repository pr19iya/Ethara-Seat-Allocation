import api from "./api";

export const askAssistant = async (query: string) => {
  const { data } = await api.post("/ai/query", {
    query,
  });

  return data;
};