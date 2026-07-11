import api from "@/lib/api";

export interface AssistantResponse {
  answer: string;
  source: "openai" | "fallback";
}

export async function askAssistant(
  question: string
): Promise<AssistantResponse> {
  const response =
    await api.post<AssistantResponse>(
      "/assistant/ask",
      {
        question,
      }
    );

  return response.data;
}