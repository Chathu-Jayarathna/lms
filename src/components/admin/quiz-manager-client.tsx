"use client";

import { useState } from "react";
import { CourseWithDetails } from "@/lib/db";
import { QuizStudentDetails } from "@/lib/quiz-db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  HelpCircle,
  Award,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { createQuizAction, deleteQuizAction, createQuestionAction } from "@/app/actions/quiz";

interface AdminQuizManagerClientProps {
  courses: CourseWithDetails[];
  initialQuizzes: QuizStudentDetails[];
}

export function AdminQuizManagerClient({ courses, initialQuizzes }: AdminQuizManagerClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "c-comm-1");
  const [quizzes, setQuizzes] = useState<QuizStudentDetails[]>(initialQuizzes);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [activeQuizForQuestion, setActiveQuizForQuestion] = useState<string | null>(null);

  // Quiz Form
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [passingScore, setPassingScore] = useState(70);

  // Question Form
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(10);
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");
  const [correctOptIdx, setCorrectOptIdx] = useState(0);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("create-quiz");
    setFeedback(null);

    const res = await createQuizAction(selectedCourseId, {
      title: quizTitle,
      description: quizDescription,
      passingScore,
    });

    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Quiz created successfully!" });
      setQuizTitle("");
      setQuizDescription("");
      setIsCreateQuizOpen(false);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to create quiz." });
    }
    setLoadingId(null);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    setLoadingId(`del-quiz-${quizId}`);
    setFeedback(null);

    const res = await deleteQuizAction(quizId, selectedCourseId);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Quiz deleted!" });
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to delete quiz." });
    }
    setLoadingId(null);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizForQuestion) return;

    setLoadingId("add-question");
    setFeedback(null);

    const options = [
      { optionText: opt1, isCorrect: correctOptIdx === 0 },
      { optionText: opt2, isCorrect: correctOptIdx === 1 },
      { optionText: opt3, isCorrect: correctOptIdx === 2 },
      { optionText: opt4, isCorrect: correctOptIdx === 3 },
    ].filter((o) => o.optionText.trim().length > 0);

    const res = await createQuestionAction(activeQuizForQuestion, selectedCourseId, {
      questionText,
      marks,
      options,
    });

    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Question added successfully!" });
      setQuestionText("");
      setOpt1("");
      setOpt2("");
      setOpt3("");
      setOpt4("");
      setActiveQuizForQuestion(null);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to add question." });
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

      {/* Header Selector */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Course Quiz Inventory</CardTitle>
            <CardDescription className="text-xs">
              Configure quizzes and assessment criteria for employability courses
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <Button variant="accent" size="sm" onClick={() => setIsCreateQuizOpen(true)} className="gap-1.5 text-xs font-semibold whitespace-nowrap">
              <Plus className="h-4 w-4" /> Create Quiz
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quiz List */}
      <div className="space-y-6">
        {quizzes.length === 0 ? (
          <Card className="p-12 text-center border border-dashed border-slate-200 space-y-3">
            <HelpCircle className="h-8 w-8 mx-auto text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-800">No Quizzes Created for Selected Course</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &quot;Create Quiz&quot; above to add a new assessment module.
            </p>
          </Card>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden border-slate-200">
              <CardHeader className="bg-slate-50 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Passing Score: {quiz.passingScore}%</Badge>
                    <span className="text-xs text-slate-500 font-mono">{quiz.questions.length} Questions</span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 pt-1">{quiz.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuestionText("");
                      setMarks(10);
                      setOpt1("");
                      setOpt2("");
                      setOpt3("");
                      setOpt4("");
                      setCorrectOptIdx(0);
                      setActiveQuizForQuestion(quiz.id);
                    }}
                    className="h-8 text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Question
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    disabled={loadingId === `del-quiz-${quiz.id}`}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                  >
                    {loadingId === `del-quiz-${quiz.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {quiz.questions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No questions added yet to this quiz.</p>
                ) : (
                  quiz.questions.map((ques, qIdx) => (
                    <div key={ques.id} className="p-3 border border-slate-100 rounded-lg text-xs space-y-2 bg-white">
                      <div className="flex justify-between items-start font-semibold text-slate-900">
                        <span>{qIdx + 1}. {ques.questionText}</span>
                        <Badge variant="outline">{ques.marks} Marks</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                        {ques.options.map((opt) => (
                          <div key={opt.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-1.5">
                            <span className="font-mono text-slate-400">•</span>
                            <span>{opt.optionText}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Quiz Modal */}
      {isCreateQuizOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Quiz Assessment</h3>
              <button onClick={() => setIsCreateQuizOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
              <Input
                label="Quiz Title"
                placeholder="e.g., Oral Technical Presentation Assessment"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Quiz Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of assessment objectives..."
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Input
                label="Passing Threshold Score (%)"
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateQuizOpen(false)}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={loadingId === "create-quiz"}>
                  {loadingId === "create-quiz" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Quiz"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question & Multiple-Choice Builder Modal */}
      {activeQuizForQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Question & Correct Answer Key</h3>
              <button onClick={() => setActiveQuizForQuestion(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs">
              <Input
                label="Question Text"
                placeholder="e.g., What is the primary purpose of the STAR interview framework?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
              <Input
                label="Marks Allocated"
                type="number"
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value) || 10)}
                required
              />

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Multiple-Choice Options (Select Radio for Correct Answer)
                </label>
                {[opt1, opt2, opt3, opt4].map((optVal, idx) => {
                  const setOptVal = [setOpt1, setOpt2, setOpt3, setOpt4][idx];
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIdx === idx}
                        onChange={() => setCorrectOptIdx(idx)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <Input
                        placeholder={`Option ${idx + 1} choice text...`}
                        value={optVal}
                        onChange={(e) => setOptVal(e.target.value)}
                        required={idx < 2}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveQuizForQuestion(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loadingId === "add-question"}>
                  {loadingId === "add-question" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Question Key"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const QuizManagerClient = AdminQuizManagerClient;
