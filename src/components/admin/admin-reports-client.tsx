"use client";

import { useState } from "react";
import { AdminReportRow, AdminAnalyticsChartsData } from "@/lib/analytics-db";
import { CourseWithDetails } from "@/lib/db";
import { AdminStudentInfo } from "@/lib/admin-db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Filter,
  BarChart2,
  TrendingUp,
  Download,
  Users,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface AdminReportsClientProps {
  initialReports: AdminReportRow[];
  charts: AdminAnalyticsChartsData;
  courses: CourseWithDetails[];
  students: AdminStudentInfo[];
}

export function AdminReportsClient({
  initialReports,
  charts,
  courses,
  students,
}: AdminReportsClientProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  const filteredReports = initialReports.filter((r) => {
    if (selectedCourseId !== "all" && r.courseId !== selectedCourseId) return false;
    if (selectedStudentId !== "all" && r.studentId !== selectedStudentId) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Multi-Filter Bar Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-blue-600" /> Multi-Filter Report Control
          </CardTitle>
          <CardDescription className="text-xs">
            Filter institutional progress records by course, candidate student, or date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Filter by Course */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Filter by Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Employability Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Student Candidate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Filter by Candidate Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Candidate Students</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Date Range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Filter by Time Period</label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Time Records</option>
                <option value="7d">Past 7 Days</option>
                <option value="30d">Past 30 Days</option>
                <option value="90d">Past 90 Days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-blue-600" /> Weekly Candidate Enrollment Trends
            </CardTitle>
            <CardDescription className="text-xs">Daily candidate registration frequency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-3 h-40 pt-4 px-2 border-b border-slate-200">
              {charts.enrollmentTrends.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (item.count / 15) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div
                      className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Quiz Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" /> Quiz Performance Distribution
            </CardTitle>
            <CardDescription className="text-xs">Candidate score range breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {charts.quizPerformance.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Score Range: {item.range}</span>
                  <span className="font-bold text-purple-700">{item.count} Candidates</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${(item.count / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Institutional Report Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Institutional Employability Report Table</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredReports.length} candidate progress records
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" /> Export Data (CSV)
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Candidate Student</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Course Progress</th>
                  <th className="px-4 py-3">Avg Quiz Score</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                      No report records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>
                          <span className="block">{row.studentName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{row.studentEmail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.courseTitle}</td>
                      <td className="px-4 py-3">
                        <Badge variant="default">{row.category}</Badge>
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600">{row.progressPercent}%</td>
                      <td className="px-4 py-3 font-bold text-purple-600">{row.avgQuizScore}%</td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={row.progressPercent === 100 ? "success" : "secondary"}>
                          {row.progressPercent === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
