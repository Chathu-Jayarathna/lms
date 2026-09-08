"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseWithDetails } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Search, Filter, CheckCircle2, User, ArrowRight } from "lucide-react";

interface CoursesClientProps {
  courses: CourseWithDetails[];
  enrolledCourseIds: string[];
}

export function CoursesClient({ courses, enrolledCourseIds }: CoursesClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Soft Skills", "Leadership", "Personal Development", "Technical Skills", "Career Prep"];
  const enrolledSet = new Set(enrolledCourseIds);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Search courses, skills, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium">
            <Filter className="h-3.5 w-3.5" /> Category:
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <BookOpen className="h-10 w-10 mx-auto text-slate-300" />
            <h3 className="text-base font-semibold text-slate-800">No Courses Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No employability courses match your current search criteria. Try selecting another category or clearing search filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledSet.has(course.id);

            return (
              <Card key={course.id} className="flex flex-col justify-between hover:shadow-md transition-all">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="default">{course.category}</Badge>
                    <span className="text-xs font-semibold text-slate-500">{course.level}</span>
                  </div>
                  <CardTitle className="text-lg leading-snug pt-1">{course.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-3 leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-600">
                        <BookOpen className="h-3.5 w-3.5 text-blue-600" /> {course.modulesCount} Modules ({course.lessonsCount} Lessons)
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-amber-600" /> {course.durationMins} Mins
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 pt-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Instructor: <strong className="text-slate-700 font-semibold">{course.instructorName}</strong></span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  {isEnrolled ? (
                    <Link href={`/courses/${course.slug}/learn`} className="w-full">
                      <Button variant="outline" className="w-full text-xs gap-1.5 border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Enrolled • Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/courses/${course.slug}`} className="w-full">
                      <Button variant="primary" className="w-full text-xs gap-1.5">
                        View Details & Syllabus <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
