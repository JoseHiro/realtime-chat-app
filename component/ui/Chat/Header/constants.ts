import {
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  type LucideIcon,
} from "lucide-react";

export const LEVEL_MAP: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const THEME_MAP: Record<string, { label: string; icon: LucideIcon }> = {
  daily: { label: "Daily Life", icon: Coffee },
  business: { label: "Business", icon: Briefcase },
  travel: { label: "Travel", icon: Plane },
  culture: { label: "Culture", icon: BookOpen },
  social: { label: "Social", icon: Users },
};
