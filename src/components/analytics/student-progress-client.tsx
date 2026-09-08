"use client";

import { StudentDetailedProgress } from "@/lib/analytics-db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Flame,
  Clock,
  TrendingUp,
  FileCheck,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

interface StudentProgressClientProps {
  data: StudentDetailedProgress;
}

export function StudentProgressClient({ data }: StudentProgressClientProps) {
  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Employability Progress"
          value={`${data.overallProgress}%`}
          change="Computed Live"
          trend="up"
          description="Average course completion"
          icon={<Award className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Completed Lessons"
          value={`${data.totalCompletedLessons} Lessons`}
          description={`Out of ${data.totalLessonsInEnrolled} total lessons`}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Average Assessment Score"
          value={`${data.avgQuizScore}%`}
          change="PostgreSQL Computed"
          trend="up"
          description="Across all quiz attempts"
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
        />
        <StatCard
          title="Active Learning Streak"
          value={`${data.learningStreakDays} Days`}
          description="Consecutive daily focus"
          icon={<Flame className="h-5 w-5 text-red-600" />}
        />
      </div>

      {/* Main Grid: Course Breakdown & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Course-by-Course Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" /> Course Progress Breakdown
                </CardTitle>
                <CardDescription>Dynamic completion metrics for enrolled courses</CardDescription>
              </div>
              <Badge variant="default">{data.totalEnrolledCourses} Enrolled</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.courseBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No active course enrollments.</p>
              ) : (
                data.courseBreakdown.map((c) => (
                  <div key={c.courseId} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{c.category}</Badge>
                        <span className="font-bold text-slate-900 text-sm">{c.courseTitle}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{c.progressPercent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          c.progressPercent === 100 ? "bg-emerald-600" : "bg-blue-600"
                        }`}
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{c.completedLessons} of {c.totalLessons} Lessons Completed</span>
                      <Link href={`/courses/${c.courseId}/learn`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 gap-1">
                          <PlayCircle className="h-3.5 w-3.5" /> Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Assessment & Quiz Attempt History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-purple-600" /> Assessment & Quiz History
              </CardTitle>
              <CardDescription>Server-graded quiz results and score percentages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.quizAttemptsHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No quiz attempts recorded yet.</p>
              ) : (
                data.quizAttemptsHistory.map((att) => (
                  <div key={att.attemptId} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl text-xs hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 block">{att.quizTitle}</span>
                      <span className="text-slate-500 text-[11px]">Score: {att.score} / {att.maxScore} Marks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">{att.percentage}%</span>
                      <Badge variant={att.passed ? "success" : "danger"}>
                        {att.passed ? "PASSED" : "FAILED"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Completed Lessons Log */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Completed Lessons Log
              </CardTitle>
              <CardDescription>Verified lesson achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {data.completedLessonsList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">No completed lessons yet.</p>
              ) : (
                data.completedLessonsList.map((les) => (
                  <div key={les.lessonId} className="p-3 bg-slate-50 rounded-lg space-y-1 text-xs border border-slate-100">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 block leading-snug">{les.lessonTitle}</span>
                        <span className="text-[11px] text-slate-500 block">{les.courseTitle}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
