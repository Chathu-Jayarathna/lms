"use client";

import { useState } from "react";
import { CourseWithDetails } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
} from "lucide-react";
import {
  addModuleAction,
  deleteModuleAction,
  addLessonAction,
  deleteLessonAction,
} from "@/app/actions/admin";

interface CurriculumEditorClientProps {
  course: CourseWithDetails;
}

export function CurriculumEditorClient({ course }: CurriculumEditorClientProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);

  // Form states
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState(15);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("add-mod");
    setFeedback(null);

    const res = await addModuleAction(course.id, moduleTitle);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Module added!" });
      setModuleTitle("");
      setIsAddModuleOpen(false);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to add module." });
    }
    setLoadingId(null);
  };

  const handleDeleteModule = async (moduleId: string) => {
    setLoadingId(`del-mod-${moduleId}`);
    setFeedback(null);

    const res = await deleteModuleAction(moduleId, course.id);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Module deleted!" });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to delete module." });
    }
    setLoadingId(null);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleForLesson) return;

    setLoadingId("add-les");
    setFeedback(null);

    const res = await addLessonAction(activeModuleForLesson, course.id, {
      title: lessonTitle,
      content: lessonContent,
      durationMins: lessonDuration,
    });

    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Lesson added!" });
      setLessonTitle("");
      setLessonContent("");
      setActiveModuleForLesson(null);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to add lesson." });
    }
    setLoadingId(null);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    setLoadingId(`del-les-${lessonId}`);
    setFeedback(null);

    const res = await deleteLessonAction(lessonId, course.id);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Lesson deleted!" });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to delete lesson." });
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Curriculum Modules & Lessons</CardTitle>
            <CardDescription className="text-xs">
              {course.modules.length} Modules / {course.lessonsCount} Total Lessons
            </CardDescription>
          </div>
          <Button variant="accent" size="sm" onClick={() => setIsAddModuleOpen(true)} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" /> Add Module
          </Button>
        </CardHeader>
      </Card>

      {/* Modules List */}
      <div className="space-y-6">
        {course.modules.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-slate-200 space-y-3">
            <BookOpen className="h-8 w-8 mx-auto text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-800">No Modules Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &quot;Add Module&quot; above to begin structuring the curriculum for this course.
            </p>
          </Card>
        ) : (
          course.modules.map((mod, idx) => (
            <Card key={mod.id} className="overflow-hidden border-slate-200">
              <CardHeader className="bg-slate-50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">{mod.title}</CardTitle>
                    <CardDescription className="text-[11px] text-slate-500">{mod.lessons.length} Lessons</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLessonTitle("");
                      setLessonContent("");
                      setLessonDuration(15);
                      setActiveModuleForLesson(mod.id);
                    }}
                    className="h-8 text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Lesson
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteModule(mod.id)}
                    disabled={loadingId === `del-mod-${mod.id}`}
                    className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
                  >
                    {loadingId === `del-mod-${mod.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {mod.lessons.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No lessons in this module yet.</p>
                ) : (
                  mod.lessons.map((les, lIdx) => (
                    <div
                      key={les.id}
                      className="p-3 border border-slate-100 rounded-lg flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-[11px]">{lIdx + 1}.</span>
                        <div>
                          <span className="font-semibold text-slate-900 block">{les.title}</span>
                          {les.content && (
                            <span className="text-slate-500 text-[11px] line-clamp-1 max-w-lg">{les.content}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono flex items-center gap-1 text-[10px]">
                          <Clock className="h-3 w-3 text-slate-400" /> {les.durationMins}m
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLesson(les.id)}
                          disabled={loadingId === `del-les-${les.id}`}
                          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                        >
                          {loadingId === `del-les-${les.id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Module Modal */}
      {isAddModuleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Module</h3>
              <button onClick={() => setIsAddModuleOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleAddModule} className="space-y-4 text-xs">
              <Input
                label="Module Title"
                placeholder="e.g., Module 3: Advanced Communication Workflows"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModuleOpen(false)}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={loadingId === "add-mod"}>
                  {loadingId === "add-mod" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Module"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {activeModuleForLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Lesson</h3>
              <button onClick={() => setActiveModuleForLesson(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4 text-xs">
              <Input
                label="Lesson Title"
                placeholder="e.g., Executive Summary Presentation"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Lesson Content Text</label>
                <textarea
                  rows={4}
                  placeholder="Detailed study content or exercise instructions for this lesson..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <Input
                label="Estimated Duration (Minutes)"
                type="number"
                value={lessonDuration}
                onChange={(e) => setLessonDuration(parseInt(e.target.value) || 15)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveModuleForLesson(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loadingId === "add-les"}>
                  {loadingId === "add-les" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
