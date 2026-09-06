import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                THAKRAL<span className="text-amber-400">GLOBAL</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering final-year graduates and workforce candidates with AI-guided employability skills, interview mastery, and industry certifications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  Employability Courses
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-amber-400 transition-colors">
                  AI Interview Simulator
                </Link>
              </li>
              <li>
                <Link href="/progress" className="hover:text-amber-400 transition-colors">
                  Skill Assessment Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Training Programs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Skills Focus</h3>
            <ul className="space-y-2.5 text-xs">
              <li className="text-slate-400">Software Engineering & Agile</li>
              <li className="text-slate-400">Data Analytics & Business Intelligence</li>
              <li className="text-slate-400">Executive Communication & Leadership</li>
              <li className="text-slate-400">Technical Interview Prep</li>
            </ul>
          </div>

          {/* Institutional Note */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Thakral Global Learning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              BSc (Hons) Computer Science Final Year Capstone Project Architecture. Designed with Next.js, TypeScript, PostgreSQL & Prisma.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Thakral Global Learning (TGL). All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
