"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Bot,
  User,
  Shield,
  FileText,
  Users,
  Award,
  FileCheck,
  Sparkles,
  MessageSquare,
  CheckSquare,
  PenTool,
  Calendar as CalendarIcon,
  Bell,
  Sliders,
  FolderPlus,
  Layers,
  LucideIcon,
} from "lucide-react";

interface SidebarProps {
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

interface NavItemDef {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export function Sidebar({ role = "STUDENT" }: SidebarProps) {
  const pathname = usePathname();

  const studentNavItems: NavItemDef[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Explore Courses", href: "/courses", icon: BookOpen },
    { title: "My Enrolled Courses", href: "/my-courses", icon: GraduationCap },
    { title: "Assignments", href: "/assignments", icon: PenTool },
    { title: "Attendance History", href: "/attendance", icon: CheckSquare },
    { title: "Employability Progress", href: "/progress", icon: TrendingUp },
    { title: "Certificates", href: "/certificates", icon: Award },
    { title: "AI Skill Assistant", href: "/ai-assistant", icon: Bot, badge: "AI" },
    { title: "Schedule & Calendar", href: "/calendar", icon: CalendarIcon },
    { title: "Usability Survey", href: "/feedback", icon: MessageSquare },
    { title: "My Profile & CV", href: "/profile", icon: User },
  ];

  const instructorNavItems: NavItemDef[] = [
    { title: "Dashboard", href: "/instructor", icon: LayoutDashboard },
    { title: "Manage My Courses", href: "/instructor/courses", icon: BookOpen },
    { title: "Create New Course", href: "/instructor/courses/create", icon: FolderPlus },
    { title: "Quiz & Questions", href: "/instructor/quizzes/builder", icon: FileCheck },
    { title: "Student Roster", href: "/instructor/students", icon: Users },
    { title: "Attendance Manager", href: "/instructor/attendance", icon: CheckSquare },
    { title: "Assignment Review", href: "/instructor/assignments/review", icon: PenTool },
    { title: "My Profile", href: "/profile", icon: User },
  ];

  const adminNavItems: NavItemDef[] = [
    { title: "Dashboard", href: "/admin", icon: Shield },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Course CMS", href: "/admin/courses", icon: BookOpen },
    { title: "Categories Manager", href: "/admin/categories", icon: Layers },
    { title: "Batch & Cohorts", href: "/admin/batches", icon: Award },
    { title: "Assessments Builder", href: "/admin/quizzes", icon: FileCheck },
    { title: "Reports & Analytics", href: "/admin/reports", icon: FileText },
    { title: "Announcements CMS", href: "/admin/cms/announcements", icon: Bell },
    { title: "Research Evaluation", href: "/admin/research", icon: Sparkles },
    { title: "System Settings", href: "/admin/settings", icon: Sliders },
    { title: "Admin Profile", href: "/profile", icon: User },
  ];

  const navItems =
    role === "ADMIN"
      ? adminNavItems
      : role === "INSTRUCTOR"
      ? instructorNavItems
      : studentNavItems;

  const titleText =
    role === "ADMIN"
      ? "Admin Executive Console"
      : role === "INSTRUCTOR"
      ? "Instructor Workspace"
      : "Learner Workspace";

  return (
    <aside
      className={`w-64 border-r min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 transition-colors ${
        role === "ADMIN" || role === "INSTRUCTOR"
          ? "border-slate-800 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2
            className={`text-xs font-bold uppercase tracking-wider ${
              role === "ADMIN"
                ? "text-amber-400"
                : role === "INSTRUCTOR"
                ? "text-blue-400"
                : "text-slate-400"
            }`}
          >
            {titleText}
          </h2>
          <div className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  item.href !== "/instructor" &&
                  item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    role === "ADMIN" || role === "INSTRUCTOR"
                      ? isActive
                        ? "bg-slate-800 text-amber-400 font-bold border border-slate-700"
                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        role === "ADMIN" || role === "INSTRUCTOR"
                          ? isActive
                            ? "text-amber-400"
                            : "text-slate-400"
                          : isActive
                          ? "text-amber-400"
                          : "text-slate-500"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {role === "STUDENT" && (
          <div className="mx-2 p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Award className="h-4 w-4" />
              <span>TGL Career Ready</span>
            </div>
            <p className="text-xs text-slate-300">
              Complete your employability skill assessment to unlock direct interview matches.
            </p>
          </div>
        )}
      </div>

      <div
        className={`border-t pt-4 px-3 text-xs font-medium ${
          role === "ADMIN" || role === "INSTRUCTOR"
            ? "border-slate-800 text-slate-400"
            : "border-slate-100 text-slate-500"
        }`}
      >
        <span>{role === "ADMIN" ? "Institutional Governance" : "Thakral Global Learning"}</span>
      </div>
    </aside>
  );
}
