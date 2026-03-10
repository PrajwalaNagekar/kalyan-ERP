import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  Building2, Hammer, Smartphone,
  IndianRupee, BadgeCheck, BarChart3, Megaphone, Gauge, FileSearch,
  Shield, Ticket
} from "lucide-react";

export interface SubItem {
  label: string;
  url: string;
}

export interface NavItem {
  title: string;
  icon: any;
  url?: string;
  subItems?: SubItem[];
}

export const navigationItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  {
    title: "Gold Rate & Pricing", icon: Gauge, url: "/live-prices",
  },
  {
    title: "POS & Billing", icon: ShoppingCart,
    subItems: [
      { label: "Sales Billing", url: "/pos/sales-billing" },
      { label: "Product & Tag Selection", url: "/pos/product-tags" },
      { label: "Gold Rate Management", url: "/pos/gold-rates" },
      { label: "Exchange & Buyback", url: "/pos/exchange-buyback" },
      { label: "Payment Processing", url: "/pos/payments" },
      { label: "Customer Management", url: "/pos/customers" },
      { label: "Scheme & Offers", url: "/pos/schemes" },
      { label: "Order Billing", url: "/pos/orders" },
      { label: "Returns & Cancellations", url: "/pos/returns" },
      { label: "Approvals & Controls", url: "/pos/approvals" },
      { label: "POS Reports", url: "/pos/reports" },
      { label: "Integrations", url: "/pos/integrations" },
    ],
  },
  {
    title: "Central Inventory", icon: Package,
    subItems: [
      { label: "Stock List", url: "/inventory/stock-list" },
      { label: "Stock Transfers", url: "/inventory/transfers" },
    ],
  },
  {
    title: "Branch Management", icon: Building2,
    subItems: [
      { label: "Setup & Config", url: "/branches/setup" },
      { label: "Inventory", url: "/branches/inventory" },
      { label: "Sales & Billing", url: "/branches/sales" },
      { label: "Purchase & Procurement", url: "/branches/purchase" },
      { label: "Customers", url: "/branches/customers" },
      { label: "Financials", url: "/branches/finance" },
      { label: "Inter-Branch Ops", url: "/branches/inter-branch" },
      { label: "HR & Staff", url: "/branches/hr" },
      { label: "Security & Compliance", url: "/branches/security" },
      { label: "Reports", url: "/branches/reports" },
    ],
  },
  {
    title: "Karigar / Manufacturer", icon: Hammer,
    subItems: [
      { label: "Active Orders", url: "/goldsmith/orders" },
      { label: "Material Tracking", url: "/goldsmith/materials" },
    ],
  },
  {
    title: "App Customers", icon: Smartphone,
    subItems: [
      { label: "Gold Schemes", url: "/customers/schemes" },
      { label: "Customer Directory", url: "/customers/directory" },
    ],
  },
  {
    title: "Financial Overview", icon: IndianRupee,
    subItems: [
      { label: "Financial Audits", url: "/finance/audits" },
      { label: "GST & Taxes", url: "/finance/gst" },
    ],
  },
  {
    title: "Staff Management", icon: Users,
    subItems: [
      { label: "Performance Tracker", url: "/staff/performance" },
      { label: "Attendance", url: "/staff/attendance" },
    ],
  },
  { title: "Vendor & Procurement", icon: Package, url: "/vendors" },
  { title: "Quality & Hallmark", icon: BadgeCheck, url: "/quality" },
  { title: "Analytics & Reports", icon: BarChart3, url: "/analytics" },
  { title: "App Marketing", icon: Megaphone, url: "/marketing" },
  {
    title: "System Settings", icon: Settings,
    subItems: [
      { label: "General & Toggles", url: "/settings" },
      { label: "Role & Permissions", url: "/settings/rbac" },
    ],
  },
  { title: "Audit Logs", icon: FileSearch, url: "/audit" },
  { title: "Ticket Management", icon: Ticket, url: "/tickets" },
];
