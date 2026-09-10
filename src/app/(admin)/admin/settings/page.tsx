"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sliders, Save, CheckCircle2, Bot, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "Thakral Global Learning (TGL) LMS",
    supportEmail: "support@thakrallearning.edu",
    aiModel: "Google Gemini 2.5 Flash",
    ragThreshold: "0.75",
    maxQuizAttempts: "3",
    passingScorePercent: "70",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="System & AI Platform Configuration"
        description="Configure institutional branding, AI model providers, RAG thresholds, and quiz passing scores."
        badgeText="System Administration"
      />

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          Platform configuration updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Institutional Branding Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Platform Title</label>
              <Input
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Official Support Email</label>
              <Input
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-amber-500" /> AI Assistant RAG Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Active AI Model Provider</label>
              <Input value={settings.aiModel} disabled className="bg-slate-100 font-mono" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">RAG Similarity Matching Threshold</label>
              <Input
                value={settings.ragThreshold}
                onChange={(e) => setSettings({ ...settings, ragThreshold: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-600" /> Assessment & Quiz Governance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Default Passing Score (%)</label>
              <Input
                type="number"
                value={settings.passingScorePercent}
                onChange={(e) => setSettings({ ...settings, passingScorePercent: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Max Quiz Attempts Allowed</label>
              <Input
                type="number"
                value={settings.maxQuizAttempts}
                onChange={(e) => setSettings({ ...settings, maxQuizAttempts: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="accent" className="gap-2 font-semibold text-xs">
            <Save className="h-4 w-4" /> Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
