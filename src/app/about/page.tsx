import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { GraduationCap, Award, Target, Users, ArrowRight, ShieldCheck } from "lucide-react";

export default async function AboutPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <PageHeader
          title="About Thakral Global Learning (TGL)"
          description="Empowering computer science graduates and professionals with market-aligned employability skills, adaptive AI coaching, and verified placement pathways."
          badgeText="Institutional Profile"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bridge the critical skill gap between academic degrees and corporate global recruitment requirements through real-world software engineering, data analytics, and communication training.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Industry Endorsement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              TGL credentials and skill matrix scores are directly recognized by leading multinational technology partners and regional IT enterprises.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Expert Leadership</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curriculum modules authored and maintained by senior software architects, corporate trainers, and Computer Science academic leads.
            </p>
          </Card>
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-2xl space-y-6 flex flex-col md:flex-row items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <Badge variant="accent">Ready to Transform Your Career?</Badge>
            <h2 className="text-2xl font-bold">Explore Our Employability Skill Matrix</h2>
            <p className="text-xs text-slate-300">
              Join hundreds of graduate candidates accelerating their recruitment preparedness.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="accent" size="lg" className="gap-2 font-semibold">
              Browse Courses <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
