"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseWithDetails } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  Loader2,
  Bot,
  Send,
  Sparkles,
  X,
  User,
} from "lucide-react";
import { toggleLessonCompletionAction } from "@/app/actions/lms";
import { sendMessageToAIAction } from "@/app/actions/ai";

interface LessonPlayerClientProps {
  course: CourseWithDetails;
  completedLessonIds: string[];
}

export function LessonPlayerClient({ course, completedLessonIds }: LessonPlayerClientProps) {
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title }))
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || ""
  );
  const [completedSet, setCompletedSet] = useState<Set<string>>(
    new Set(completedLessonIds)
  );
  const [loadingToggle, setLoadingToggle] = useState(false);

  // Inline AI Drawer State
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Hello! I am your AI Tutor for **"${course.title}"**. Ask me anything about this lesson!`,
    },
  ]);

  const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = allLessons[activeLessonIndex] || allLessons[0];

  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;
  const nextLesson =
    activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1] : null;

  const totalLessonsCount = allLessons.length;
  const completedCount = completedSet.size;
  const progressPercent =
    totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  const isCurrentLessonCompleted = completedSet.has(activeLesson?.id || "");

  const handleToggleCompletion = async () => {
    if (!activeLesson) return;
    setLoadingToggle(true);

    try {
      const res = await toggleLessonCompletionAction(activeLesson.id, course.id);
      if (res.success) {
        const nextSet = new Set(completedSet);
        if (res.isCompleted) {
          nextSet.add(activeLesson.id);
        } else {
          nextSet.delete(activeLesson.id);
        }
        setCompletedSet(nextSet);
      }
    } catch (e) {
      console.error("Failed to toggle completion:", e);
    } finally {
      setLoadingToggle(false);
    }
  };

  const handleAISend = async (customPrompt?: string) => {
    const text = customPrompt || aiQuestion;
    if (!text.trim()) return;

    setAiMessages((prev) => [...prev, { role: "user", content: text }]);
    if (!customPrompt) setAiQuestion("");
    setAiLoading(true);

    try {
      const res = await sendMessageToAIAction({
        question: text,
        courseId: course.id,
        lessonId: activeLesson?.id,
      });

      if (res.success && res.response) {
        setAiMessages((prev) => [...prev, { role: "assistant", content: res.response! }]);
      }
    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Top Learning Header */}
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/my-courses" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              {course.category} • Course Player
            </span>
            <h1 className="text-base font-bold text-white tracking-tight">{course.title}</h1>
          </div>
        </div>

        {/* Dynamic Progress Indicator & AI Drawer Trigger */}
        <div className="flex items-center gap-4">
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsAIDrawerOpen(true)}
            className="text-xs font-bold gap-1.5 shadow-sm"
          >
            <Bot className="h-4 w-4" /> Ask AI Tutor
          </Button>

          <div className="flex items-center gap-3 bg-slate-800 px-4 py-1.5 rounded-xl text-xs">
            <div className="flex flex-col text-right">
              <span className="font-semibold text-slate-200">
                Progress: <strong className="text-amber-400 font-bold">{progressPercent}%</strong>
              </span>
              <span className="text-[11px] text-slate-400">
                {completedCount} of {totalLessonsCount} Lessons
              </span>
            </div>
            <div className="w-20 bg-slate-700 rounded-full h-2">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Module Sidebar */}
        <aside className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto p-4 space-y-4 shrink-0">
          <div className="px-2 py-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Modules</h2>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod, idx) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 px-2 py-1 flex items-center justify-between">
                  <span>M{idx + 1}: {mod.title}</span>
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isActive = les.id === activeLessonId;
                    const isDone = completedSet.has(les.id);
                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => setActiveLessonId(les.id)}
                        className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isActive
                            ? "bg-slate-900 text-white font-semibold shadow-xs"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? "text-emerald-400" : "text-emerald-600"}`} />
                        ) : (
                          <Circle className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? "text-slate-400" : "text-slate-300"}`} />
                        )}
                        <span className="line-clamp-2 leading-snug flex-1">{les.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Viewer Main Panel */}
        <main className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto space-y-6">
          {activeLesson ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{activeLesson.moduleTitle}</Badge>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {activeLesson.durationMins} Mins
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
              </div>

              {/* Lesson Text Reader */}
              <Card className="p-6 space-y-6 shadow-xs border-slate-200 bg-white">
                <div className="bg-slate-900 rounded-xl p-8 text-center text-white space-y-3">
                  <BookOpen className="h-10 w-10 mx-auto text-amber-400" />
                  <h4 className="text-base font-semibold">TGL Employability Skills Module Reader</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Study the technical guidelines below and mark the lesson complete to update your skill matrix index.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-normal">
                  <h3 className="text-base font-bold text-slate-900">Lesson Objectives & Core Reading</h3>
                  <p>{activeLesson.content || "Content for this employability lesson is undergoing continuous refinement for industry standards."}</p>
                </div>

                {/* Completion Toggle Button */}
                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Lesson Status: {isCurrentLessonCompleted ? "Completed" : "Incomplete"}
                  </span>
                  <Button
                    variant={isCurrentLessonCompleted ? "outline" : "accent"}
                    size="md"
                    onClick={handleToggleCompletion}
                    disabled={loadingToggle}
                    className="gap-2"
                  >
                    {loadingToggle ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isCurrentLessonCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Mark as Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Mark Lesson as Completed
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Lesson Navigation Footer */}
              <div className="flex items-center justify-between pt-4">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveLessonId(prevLesson.id)}
                    className="gap-1.5 text-xs"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous: {prevLesson.title.substring(0, 22)}...
                  </Button>
                ) : <div />}

                {nextLesson ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveLessonId(nextLesson.id)}
                    className="gap-1.5 text-xs"
                  >
                    Next: {nextLesson.title.substring(0, 22)}... <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Link href="/my-courses">
                    <Button variant="accent" size="sm" className="gap-1.5 text-xs">
                      <Award className="h-4 w-4" /> Back to My Courses
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Inline AI Assistant Side Drawer */}
      {isAIDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">AI Tutor Assistant</h3>
                <span className="text-[10px] text-slate-400 font-mono">Grounded in Active Lesson</span>
              </div>
            </div>
            <button onClick={() => setIsAIDrawerOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {aiMessages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                <div
                  className={`p-3 rounded-xl leading-relaxed max-w-[85%] ${
                    m.role === "user" ? "bg-blue-600 text-white" : "bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" /> AI evaluating lesson context...
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handleAISend("Explain this lesson simply")}
                className="px-2 py-0.5 bg-slate-100 text-[10px] rounded hover:bg-slate-200 text-slate-700 whitespace-nowrap"
              >
                Explain simply
              </button>
              <button
                type="button"
                onClick={() => handleAISend("Give me a real-world example")}
                className="px-2 py-0.5 bg-slate-100 text-[10px] rounded hover:bg-slate-200 text-slate-700 whitespace-nowrap"
              >
                Real-world example
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAISend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask AI Tutor..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                disabled={aiLoading}
                className="text-xs h-8"
              />
              <Button variant="accent" size="sm" type="submit" disabled={aiLoading || !aiQuestion.trim()} className="h-8 px-3">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
