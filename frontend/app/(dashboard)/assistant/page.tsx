"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
} from "lucide-react";

import { askAssistant } from "@/services/assistantService";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  source?: "openai" | "fallback";
}

const suggestedQuestions = [
  "How many seats are available?",
  "How many seats are occupied?",
  "How many employees are there?",
  "How many active projects are there?",
  "Show available seats on Floor 3",
  "What is the current seat utilization?",
];

export default function AssistantPage() {
  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 1,
        role: "assistant",
        content:
          "Hello! I’m the Ethara workspace assistant. Ask me about employees, projects, seats, availability, or office utilization.",
      },
    ]);

  async function submitQuestion(
    value: string
  ) {
    const trimmedQuestion = value.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await askAssistant(
        trimmedQuestion
      );

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          response.answer ||
          "I could not find an answer for that question.",
        source: response.source,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "Assistant request failed:",
        error
      );

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I could not connect to the assistant service. Please check that the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void submitQuestion(question);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            AI Assistant
          </h1>

          <p className="page-subtitle">
            Ask questions about employees,
            projects, seating, and office
            utilization.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          Assistant Online
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="surface-card flex min-h-[650px] flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
                <Bot size={23} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Ethara Workspace Assistant
                </h2>

                <p className="mt-1 text-xs text-indigo-100">
                  OpenAI-powered with keyword
                  fallback support
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/70 p-6">
            {messages.map((message) => {
              const assistant =
                message.role === "assistant";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    assistant
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {assistant && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Bot size={18} />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      assistant
                        ? "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                        : "rounded-tr-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-line">
                      {message.content}
                    </p>

                    {assistant &&
                      message.source ===
                        "fallback" && (
                        <div className="mt-3 flex items-center gap-1.5 border-t border-amber-100 pt-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                          <p className="text-[10px] font-semibold text-amber-600">
                            Answered using fallback
                            assistant
                          </p>
                        </div>
                      )}

                    {assistant &&
                      message.source ===
                        "openai" && (
                        <div className="mt-3 flex items-center gap-1.5 border-t border-indigo-100 pt-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                          <p className="text-[10px] font-semibold text-indigo-600">
                            Answered using OpenAI
                          </p>
                        </div>
                      )}
                  </div>

                  {!assistant && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                      <User size={18} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Bot size={18} />
                </div>

                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />

                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-4"
          >
            <div className="flex items-end gap-3">
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    void submitQuestion(
                      question
                    );
                  }
                }}
                rows={2}
                placeholder="Ask about employees, available seats, projects..."
                className="form-control min-h-[54px] resize-none"
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !question.trim()
                }
                className="primary-button h-[54px] w-[54px] shrink-0 px-0"
                title="Send question"
              >
                <Send size={19} />
              </button>
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Press Enter to send. Use Shift +
              Enter for a new line.
            </p>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-indigo-500"
              />

              <h3 className="font-semibold text-slate-900">
                Suggested Questions
              </h3>
            </div>

            <div className="mt-4 space-y-2">
              {suggestedQuestions.map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      void submitQuestion(
                        item
                      )
                    }
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="surface-card p-5">
            <h3 className="font-semibold text-slate-900">
              Assistant Capabilities
            </h3>

            <div className="mt-4 space-y-3 text-xs text-slate-500">
              <div className="rounded-xl bg-blue-50 p-3">
                Employee and project counts
              </div>

              <div className="rounded-xl bg-emerald-50 p-3">
                Seat availability and occupancy
              </div>

              <div className="rounded-xl bg-violet-50 p-3">
                Floor and zone-based seat queries
              </div>

              <div className="rounded-xl bg-amber-50 p-3">
                Workspace utilization information
              </div>

              <div className="rounded-xl bg-rose-50 p-3">
                Employee seat lookup
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-300">
              Helpful Tip
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-200">
              Include a floor number,
              employee name, email, seat
              number, or project name for
              more precise answers.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}