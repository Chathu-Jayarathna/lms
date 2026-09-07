import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export default async function PrivacyPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Privacy Policy"
          description="Thakral Global Learning commitment to student data privacy, encryption, and candidate data protection."
          badgeText="Legal & Governance"
        />

        <Card className="p-8 space-y-4 text-xs text-slate-600 leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900">1. Data Collection</h3>
          <p>We collect essential account information (name, email, role, lesson progress) to deliver personalized learning experiences and AI tutor recommendations.</p>
          
          <h3 className="text-sm font-bold text-slate-900">2. Security & Session Storage</h3>
          <p>Passwords are hashed using industry-standard bcrypt. Session tokens are signed using HS256 JWT stored in HTTP-only, SameSite cookies.</p>

          <h3 className="text-sm font-bold text-slate-900">3. AI Data Processing</h3>
          <p>Conversations with the AI Learning Assistant are processed securely and never shared with third-party advertising networks.</p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
