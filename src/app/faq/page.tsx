import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { HelpCircle } from "lucide-react";

export default async function FAQPage() {
  const session = await getSession();

  const faqs = [
    {
      q: "What makes TGL LMS different from generic online learning platforms?",
      a: "TGL LMS is architected specifically around employability outcomes, pairing technical computer science modules with AI-powered mock interview practice, ATS resume keyword scoring, and real-time skill matrix analytics."
    },
    {
      q: "How does the AI Learning Assistant work?",
      a: "The AI Coach utilizes Retrieval-Augmented Generation (RAG) grounded directly in your enrolled course readings. It answers syllabus questions, provides practice technical interview prompts, and explains quiz mistakes."
    },
    {
      q: "Are the certificates verified?",
      a: "Yes. Upon completing 100% of course lessons and achieving passing quiz scores, a cryptographically signed TGL Employability Skill Certificate is generated for candidate placement."
    },
    {
      q: "How do instructors grade assignments?",
      a: "Instructors receive student PDF/DOC submissions in their dedicated Instructor Portal (/instructor/assignments/review), where they provide numerical scores and qualitative feedback."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="Frequently Asked Questions (FAQ)"
          description="Find answers to common questions about Thakral Global Learning platform access, AI features, quizzes, and skill credentials."
          badgeText="Help Knowledgebase"
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-6 space-y-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
