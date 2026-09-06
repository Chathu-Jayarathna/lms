export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
  external?: boolean;
}

export interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  enrolledStudentsCount: number;
  rating: number;
  imageUrl?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
}
