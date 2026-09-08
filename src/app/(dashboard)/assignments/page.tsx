"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle2, FileText, Calendar, Clock } from "lucide-react";

export default function StudentAssignmentsPage() {
  const [uploaded, setUploaded] = useState<{ [key: string]: boolean }>({});

  const assignments = [
    {
      id: "asg-1",
      title: "Executive Presentation Outline & Recording",
      course: "Communication Skills for Employability",
      dueDate: "Sep 12, 2026",
      maxScore: 100,
      status: "PENDING",
      description: "Submit a 2-page executive summary PDF and unlisted presentation video link.",
    },
    {
      id: "asg-2",
      title: "STAR Behavioral Interview Response Sheet",
      course: "Communication Skills for Employability",
      dueDate: "Sep 05, 2026",
      maxScore: 100,
      status: "GRADED",
      grade: 92,
      feedback: "Strong application of STAR methodology. Clear metrics included.",
    },
  ];

  const handleSimulatedUpload = (id: string) => {
    setUploaded({ ...uploaded, [id]: true });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Assignments & Submissions"
        description="View assigned coursework, submit PDF/DOC assignments, and check instructor grades and qualitative feedback."
        badgeText="Learner Coursework"
      />

      <div className="space-y-6">
        {assignments.map((asg) => (
          <Card key={asg.id} className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <Badge variant="default" className="mb-1">{asg.course}</Badge>
                <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-3 pt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Due: {asg.dueDate}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Max Score: {asg.maxScore}</span>
                </p>
              </div>

              {asg.grade !== undefined ? (
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right shrink-0">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Graded Score</span>
                  <span className="text-xl font-extrabold text-emerald-700">{asg.grade} / {asg.maxScore}</span>
                </div>
              ) : (
                <Badge variant="warning" className="shrink-0">Pending Submission</Badge>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

            {asg.feedback && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Instructor Feedback:</span>
                <p className="italic">"{asg.feedback}"</p>
              </div>
            )}

            {asg.status === "PENDING" && (
              <div className="pt-2 flex items-center justify-between">
                {uploaded[asg.id] ? (
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Submission Uploaded (File: assignment-submission.pdf)
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full">
                    <input type="file" className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800" />
                    <Button onClick={() => handleSimulatedUpload(asg.id)} variant="accent" size="sm" className="gap-1.5 font-semibold text-xs shrink-0">
                      <Upload className="h-4 w-4" /> Upload & Submit
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
