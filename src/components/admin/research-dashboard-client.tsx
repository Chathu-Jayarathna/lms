"use client";

import { ResearchAnalyticsData } from "@/app/actions/research";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  TrendingUp,
  Users,
  Star,
  Sparkles,
  BarChart2,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

interface ResearchDashboardClientProps {
  data: ResearchAnalyticsData;
}

export function ResearchDashboardClient({ data }: ResearchDashboardClientProps) {
  const likert = data.likertAverages;

  return (
    <div className="space-y-8">
      {/* Top Banner: Anonymized Data Notice */}
      <Card className="bg-slate-900 text-white p-5 border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Anonymized Research Dataset Active</h3>
            <p className="text-xs text-slate-300">
              Aggregated system metrics derived from candidate enrollments, lesson completions, quiz attempts, and AI conversations.
            </p>
          </div>
        </div>
        <Badge variant="accent" className="hidden sm:inline-flex">{likert.totalResponses} Survey Responses</Badge>
      </Card>

      {/* Likert Scale Averages Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-400" /> 5-Point Likert Scale Survey Averages
          </CardTitle>
          <CardDescription className="text-xs">
            Student evaluation scores (1 = Strongly Disagree, 5 = Strongly Agree)
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Usability</span>
            <span className="text-xl font-black text-slate-900">{likert.usability} / 5.0</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Experience</span>
            <span className="text-xl font-black text-slate-900">{likert.experience} / 5.0</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">AI Usefulness</span>
            <span className="text-xl font-black text-amber-600">{likert.aiUsefulness} / 5.0</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">AI Quality</span>
            <span className="text-xl font-black text-amber-600">{likert.aiQuality} / 5.0</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Navigation</span>
            <span className="text-xl font-black text-slate-900">{likert.navigation} / 5.0</span>
          </div>
          <div className="p-3 bg-slate-900 text-white border border-slate-800 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Satisfaction</span>
            <span className="text-xl font-black text-amber-400">{likert.overallSatisfaction} / 5.0</span>
          </div>
        </CardContent>
      </Card>

      {/* RESEARCH QUESTION 1: ONLINE LEARNING & ENGAGEMENT */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Badge variant="default" className="mb-1">Research Question 1</Badge>
          <h2 className="text-base font-bold text-slate-900">
            How can an AI-powered LMS improve online learning and student engagement?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Course Enrollments"
            value={`${data.researchQuestion1Data.totalEnrollments}`}
            description="Active candidate enrollments"
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Completed Lessons Count"
            value={`${data.researchQuestion1Data.totalCompletedLessons}`}
            description="Verified lesson readings"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Avg Course Completion Rate"
            value={`${data.researchQuestion1Data.avgCourseCompletionRate}%`}
            description="Student completion average"
            icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
          />
          <StatCard
            title="Active Learning Days / Week"
            value={`${data.researchQuestion1Data.engagementActiveDays} Days`}
            description="Average engagement frequency"
            icon={<Users className="h-5 w-5 text-purple-600" />}
          />
        </div>
      </div>

      {/* RESEARCH QUESTION 2: AI LEARNING ASSISTANT EFFECTIVENESS */}
      <div className="space-y-4 pt-4">
        <div className="border-b border-slate-200 pb-2">
          <Badge variant="accent" className="mb-1">Research Question 2</Badge>
          <h2 className="text-base font-bold text-slate-900">
            How effective is an AI learning assistant in supporting students during self-paced learning?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bot className="h-4 w-4 text-amber-500" /> Top RAG Study Prompts & Frequency
              </CardTitle>
              <CardDescription className="text-xs">
                Candidate question frequency using grounded lesson context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {data.researchQuestion2Data.topRAGPrompts.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>"{item.prompt}"</span>
                    <span className="font-bold text-amber-600">{item.count} Questions</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${(item.count / 30) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> AI Assistant Metrics
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">Self-paced study support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                <span>Total AI Conversations:</span>
                <strong className="text-amber-400 text-sm font-bold">{data.researchQuestion2Data.totalAIConversations}</strong>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                <span>Total AI Questions Asked:</span>
                <strong className="text-blue-400 text-sm font-bold">{data.researchQuestion2Data.totalAIQuestionsAsked}</strong>
              </div>
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                <span>AI Perception Rating:</span>
                <strong className="text-emerald-400 text-sm font-bold">{data.researchQuestion2Data.aiSatisfactionPercent}% Positive</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RESEARCH QUESTION 3: CENTRALIZED LMS & PROGRESS TRACKING */}
      <div className="space-y-4 pt-4">
        <div className="border-b border-slate-200 pb-2">
          <Badge variant="secondary" className="mb-1">Research Question 3</Badge>
          <h2 className="text-base font-bold text-slate-900">
            Can a centralized Learning Management System improve course management and student progress tracking?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Employability Courses"
            value={`${data.researchQuestion3Data.totalActiveCourses}`}
            description="Catalog curriculum count"
            icon={<BookOpen className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Average Quiz Score"
            value={`${data.researchQuestion3Data.avgQuizScorePercent}%`}
            description="Server-evaluated assessments"
            icon={<FileCheck className="h-5 w-5 text-purple-600" />}
          />
          <StatCard
            title="Assessment Pass Rate"
            value={`${data.researchQuestion3Data.quizPassRatePercent}%`}
            description="Passed >= 70% threshold"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Institutional Skill Index"
            value={`${data.researchQuestion3Data.institutionalSkillIndex} / 100`}
            description="Employability readiness metric"
            icon={<Award className="h-5 w-5 text-amber-600" />}
          />
        </div>
      </div>
    </div>
  );
}
