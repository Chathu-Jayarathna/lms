import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/lib/auth";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor");
  }

  if (session.role !== "INSTRUCTOR" && session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar session={session} />
      <div className="flex flex-1">
        <Sidebar role="INSTRUCTOR" />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl bg-slate-50 text-slate-900 rounded-tl-2xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
