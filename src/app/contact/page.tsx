"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <PageHeader
          title="Contact Thakral Global Learning"
          description="Have questions about our employability curriculum, corporate partnerships, or student enrollment? We're here to assist."
          badgeText="Support & Inquiries"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Inquiries</h4>
                  <p className="text-xs text-slate-500">support@thakrallearning.edu</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Telephone</h4>
                  <p className="text-xs text-slate-500">+65 6838 2000</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Headquarters</h4>
                  <p className="text-xs text-slate-500">Thakral House, Singapore / Regional Hubs</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and an admissions officer will respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-emerald-900">Inquiry Received Successfully</h3>
                    <p className="text-xs text-emerald-700">Thank you for reaching out to Thakral Global Learning. We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Your Full Name *</label>
                        <Input
                          required
                          placeholder="Alex Morgan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                        <Input
                          required
                          type="email"
                          placeholder="alex@tgl.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Subject</label>
                      <Input
                        placeholder="Course Enrollment Inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Message *</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Detail your question or inquiry here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    <Button type="submit" variant="accent" className="gap-2 text-xs font-semibold">
                      <Send className="h-4 w-4" /> Send Inquiry
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
