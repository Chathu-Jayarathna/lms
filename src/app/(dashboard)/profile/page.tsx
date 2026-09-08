import { getSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Save } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  const name = session?.name || "Alex Morgan";
  const email = session?.email || "student@tgl.edu";
  const role = session?.role || "STUDENT";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`User Profile & Account - ${name}`}
        description="Manage your personal information, target job role, security credentials, and preferences."
        badgeText="Account Console"
        action={
          <Button variant="accent" size="sm" className="gap-1.5 font-semibold text-xs">
            <Save className="h-4 w-4" /> Save Profile Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <Card className="text-center p-6 space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-3xl font-extrabold shadow-sm">
            {name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500 font-medium">{email}</p>
            <Badge variant={role === "ADMIN" ? "accent" : role === "INSTRUCTOR" ? "success" : "default"} className="mt-2">
              Role: {role}
            </Badge>
          </div>
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Account Type:</span>
              <span className="font-semibold text-slate-800">{role} Account</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User ID:</span>
              <span className="font-mono text-slate-800">{session?.userId || "candidate-alex-123"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TGL Status:</span>
              <span className="font-semibold text-emerald-600">Active Verified</span>
            </div>
          </div>
        </Card>

        {/* Right 2 Columns: Profile Form Shell */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Professional Information</CardTitle>
              <CardDescription>Update your contact info and career objective</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={name} />
                <Input label="Email Address" defaultValue={email} disabled />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Target Job Role" defaultValue="Full-Stack Software Engineer" />
                <Input label="Degree Program" defaultValue="BSc (Hons) Computer Science" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Professional Bio</label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="Final year Computer Science student specializing in scalable Next.js web applications, PostgreSQL relational databases, and microservices architecture."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio & Social Integrations</CardTitle>
              <CardDescription>Links used for automated TGL skill verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="GitHub Profile URL" defaultValue="https://github.com/tgl-candidate" />
              <Input label="LinkedIn Profile URL" defaultValue="https://linkedin.com/in/tgl-candidate" />
              <Input label="CV / Resume Link" defaultValue="https://tgl-lms.edu/cv/candidate.pdf" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
