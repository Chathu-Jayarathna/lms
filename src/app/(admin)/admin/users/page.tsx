import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllStudentsAdmin } from "@/lib/admin-db";
import { PageHeader } from "@/components/ui/page-header";
import { StudentsClient } from "@/components/admin/students-client";

export default async function AdminUserManagementPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard?error=unauthorized");
  }

  const students = await getAllStudentsAdmin();

  return (
    <div className="space-y-8">
      <PageHeader
        title="User & Role Management Suite"
        description="Comprehensive user management console. Activate/deactivate accounts, assign instructor roles, and inspect progress logs."
        badgeText="User Governance"
      />

      <StudentsClient students={students} />
    </div>
  );
}
