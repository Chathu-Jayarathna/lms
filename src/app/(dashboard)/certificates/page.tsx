import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCourses } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, CheckCircle2, ShieldCheck } from "lucide-react";

export default async function StudentCertificatesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/certificates");
  }

  if (session.role === "ADMIN") redirect("/admin");
  if (session.role === "INSTRUCTOR") redirect("/instructor");

  const certificates = [
    {
      id: "cert-1",
      code: "TGL-CERT-2026-COMM-8921",
      courseTitle: "Communication Skills for Employability",
      issuedAt: "Sep 02, 2026",
      instructor: "Dr. Elena Rostova",
      skillsVerified: ["Executive Technical Speaking", "Active Listening Principles", "STAR Interview Framework"],
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Verified Skill Credentials - ${session.name}`}
        description="Earn cryptographically verified TGL certificates upon completing 100% of course lessons and passing all required assessments."
        badgeText="Verified Credentials"
      />

      <div className="space-y-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="p-6 space-y-4 border-2 border-amber-400/50 bg-gradient-to-br from-white to-amber-50/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="h-7 w-7" />
                </div>
                <div>
                  <Badge variant="accent" className="mb-1">Verified Certificate</Badge>
                  <h3 className="text-lg font-extrabold text-slate-900">{cert.courseTitle}</h3>
                  <p className="text-xs text-slate-500 font-mono">Certificate Code: {cert.code}</p>
                </div>
              </div>

              <a href={`/api/certificate/download?code=${cert.code}`} download className="shrink-0">
                <Button variant="accent" size="sm" className="gap-2 font-bold text-xs shadow-xs">
                  <Download className="h-4 w-4" /> Download PDF Certificate
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Issued Date & Instructor:</span>
                <p>{cert.issuedAt} • Authored by {cert.instructor}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Verified Skill Matrix Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skillsVerified.map((sk, idx) => (
                    <Badge key={idx} variant="success">{sk}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
