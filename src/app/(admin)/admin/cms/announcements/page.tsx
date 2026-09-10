"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, CheckCircle2, Megaphone } from "lucide-react";

export default function AdminAnnouncementsCMSPage() {
  const [announcements, setAnnouncements] = useState([
    { id: "anc-1", title: "Q3 Executive Placement Interview Simulation Weekend", content: "All software engineering candidates are invited to participate in live mock interview simulation.", target: "STUDENT", date: "Sep 02, 2026" },
    { id: "anc-2", title: "Faculty Grade Submissions Due", content: "Instructors please submit all pending assignment reviews prior to Friday 5:00 PM.", target: "INSTRUCTOR", date: "Aug 29, 2026" },
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBroadcast = () => {
    if (!title || !content) return;
    setAnnouncements([
      { id: `anc-${Date.now()}`, title, content, target, date: "Today" },
      ...announcements,
    ]);
    setTitle("");
    setContent("");
    setFeedback("Announcement broadcasted successfully to all platform users!");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Institutional Announcement Broadcast CMS"
        description="Publish system-wide notifications and target specific candidate or instructor groups."
        badgeText="Broadcast Management"
      />

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-amber-500" /> New Broadcast
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Announcement Title *</label>
              <Input
                placeholder="e.g. Campus Recruitment Fair Registration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target Audience</label>
              <select
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="ALL">All Users (Students & Instructors)</option>
                <option value="STUDENT">Students Candidates Only</option>
                <option value="INSTRUCTOR">Instructors Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Content Body *</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announcement message body..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <Button onClick={handleBroadcast} variant="accent" className="w-full text-xs font-semibold gap-1.5">
              <Send className="h-4 w-4" /> Publish Announcement
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {announcements.map((anc) => (
            <Card key={anc.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={anc.target === "ALL" ? "default" : anc.target === "STUDENT" ? "accent" : "success"}>
                  Target: {anc.target}
                </Badge>
                <span className="text-[11px] text-slate-400 font-mono">{anc.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{anc.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
