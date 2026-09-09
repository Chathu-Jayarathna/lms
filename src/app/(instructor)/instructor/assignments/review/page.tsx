"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { gradeAssignmentSubmissionAction } from "@/app/actions/instructor";
import { PenTool, Download, CheckCircle2, User } from "lucide-react";

export default function AssignmentReviewPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState([
    {
      id: "sub-1",
      studentName: "Alex Morgan",
      assignmentTitle: "Executive Speech Outline & Video Link",
      courseTitle: "Communication Skills for Employability",
      submittedAt: "Yesterday at 14:30",
      fileUrl: "/assignments/alex-speech-outline.pdf",
      fileName: "alex-speech-outline.pdf",
      grade: 92,
      feedback: "Excellent structure and active listening application.",
    },
    {
      id: "sub-2",
      studentName: "Sam Techson",
      assignmentTitle: "STAR Interview Behavioral Reponses",
      courseTitle: "Communication Skills for Employability",
      submittedAt: "2 days ago",
      fileUrl: "/assignments/sam-star-responses.pdf",
      fileName: "sam-star-responses.pdf",
      grade: null,
      feedback: "",
    },
  ]);

  const handleGrade = async (id: string, grade: number, feedback: string) => {
    setLoadingId(id);
    setFeedbackMsg(null);

    const res = await gradeAssignmentSubmissionAction(id, grade, feedback);
    if (res.success) {
      setSubmissions(
        submissions.map((s) => (s.id === id ? { ...s, grade, feedback } : s))
      );
      setFeedbackMsg("Submission graded successfully!");
    } else {
      setFeedbackMsg(res.error || "Failed to grade submission.");
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignment Submissions & Grading Portal"
        description="Review student uploaded PDFs/DOCs, leave qualitative feedback, and submit numerical score grades."
        badgeText="Assessment Evaluation"
      />

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {feedbackMsg}
        </div>
      )}

      <div className="space-y-6">
        {submissions.map((sub) => (
          <Card key={sub.id} className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <Badge variant="default" className="mb-1">{sub.courseTitle}</Badge>
                <h3 className="text-base font-bold text-slate-900">{sub.assignmentTitle}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Submitted by <strong className="text-slate-800">{sub.studentName}</strong> • {sub.submittedAt}
                </p>
              </div>
              <a href={sub.fileUrl} download className="shrink-0">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download {sub.fileName}
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Numerical Grade (Out of 100)</label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={sub.grade ?? 85}
                  id={`grade-${sub.id}`}
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Instructor Feedback & Comments</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Provide constructive feedback for candidate placement..."
                    defaultValue={sub.feedback}
                    id={`feedback-${sub.id}`}
                  />
                  <Button
                    onClick={() => {
                      const gradeInput = document.getElementById(`grade-${sub.id}`) as HTMLInputElement;
                      const feedbackInput = document.getElementById(`feedback-${sub.id}`) as HTMLInputElement;
                      handleGrade(sub.id, parseInt(gradeInput.value) || 0, feedbackInput.value);
                    }}
                    disabled={loadingId === sub.id}
                    variant="accent"
                    size="sm"
                    className="shrink-0 gap-1 font-semibold text-xs"
                  >
                    <PenTool className="h-3.5 w-3.5" /> {loadingId === sub.id ? "Saving..." : "Submit Grade"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
