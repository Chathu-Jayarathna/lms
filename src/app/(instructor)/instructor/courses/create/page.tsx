"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCourseAction } from "@/app/actions/admin";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Software Engineering",
    level: "Beginner",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await createCourseAction(formData);
    if (res.success) {
      router.push("/instructor/courses");
      router.refresh();
    } else {
      setError(res.error || "Failed to create course.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <Link href="/instructor/courses">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-slate-500">
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Create New Employability Course"
        description="Define course title, category, description, and skill matrix parameters."
        badgeText="Course Creation Wizard"
      />

      <Card>
        <CardHeader>
          <CardTitle>Course Metadata</CardTitle>
          <CardDescription>Enter course details to initialize the curriculum shell.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course Title *</label>
              <Input
                required
                placeholder="e.g. Advanced System Design & Microservices"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Difficulty Level</label>
                <select
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Course Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detail key learning outcomes and target employability competencies..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Link href="/instructor/courses">
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="accent" size="sm" disabled={loading} className="gap-2 font-semibold">
                <Save className="h-4 w-4" /> {loading ? "Creating..." : "Save & Continue to Modules"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
