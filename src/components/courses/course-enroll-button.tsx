"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Loader2, LogIn } from "lucide-react";
import { enrollInCourseAction } from "@/app/actions/lms";

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}

export function CourseEnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  isLoggedIn,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <Link href={`/login?callbackUrl=/courses/${courseSlug}`} className="w-full">
        <Button variant="accent" className="w-full text-xs gap-1.5">
          <LogIn className="h-4 w-4" /> Sign In to Enroll in Course
        </Button>
      </Link>
    );
  }

  if (isEnrolled) {
    return (
      <Link href={`/courses/${courseSlug}/learn`} className="w-full">
        <Button variant="outline" className="w-full text-xs gap-1.5 border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Enrolled • Continue Course
        </Button>
      </Link>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await enrollInCourseAction(courseId);
      if (res.success) {
        router.push(`/courses/${courseSlug}/learn`);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to complete course enrollment.");
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {errorMsg && (
        <p className="text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200">
          {errorMsg}
        </p>
      )}

      <Button
        variant="accent"
        className="w-full text-xs gap-1.5 font-bold shadow-sm"
        onClick={handleEnroll}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" /> Enrolling Candidate...
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4" /> Enroll Now in Course
          </>
        )}
      </Button>
    </div>
  );
}
