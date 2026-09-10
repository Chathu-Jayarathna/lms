"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "cat-1", name: "Soft Skills & Leadership", slug: "soft-skills", description: "Executive communication, team leadership, active listening.", count: 3 },
    { id: "cat-2", name: "Software Engineering", slug: "software-engineering", description: "Full-stack development, system design, Git workflows.", count: 4 },
    { id: "cat-3", name: "Data & Artificial Intelligence", slug: "data-ai", description: "SQL mastery, machine learning, data engineering pipelines.", count: 2 },
  ]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const handleAddCategory = () => {
    if (!newCatName) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCategories([
      ...categories,
      { id: `cat-${Date.now()}`, name: newCatName, slug, description: newCatDesc, count: 0 },
    ]);
    setNewCatName("");
    setNewCatDesc("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Category Manager"
        description="Organize courses into structured skill taxonomy categories for improved candidate discovery."
        badgeText="Taxonomy Management"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-600" /> Create New Category
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category Name *</label>
              <Input
                placeholder="e.g. Cloud & DevOps"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief category scope..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
            </div>

            <Button onClick={handleAddCategory} variant="accent" className="w-full text-xs font-semibold gap-1.5">
              <Plus className="h-4 w-4" /> Save Category
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="default">{cat.slug}</Badge>
                  <span className="text-xs font-semibold text-slate-500">{cat.count} Courses Assigned</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}
                  className="h-8 text-xs text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
