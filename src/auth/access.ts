import type { UserRole } from "../types";

/** UI-only navigation policy. Server authorization remains authoritative. */
const roleViews: Record<UserRole, readonly string[]> = {
  farmer: ["landing", "dashboard", "home", "farms", "farmer", "farmers", "farm_twin", "farm-twin", "precision_ag", "precision", "crop_doctor", "climate", "marketplace", "consent"],
  buyer: ["landing", "dashboard", "home", "marketplace", "trade", "crop_doctor", "climate", "consent"],
  cooperative: ["landing", "dashboard", "home", "farms", "farm_twin", "precision", "crop_doctor", "climate", "marketplace", "cooperative", "consent"],
  agribusiness: ["landing", "dashboard", "home", "farms", "precision", "crop_doctor", "climate", "marketplace", "finance", "logistics", "trade", "agribusiness", "consent"],
  logistics: ["landing", "dashboard", "home", "logistics", "trade", "climate", "consent"],
  finance: ["landing", "dashboard", "home", "finance", "marketplace", "consent"],
  government: ["landing", "dashboard", "home", "government", "climate", "consent"],
  researcher: ["landing", "dashboard", "home", "climate", "consent"],
  input_supplier: ["landing", "dashboard", "home", "marketplace", "consent"],
  superadmin: ["landing", "dashboard", "home", "farms", "precision", "crop_doctor", "climate", "marketplace", "finance", "logistics", "trade", "government", "cooperative", "agribusiness", "consent", "admin"],
};

export const canAccessView = (role: UserRole, view: string) => roleViews[role].includes(view);
