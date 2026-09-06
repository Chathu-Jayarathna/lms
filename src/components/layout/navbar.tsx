"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Menu,
  X,
  BookOpen,
  Bot,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Award,
  TrendingUp,
  MessageSquare,
  Users,
  FileCheck,
  BarChart2,
  Sparkles,
  CheckSquare,
  PenTool,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { SessionUser } from "@/lib/auth";

interface NavbarProps {
  session?: SessionUser | null;
}

export function Navbar({ session }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAdmin = session?.role === "ADMIN";
  const isInstructor = session?.role === "INSTRUCTOR";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAction();
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const logoHref = session
    ? isAdmin
      ? "/admin"
      : isInstructor
      ? "/instructor"
      : "/dashboard"
    : "/";

  // Admin Navigation Items
  const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Course CMS", href: "/admin/courses", icon: BookOpen },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Batches", href: "/admin/batches", icon: Award },
    { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart2 },
    { label: "Research", href: "/admin/research", icon: Sparkles },
  ];

  // Instructor Navigation Items
  const instructorNavItems = [
    { label: "Dashboard", href: "/instructor", icon: LayoutDashboard },
    { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
    { label: "Quiz Builder", href: "/instructor/quizzes/builder", icon: FileCheck },
    { label: "Student Roster", href: "/instructor/students", icon: Users },
    { label: "Attendance", href: "/instructor/attendance", icon: CheckSquare },
    { label: "Grading", href: "/instructor/assignments/review", icon: PenTool },
  ];

  // Student Navigation Items
  const studentNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "My Courses", href: "/my-courses", icon: Award },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "AI Coach", href: "/ai-assistant", icon: Bot },
    { label: "Survey", href: "/feedback", icon: MessageSquare },
  ];

  const currentNavItems = session
    ? isAdmin
      ? adminNavItems
      : isInstructor
      ? instructorNavItems
      : studentNavItems
    : [];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xs transition-colors ${
        isAdmin
          ? "border-slate-800 bg-slate-900 text-white"
          : isInstructor
          ? "border-blue-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white/95 text-slate-900"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* TGL Brand Logo */}
        <Link href={logoHref} className="flex items-center gap-2.5 group">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-xs transition-colors ${
              isAdmin
                ? "bg-amber-500 text-slate-950 font-bold"
                : isInstructor
                ? "bg-blue-600 text-white font-bold"
                : "bg-slate-900 text-amber-400 group-hover:bg-blue-900"
            }`}
          >
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-lg font-bold tracking-tight leading-tight ${
                isAdmin || isInstructor ? "text-white" : "text-slate-900"
              }`}
            >
              THAKRAL<span className="text-blue-500 font-extrabold ml-1">GLOBAL</span>
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest leading-none ${
                isAdmin
                  ? "text-amber-400"
                  : isInstructor
                  ? "text-blue-400"
                  : "text-slate-500"
              }`}
            >
              {isAdmin
                ? "Admin Executive Portal"
                : isInstructor
                ? "Instructor Management Portal"
                : "Employability LMS"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {session ? (
          <nav className="hidden md:flex items-center gap-4 text-xs font-semibold">
            {currentNavItems.map((item) => {
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
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
                    isAdmin || isInstructor
                      ? isActive
                        ? "bg-slate-800 text-amber-400 font-bold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      : isActive
                      ? "bg-slate-100 text-blue-600 font-bold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/courses" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <BookOpen className="h-4 w-4 text-slate-400" />
              Courses
            </Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About TGL</Link>
            <Link href="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
        )}

        {/* Action Buttons & Session User Pill */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isAdmin || isInstructor
                      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{session.name}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] uppercase font-black rounded ${
                      isAdmin
                        ? "bg-amber-400 text-slate-950"
                        : isInstructor
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {session.role}
                  </span>
                </div>
              </Link>
              <Button
                variant={isAdmin ? "danger" : "outline"}
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                className={`gap-1.5 text-xs ${
                  isAdmin || isInstructor
                    ? "bg-red-950/80 text-red-300 border-red-900 hover:bg-red-900 hover:text-white"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <LogOut className="h-3.5 w-3.5" />
                {loggingOut ? "Signing out..." : "Logout"}
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-label="Toggle Navigation Menu"
          className={`inline-flex md:hidden items-center justify-center p-2 rounded-md ${
            isAdmin || isInstructor
              ? "text-slate-200 hover:bg-slate-800"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 pt-2 pb-6 space-y-3 ${
            isAdmin || isInstructor
              ? "border-slate-800 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          {session ? (
            currentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-sm font-semibold flex items-center gap-2 ${
                    isAdmin || isInstructor
                      ? "text-slate-200 hover:text-amber-400"
                      : "text-slate-700 hover:text-blue-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })
          ) : (
            <>
              <Link
                href="/courses"
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses Catalog
              </Link>
              <Link
                href="/about"
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About TGL
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </>
          )}

          <div className="pt-4 flex flex-col gap-2 border-t border-slate-100/20">
            {session ? (
              <Button
                variant="outline"
                className="w-full text-red-500 border-red-900/50 hover:bg-red-900/40"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Sign Out ({session.name})
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="accent" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
