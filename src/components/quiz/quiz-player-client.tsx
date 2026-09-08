"use client";

import { useState } from "react";
import Link from "next/link";
import { QuizStudentDetails, QuizAttemptResult } from "@/lib/quiz-db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Loader2,
  AlertTriangle,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { startQuizAttemptAction, submitQuizAttemptAction } from "@/app/actions/quiz";

interface QuizPlayerClientProps {
  courseSlug: string;
  courseTitle: string;
  quiz: QuizStudentDetails;
  initialAttemptResults: QuizAttemptResult | null;
}

export function QuizPlayerClient({
  courseSlug,
  courseTitle,
  quiz,
  initialAttemptResults,
}: QuizPlayerClientProps) {
  const [results, setResults] = useState<QuizAttemptResult | null>(initialAttemptResults);

  // Active quiz state
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const questions = quiz.questions;
  const currentQuestion = questions[activeQuestionIndex];
  const totalQuestions = questions.length;

  const handleStartQuiz = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await startQuizAttemptAction(quiz.id);
      if (res.success && res.attemptId) {
        setAttemptId(res.attemptId);
        setActiveQuestionIndex(0);
        setSelectedAnswers({});
        setResults(null);
      } else {
        setErrorMsg(res.error || "Failed to start quiz attempt.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!attemptId) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await submitQuizAttemptAction({
        attemptId,
        answers: selectedAnswers,
      });
      if (res.success) {
        setIsSubmitModalOpen(false);
        // Refresh window or update URL to view attempt results
        window.location.href = `/courses/${courseSlug}/quiz/${quiz.id}?attemptId=${res.attemptId}`;
      } else {
        setErrorMsg(res.error || "Failed to submit quiz.");
      }
    } catch {
      setErrorMsg("An error occurred during quiz evaluation.");
    } finally {
      setLoading(false);
    }
  };

  // Render Attempt Review Mode
  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 flex-1 w-full">
        {/* Results Overview Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href={`/courses/${courseSlug}/learn`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Course Lessons
          </Link>
          <Badge variant={results.passed ? "success" : "danger"} className="text-xs px-3 py-1 font-bold">
            {results.passed ? "ASSESSMENT PASSED" : "ASSESSMENT FAILED"}
          </Badge>
        </div>

        {/* Score Card */}
        <Card className="p-8 text-center space-y-6 shadow-md border-slate-200 bg-white">
          <div className="space-y-2">
            <Badge variant="default">{quiz.title}</Badge>
            <h1 className="text-3xl font-extrabold text-slate-900">Quiz Assessment Results</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Evaluation computed server-side from PostgreSQL database rules. Passing Score: {quiz.passingScore}%.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-bold block uppercase">Percentage</span>
              <span className={`text-2xl font-extrabold ${results.passed ? "text-emerald-600" : "text-red-600"}`}>
                {results.percentage}%
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-bold block uppercase">Earned Score</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {results.score} / {results.maxScore}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-bold block uppercase">Result Status</span>
              <span className={`text-2xl font-extrabold ${results.passed ? "text-emerald-600" : "text-red-600"}`}>
                {results.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button variant="accent" size="sm" onClick={handleStartQuiz} disabled={loading} className="gap-1.5 font-bold">
              <RotateCcw className="h-4 w-4" /> Retry Assessment
            </Button>
            <Link href={`/courses/${courseSlug}/learn`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileCheck className="h-4 w-4 text-emerald-600" /> Continue Course
              </Button>
            </Link>
          </div>
        </Card>

        {/* Detailed Question Review Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" /> Detailed Answer Breakdown
          </h2>

          {results.questions.map((ques, idx) => (
            <Card key={ques.id} className="p-6 border-slate-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  {ques.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Question {idx + 1} ({ques.marks} Marks)</span>
                    <h3 className="text-base font-semibold text-slate-900">{ques.questionText}</h3>
                  </div>
                </div>
                <Badge variant={ques.isCorrect ? "success" : "danger"}>
                  {ques.isCorrect ? `+${ques.marks} Marks` : "0 Marks"}
                </Badge>
              </div>

              <div className="space-y-2">
                {ques.options.map((opt) => {
                  const isSelected = opt.id === ques.selectedOptionId;
                  const isCorrect = opt.isCorrect;

                  let optBg = "bg-white border-slate-200 text-slate-700";
                  if (isCorrect) optBg = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                  else if (isSelected && !isCorrect) optBg = "bg-red-50 border-red-300 text-red-900 font-semibold";

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between ${optBg}`}
                    >
                      <span>{opt.optionText}</span>
                      <div className="flex items-center gap-2">
                        {isSelected && <Badge variant="outline" className="text-[10px]">Your Answer</Badge>}
                        {isCorrect && <Badge variant="success" className="text-[10px]">Correct Answer</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render Start Quiz Welcome Screen if attempt not started yet
  if (!attemptId) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-6 my-auto w-full">
        <Card className="p-8 text-center space-y-6 shadow-md border-slate-200 bg-white">
          <div className="space-y-2">
            <Badge variant="accent" className="w-fit mx-auto">{quiz.title}</Badge>
            <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {quiz.description || "Test your knowledge and verify employability competencies for this module."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs max-w-sm mx-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[11px]">Questions</span>
              <span className="font-bold text-slate-900">{quiz.questions.length} Items</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Passing Score</span>
              <span className="font-bold text-emerald-600">{quiz.passingScore}% Correct</span>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded border border-red-200">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-center gap-3">
            <Link href={`/courses/${courseSlug}/learn`}>
              <Button variant="outline" size="sm">Cancel</Button>
            </Link>
            <Button variant="accent" size="sm" onClick={handleStartQuiz} disabled={loading} className="gap-1.5 font-bold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Assessment Now"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render Active Question Player
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQuestions > 0 ? Math.round(((activeQuestionIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 md:p-10 space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
            {quiz.title}
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            Question {activeQuestionIndex + 1} of {totalQuestions}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-600 block">
            Progress: <strong className="text-blue-600">{progressPercent}%</strong>
          </span>
          <span className="text-[11px] text-slate-400">
            {answeredCount} of {totalQuestions} Answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <Card className="p-6 space-y-6 border-slate-200 bg-white shadow-xs">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.questionText}
            </h3>
            <Badge variant="outline" className="shrink-0">{currentQuestion.marks} Marks</Badge>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span>{opt.optionText}</span>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Quiz Player Controls */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeQuestionIndex === 0}
          className="gap-1 text-xs"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {activeQuestionIndex < totalQuestions - 1 ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            className="gap-1 text-xs"
          >
            Next Question <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="accent"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <FileCheck className="h-4 w-4" /> Submit Quiz Assessment
          </Button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-blue-600" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Submit Quiz Assessment?</h3>
              <p className="text-xs text-slate-500">
                You have answered {answeredCount} of {totalQuestions} questions. Your score will be evaluated server-side immediately.
              </p>
            </div>
            {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
                Review Answers
              </Button>
              <Button variant="accent" size="sm" onClick={handleSubmitQuiz} disabled={loading} className="font-bold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Confirm Submission"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
