"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Calendar, Users } from "lucide-react";

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState([
    { id: "batch-1", name: "2026 Q3 Computer Science Cohort A", course: "Communication Skills for Employability", startDate: "2026-07-01", endDate: "2026-09-30", candidates: 45 },
    { id: "batch-2", name: "2026 Q3 Software Engineering Cohort B", course: "Full-Stack Software Engineering Prep", startDate: "2026-07-15", endDate: "2026-10-15", candidates: 60 },
  ]);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-12-31");

  const handleAddBatch = () => {
    if (!name) return;
    setBatches([
      ...batches,
      { id: `batch-${Date.now()}`, name, course: "Communication Skills for Employability", startDate, endDate, candidates: 0 },
    ]);
    setName("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Cohort & Batch Manager"
        description="Group students into structured time-bound learning cohorts for progress analytics and automated deadline tracking."
        badgeText="Cohort Governance"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-600" /> Create New Cohort
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Cohort Name *</label>
              <Input
                placeholder="e.g. 2026 Q4 AI Engineering Cohort"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <Button onClick={handleAddBatch} variant="accent" className="w-full text-xs font-semibold gap-1.5">
              <Plus className="h-4 w-4" /> Save Cohort Batch
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {batches.map((b) => (
            <Card key={b.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <Badge variant="accent">{b.course}</Badge>
                <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-3 pt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {b.startDate} to {b.endDate}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-blue-500" /> {b.candidates} Candidates</span>
                </p>
              </div>

              <Button variant="outline" size="sm" className="h-8 text-xs">
                Manage Cohort
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
