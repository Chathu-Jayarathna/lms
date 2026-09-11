"use client";

import { useState } from "react";
import { CourseWithDetails } from "@/lib/db";
import { AIAnalyticsData } from "@/app/actions/ai";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  BookOpen,
  Loader2,
  BarChart2,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { sendMessageToAIAction, clearConversationAction } from "@/app/actions/ai";

interface AIAssistantClientProps {
  courses: CourseWithDetails[];
  analytics: AIAnalyticsData;
}

export function AIAssistantClient({ courses, analytics }: AIAssistantClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "c-comm-1");
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const lessons = selectedCourse?.modules.flatMap((m) => m.lessons) || [];

  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id || "");
  const [questionInput, setQuestionInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Hello! I am your **TGL Educational AI Assistant**.\n\nI am grounded in your study context for **"${selectedCourse?.title}"**. Ask me anything about the reading, request simple explanations, or click one of the suggested study prompts below!`,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const suggestedPrompts = [
    "Explain this lesson simply",
    "Give me a real-world example",
    "Summarize key takeaways",
    "What are the key points?",
    "Help me understand this concept",
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || questionInput;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user" as const, content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setQuestionInput("");

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendMessageToAIAction({
        question: textToSend,
        courseId: selectedCourseId,
        lessonId: selectedLessonId,
        conversationId,
      });

      if (res.success && res.response) {
        setConversationId(res.conversationId);
        const aiMessage = { role: "assistant" as const, content: res.response };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setErrorMsg(res.error || "Failed to generate AI response.");
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (conversationId) {
      await clearConversationAction(conversationId);
    }
    setConversationId(undefined);
    setMessages([
      {
        role: "assistant",
        content: `Conversation history cleared. Select a course lesson above and ask your question!`,
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Cols: Main Interactive Chat UI */}
      <div className="lg:col-span-2 space-y-6">
        {/* Context Selector Card */}
        <Card className="p-4 bg-white border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Select Study Course Context</label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  const c = courses.find((crs) => crs.id === e.target.value);
                  if (c && c.modules[0]?.lessons[0]) {
                    setSelectedLessonId(c.modules[0].lessons[0].id);
                  }
                }}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">Select Active Lesson</label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {lessons.map((les) => (
                  <option key={les.id} value={les.id}>
                    {les.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Chat Thread Container */}
        <Card className="flex flex-col h-[520px] shadow-sm border-slate-200 bg-white">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">TGL Educational AI Assistant</CardTitle>
                <CardDescription className="text-[11px] text-emerald-600 font-semibold">
                  Grounded in Lesson Context • Pedagogical Guardrails Active
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-xs text-slate-500 hover:text-red-600 gap-1"
              title="Clear Conversation"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear Chat
            </Button>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs max-w-xl ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center font-bold text-[11px] ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-amber-400"
                  }`}
                >
                  {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 text-xs max-w-md">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3.5 bg-slate-100 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2 text-slate-600 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" /> Evaluating lesson context & generating educational response...
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center font-semibold">
                {errorMsg}
              </p>
            )}
          </CardContent>

          {/* Quick Prompts & Input Bar */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            {/* Suggested Prompt Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" /> Prompts:
              </span>
              {suggestedPrompts.map((pText) => (
                <button
                  key={pText}
                  type="button"
                  onClick={() => handleSend(pText)}
                  disabled={loading}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-full text-[11px] font-medium text-slate-700 shrink-0 transition-colors cursor-pointer"
                >
                  {pText}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask a question about this lesson or concept..."
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                disabled={loading}
                className="bg-white text-xs"
              />
              <Button variant="accent" type="submit" disabled={loading || !questionInput.trim()} className="gap-1 px-4 font-bold shrink-0">
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Right Col: AI Research Analytics Drawer */}
      <div className="space-y-6">
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardHeader className="space-y-2">
            <Badge variant="accent" className="w-fit">Research Metrics</Badge>
            <CardTitle className="text-white text-lg">AI Educational Analytics</CardTitle>
            <CardDescription className="text-slate-300 text-xs">
              Metrics tracking AI effectiveness during self-paced study
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Conversations</span>
                <span className="text-xl font-extrabold text-amber-400">{analytics.totalConversations}</span>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Questions Asked</span>
                <span className="text-xl font-extrabold text-blue-400">{analytics.totalQuestions}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">Frequently Asked Prompts</span>
              <div className="space-y-1.5">
                {analytics.popularTopics.map((item: { topic?: string; prompt?: string; count: number }, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] p-2 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-slate-300 line-clamp-1">{item.topic || item.prompt}</span>
                    <span className="text-amber-400 font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pedagogical Guardrails Reference Card */}
        <Card className="p-4 border-slate-200 text-xs space-y-3">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-blue-600" /> Educational Guardrails Active
          </h4>
          <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc pl-4">
            <li>Grounded in active lesson reading.</li>
            <li>Explains technical concepts simply with real-world examples.</li>
            <li>Refuses dishonest assessment completions.</li>
            <li>Encourages critical thinking follow-ups.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
