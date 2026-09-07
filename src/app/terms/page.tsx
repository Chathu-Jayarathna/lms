import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export default async function TermsPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Terms & Conditions"
          description="Platform terms of service, acceptable use guidelines, and intellectual property provisions."
          badgeText="Terms of Service"
        />

        <Card className="p-8 space-y-4 text-xs text-slate-600 leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900">1. Acceptable Use</h3>
          <p>Candidates agree to use the TGL LMS platform, video materials, and AI tools solely for personal employability skills development and academic training.</p>

          <h3 className="text-sm font-bold text-slate-900">2. Intellectual Property</h3>
          <p>All course materials, video lessons, quiz assessments, and branding belong to Thakral Global Learning.</p>

          <h3 className="text-sm font-bold text-slate-900">3. Credentials & Certification</h3>
          <p>Certificates are awarded based on honest completion of course modules and automated quiz validation.</p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
