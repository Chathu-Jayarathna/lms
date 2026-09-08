import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  if (session?.role === "INSTRUCTOR") {
    redirect("/instructor");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar session={session} />
      <div className="flex flex-1">
        <Sidebar role="STUDENT" />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
}
