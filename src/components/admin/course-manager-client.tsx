"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseWithDetails } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
  togglePublishCourseAction,
} from "@/app/actions/admin";

interface CourseManagerClientProps {
  courses: CourseWithDetails[];
}

export function CourseManagerClient({ courses }: CourseManagerClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseWithDetails | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Soft Skills");
  const [formLevel, setFormLevel] = useState("Beginner");
  const [formImageUrl, setFormImageUrl] = useState("");

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setFormTitle("");
    setFormDescription("");
    setFormCategory("Soft Skills");
    setFormLevel("Beginner");
    setFormImageUrl("/images/default-course.jpg");
    setIsCreateOpen(true);
  };

  const openEditModal = (c: CourseWithDetails) => {
    setEditCourse(c);
    setFormTitle(c.title);
    setFormDescription(c.description);
    setFormCategory(c.category);
    setFormLevel(c.level);
    setFormImageUrl(c.imageUrl || "/images/default-course.jpg");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId("create");
    setFeedback(null);

    const res = await createCourseAction({
      title: formTitle,
      description: formDescription,
      category: formCategory,
      level: formLevel,
      imageUrl: formImageUrl,
    });

    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Course created!" });
      setIsCreateOpen(false);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to create course." });
    }
    setLoadingId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;
    setLoadingId("edit");
    setFeedback(null);

    const res = await updateCourseAction(editCourse.id, {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      level: formLevel,
      imageUrl: formImageUrl,
    });

    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Course updated!" });
      setEditCourse(null);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to update course." });
    }
    setLoadingId(null);
  };

  const handleTogglePublish = async (courseId: string) => {
    setLoadingId(`pub-${courseId}`);
    setFeedback(null);
    const res = await togglePublishCourseAction(courseId);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Status updated!" });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to toggle status." });
    }
    setLoadingId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCourseId) return;
    setLoadingId(`del-${deleteCourseId}`);
    setFeedback(null);
    const res = await deleteCourseAction(deleteCourseId);
    if (res.success) {
      setFeedback({ type: "success", text: res.message || "Course deleted!" });
      setDeleteCourseId(null);
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to delete course." });
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

      {/* Action Header & Search */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base">Course Inventory Directory</CardTitle>
            <CardDescription className="text-xs">
              {filteredCourses.length} courses registered in PostgreSQL database
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search course title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <Button variant="accent" size="sm" onClick={openCreateModal} className="gap-1.5 whitespace-nowrap text-xs font-semibold">
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Curriculum</th>
                  <th className="px-4 py-3">Publish Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{c.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{c.category}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{c.level}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {c.modulesCount} Modules / {c.lessonsCount} Lessons
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(c.id)}
                        disabled={loadingId === `pub-${c.id}`}
                        className="cursor-pointer"
                      >
                        <Badge variant={c.isPublished ? "success" : "warning"}>
                          {loadingId === `pub-${c.id}` ? "Updating..." : c.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5">
                      <Link href={`/admin/courses/${c.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1" title="Manage Modules & Lessons">
                          <BookOpen className="h-3.5 w-3.5 text-blue-600" /> Modules
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(c)} className="h-8 w-8 p-0" title="Edit Metadata">
                        <Edit3 className="h-3.5 w-3.5 text-slate-700" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteCourseId(c.id)} className="h-8 w-8 p-0 hover:bg-red-50" title="Delete Course">
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Course Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Employability Course</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <Input label="Course Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Course Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 text-xs"
                  >
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Career Prep">Career Prep</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Difficulty Level</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" variant="accent" disabled={loadingId === "create"}>
                  {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Course Metadata</h3>
              <button onClick={() => setEditCourse(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <Input label="Course Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Course Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 text-xs"
                  >
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Personal Development">Personal Development</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Career Prep">Career Prep</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Difficulty Level</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditCourse(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loadingId === "edit"}>
                  {loadingId === "edit" ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Update Metadata"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCourseId && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto text-red-600" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Course Permanently?</h3>
              <p className="text-xs text-slate-500">
                This will delete the course along with all associated modules, lessons, and student progress records in PostgreSQL. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteCourseId(null)}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={loadingId === `del-${deleteCourseId}`}
              >
                {loadingId === `del-${deleteCourseId}` ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
