import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export type RoleGroup = "admin" | "operations" | "finance" | "goldsmith";

export function getRoleGroup(dbRole: AppRole): RoleGroup {
  switch (dbRole) {
    case "super_admin":
    case "central_admin":
      return "admin";
    case "branch_manager":
      return "operations";
    case "cashier":
    case "sales_executive":
    case "accountant":
    case "inventory_manager":
      return "finance";
    case "goldsmith":
      return "goldsmith";
    default:
      return "finance";
  }
}

export const ROLE_LABELS: Record<RoleGroup, string> = {
  admin: "ADMIN",
  operations: "OPERATIONS",
  finance: "FINANCE",
  goldsmith: "KARIGAR",
};

export const ROLE_BADGE_COLORS: Record<RoleGroup, string> = {
  admin: "bg-primary/20 text-primary border-primary/30",
  operations: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  finance: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  goldsmith: "bg-orange-500/20 text-orange-600 border-orange-500/30",
};

export const ROLE_SCOPE_LABEL: Record<RoleGroup, string> = {
  admin: "GLOBAL",
  operations: "BRANCH",
  finance: "EXECUTION",
  goldsmith: "MANUFACTURING",
};

export const ROLE_SCOPE_COLORS: Record<RoleGroup, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  operations: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  finance: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  goldsmith: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

// Route prefixes each role group can access — strict per spec
export const ROLE_PERMISSIONS: Record<RoleGroup, string[]> = {
  admin: [
    "/", "/live-prices", "/inventory", "/branches", "/customers",
    "/finance", "/staff", "/vendors", "/quality", "/analytics",
    "/marketing", "/settings", "/goldsmith", "/audit", "/tickets",
  ],
  operations: [
    "/", "/pos", "/live-prices",
    "/branches/inventory", "/branches/sales", "/branches/purchase",
    "/branches/customers", "/branches/finance", "/branches/hr",
    "/branches/reports",
    "/customers", "/marketing", "/staff", "/tickets",
  ],
  finance: [
    "/", "/pos", "/live-prices",
    "/inventory/stock-list", "/inventory/transfers",
    "/branches/inventory", "/branches/sales", "/branches/finance",
    "/branches/reports",
    "/finance", "/audit", "/tickets",
  ],
  goldsmith: [
    "/", "/goldsmith",
  ],
};

export const DEFAULT_LANDING: Record<RoleGroup, string> = {
  admin: "/",
  operations: "/",
  finance: "/pos/sales-billing",
  goldsmith: "/goldsmith/orders",
};

export function canAccess(roleGroup: RoleGroup, path: string): boolean {
  if (path === "/") return true;
  if (path === "/access-denied") return true;
  const allowed = ROLE_PERMISSIONS[roleGroup];
  return allowed.some(prefix => {
    if (prefix === "/") return false;
    return path === prefix || path.startsWith(prefix + "/");
  });
}

// Navigation items visibility per role group — strict per spec
export const NAV_VISIBILITY: Record<string, RoleGroup[]> = {
  "Dashboard": ["admin", "operations", "finance", "goldsmith"],
  "Gold Rate & Pricing": ["admin"],
  "Central Inventory": ["admin"],
  "Branch Management": ["admin", "operations"],
  "Analytics & Reports": ["admin"],
  "Financial Overview": ["admin", "finance"],
  "System Settings": ["admin"],
  "Audit Logs": ["admin", "finance"],
  "POS & Billing": ["operations", "finance"],
  "App Customers": ["admin", "operations"],
  "App Marketing": ["admin", "operations"],
  "Staff Management": ["admin", "operations"],
  "Karigar / Manufacturer": ["admin", "goldsmith"],
  "Vendor & Procurement": ["admin"],
  "Quality & Hallmark": ["admin"],
  "Ticket Management": ["admin", "operations", "finance"],
  "Live Price Manager": [],
};

export function canSeeNavItem(title: string, roleGroup: RoleGroup): boolean {
  const allowed = NAV_VISIBILITY[title];
  if (!allowed) return roleGroup === "admin";
  return allowed.includes(roleGroup);
}
