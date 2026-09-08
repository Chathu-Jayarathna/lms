import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, FileCheck, PenTool } from "lucide-react";

export default async function StudentCalendarPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/calendar");
  }

  const events = [
    {
      id: "ev-1",
      date: "Sep 08, 2026",
      time: "10:00 AM",
      title: "Active Listening Practice Quiz Deadline",
      type: "QUIZ",
      course: "Communication Skills for Employability",
    },
    {
      id: "ev-2",
      date: "Sep 12, 2026",
      time: "11:59 PM",
      title: "Executive Presentation Summary PDF Due",
      type: "ASSIGNMENT",
      course: "Communication Skills for Employability",
    },
    {
      id: "ev-3",
      date: "Sep 15, 2026",
      time: "02:00 PM",
      title: "Live Mock Technical Interview Simulation Session",
      type: "LIVE_SESSION",
      course: "Full-Stack Software Engineering Prep",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Academic & Quiz Schedule - ${session.name}`}
        description="Upcoming quiz deadlines, assignment due dates, and live instructor workshop sessions."
        badgeText="Schedule Matrix"
      />

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Academic Milestones</CardTitle>
          <CardDescription>Chronological timeline of upcoming course events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  {ev.type === "QUIZ" ? <FileCheck className="h-5 w-5 text-amber-400" /> : <PenTool className="h-5 w-5 text-blue-400" />}
                </div>
                <div>
                  <Badge variant={ev.type === "QUIZ" ? "accent" : "default"} className="mb-1">{ev.course}</Badge>
                  <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 pt-0.5">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {ev.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ev.time}</span>
                  </p>
                </div>
              </div>

              <Badge variant="outline" className="shrink-0">{ev.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
