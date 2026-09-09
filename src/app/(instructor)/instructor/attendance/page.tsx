"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { markAttendanceAction } from "@/app/actions/instructor";
import { CheckCircle2, XCircle, Clock, Save, User } from "lucide-react";

export default function InstructorAttendancePage() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [courseId, setCourseId] = useState("c-comm-1");

  const [students, setStudents] = useState([
    { userId: "candidate-alex-123", name: "Alex Morgan", status: "PRESENT" },
    { userId: "candidate-sam-456", name: "Sam Techson", status: "PRESENT" },
    { userId: "candidate-jordan-789", name: "Jordan Lee", status: "LATE" },
    { userId: "candidate-taylor-101", name: "Taylor Swift", status: "ABSENT" },
  ]);

  const toggleStatus = (userId: string, newStatus: string) => {
    setStudents(
      students.map((s) => (s.userId === userId ? { ...s, status: newStatus } : s))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setFeedback(null);

    const records = students.map((s) => ({
      userId: s.userId,
      status: s.status as any,
    }));

    const res = await markAttendanceAction(courseId, records);
    if (res.success) {
      setFeedback("Attendance marked successfully!");
    } else {
      setFeedback(res.error || "Failed to mark attendance.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interactive Attendance Manager"
        description="Mark and export student attendance for course sessions."
        badgeText="Classroom Governance"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Session Roster</CardTitle>
            <CardDescription>Select student attendance status for today's session</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="c-comm-1">Communication Skills for Employability</option>
              <option value="c-tech-2">Full-Stack Software Engineering Prep</option>
              <option value="c-data-3">AI & Data Engineering Bootcamp</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              {feedback}
            </div>
          )}

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
            {students.map((st) => (
              <div key={st.userId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs">{st.name}</h4>
                    <span className="text-[10px] text-slate-500">ID: {st.userId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(st.userId, "PRESENT")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 transition-all ${
                      st.status === "PRESENT"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Present
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleStatus(st.userId, "LATE")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 transition-all ${
                      st.status === "LATE"
                        ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" /> Late
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleStatus(st.userId, "ABSENT")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1 transition-all ${
                      st.status === "ABSENT"
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" /> Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading}
              variant="accent"
              className="gap-2 font-semibold text-xs"
            >
              <Save className="h-4 w-4" /> {loading ? "Saving Records..." : "Save Session Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
