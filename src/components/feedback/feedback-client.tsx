"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { CheckCircle2, Star, Send, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/research";

interface FeedbackClientProps {
  studentName: string;
}

export function FeedbackClient({ studentName }: FeedbackClientProps) {
  const { showToast } = useToast();

  const [usabilityRating, setUsabilityRating] = useState(5);
  const [experienceRating, setExperienceRating] = useState(5);
  const [aiUsefulnessRating, setAiUsefulnessRating] = useState(5);
  const [aiQualityRating, setAiQualityRating] = useState(5);
  const [navigationRating, setNavigationRating] = useState(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState(5);
  const [comments, setComments] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const surveyQuestions = [
    {
      id: "usability",
      title: "1. LMS Platform Usability",
      description: "The TGL LMS interface is intuitive, responsive, and easy to use.",
      value: usabilityRating,
      setter: setUsabilityRating,
    },
    {
      id: "experience",
      title: "2. Overall Self-Paced Learning Experience",
      description: "The course structure, syllabus breakdown, and reading materials support effective self-paced study.",
      value: experienceRating,
      setter: setExperienceRating,
    },
    {
      id: "aiUsefulness",
      title: "3. AI Learning Assistant Usefulness",
      description: "The AI Coach helped me understand complex employability concepts and lesson readings.",
      value: aiUsefulnessRating,
      setter: setAiUsefulnessRating,
    },
    {
      id: "aiQuality",
      title: "4. AI Response Quality & Citation Grounding",
      description: "AI explanations were clear, grounded in lesson context, and provided helpful source material citations.",
      value: aiQualityRating,
      setter: setAiQualityRating,
    },
    {
      id: "navigation",
      title: "5. Ease of Navigation & Layout Structure",
      description: "Navigating between the dashboard, course catalog, learning player, and progress analytics was seamless.",
      value: navigationRating,
      setter: setNavigationRating,
    },
    {
      id: "overall",
      title: "6. Overall System Satisfaction",
      description: "Overall, I am satisfied with Thakral Global Learning LMS as a career readiness platform.",
      value: overallSatisfaction,
      setter: setOverallSatisfaction,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitFeedbackAction({
        usabilityRating,
        experienceRating,
        aiUsefulnessRating,
        aiQualityRating,
        navigationRating,
        overallSatisfaction,
        comments,
      });

      if (res.success) {
        setSubmitted(true);
        showToast("Survey Submitted!", "Thank you for supporting our BSc Computer Science research evaluation.", "success");
      } else {
        showToast("Submission Error", res.error || "Failed to submit survey.", "error");
      }
    } catch {
      showToast("Error", "An unexpected connection error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center max-w-2xl mx-auto space-y-4 bg-white border-slate-200">
        <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <Badge variant="success" className="mx-auto">Survey Completed</Badge>
        <h2 className="text-xl font-bold text-slate-900">Thank You, {studentName}!</h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          Your Likert evaluation ratings have been recorded in our research dataset. They directly contribute to answering our core research questions on AI-powered LMS effectiveness.
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <Card className="p-6 space-y-6 bg-white border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <Badge variant="accent" className="w-fit mb-2">5-Point Likert Scale Evaluation</Badge>
          <h2 className="text-lg font-bold text-slate-900">Student Usability & Learning Experience Survey</h2>
          <p className="text-xs text-slate-500 mt-1">
            Rate each statement from <strong>1 (Strongly Disagree)</strong> to <strong>5 (Strongly Agree)</strong>.
          </p>
        </div>

        {/* 6 Likert Scale Questions */}
        <div className="space-y-6">
          {surveyQuestions.map((q) => (
            <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{q.title}</h3>
                <p className="text-xs text-slate-500">{q.description}</p>
              </div>

              {/* Radio Button Group (1 to 5) */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((rating) => {
                  const isSelected = q.value === rating;
                  const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => q.setter(rating)}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-amber-400 border-slate-900 font-bold shadow-xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block text-sm font-black">{rating}</span>
                      <span className="block text-[9px] leading-tight text-slate-400 font-medium">
                        {labels[rating - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Qualitative Comments Field */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-blue-600" /> Qualitative Feedback / Recommendations (Optional)
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any additional thoughts on how the AI assistant or course player supported your self-paced study..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="accent" type="submit" disabled={loading} className="gap-2 px-6 font-bold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Submit Survey
          </Button>
        </div>
      </Card>
    </form>
  );
}
