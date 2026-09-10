"use client";

import { useState } from "react";
import { AdminStudentInfo } from "@/lib/admin-db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Eye, BookOpen, GraduationCap, Award, Mail, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StudentsClientProps {
  students: AdminStudentInfo[];
}

export function StudentsClient({ students }: StudentsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentInfo | null>(null);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetJobRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Registered Candidate Directory</CardTitle>
            <CardDescription className="text-xs">
              {filteredStudents.length} candidate accounts in database
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search by student name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Target Career Role</th>
                  <th className="px-4 py-3">Enrolled Courses</th>
                  <th className="px-4 py-3">Avg Progress</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                      No candidate students found matching search filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-900 text-amber-400 font-bold text-[11px] flex items-center justify-center">
                          {s.name.substring(0, 2).toUpperCase()}
                        </div>
                        {s.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{s.email}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{s.targetJobRole}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {s.enrolledCount} Enrolled ({s.completedCount} Completed)
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            s.avgProgress === 100
                              ? "success"
                              : s.avgProgress > 50
                              ? "accent"
                              : "secondary"
                          }
                        >
                          {s.avgProgress}% Score
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(s)}
                          className="h-8 px-2 text-xs gap-1"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-600" /> Inspect Candidate
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Details Inspector Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center">
                  {selectedStudent.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Job Role</span>
                  <span className="font-bold text-slate-900">{selectedStudent.targetJobRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Overall Skill Score</span>
                  <span className="font-bold text-blue-600">{selectedStudent.avgProgress}% Average</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Candidate Enrollments & Progress
                </h4>

                {selectedStudent.enrollments.length === 0 ? (
                  <p className="text-slate-400 italic py-2">No courses enrolled yet.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedStudent.enrollments.map((enr, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-lg space-y-1.5 bg-white">
                        <div className="flex justify-between items-center font-semibold text-slate-900">
                          <span className="line-clamp-1 max-w-[240px]">{enr.courseTitle}</span>
                          <span className="text-blue-600 font-bold">{enr.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              enr.progressPercent === 100 ? "bg-emerald-600" : "bg-blue-600"
                            }`}
                            style={{ width: `${enr.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
