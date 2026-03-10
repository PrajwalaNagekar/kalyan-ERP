import { create } from "zustand";

export interface AuditEntry {
  id: string;
  user: string;
  role: string;
  branch: string;
  action: string;
  module: string;
  time: string;
  timestamp: Date;
  before: string;
  after: string;
  ip: string;
  device?: string;
}

export interface ToggleState {
  enableExchange: boolean;
  enableBuyback: boolean;
  enableCustomOrders: boolean;
  enableInvestmentScheme: boolean;
  enableInterBranchTransfer: boolean;
  enableDiscountOverride: boolean;
  enableRefundApprovalWorkflow: boolean;
  enableSMSNotifications: boolean;
  enableAutoGoldRateSync: boolean;
  enableAuditTracking: boolean;
  enableTicketManagement: boolean;
}

export interface PendingApproval {
  id: string;
  type: "refund" | "stock_adjustment" | "expense" | "cash_mismatch" | "rate_change" | "buyback" | "discount";
  requestedBy: string;
  requestedByRole: string;
  branch: string;
  value: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "info_requested";
  comment?: string;
  createdAt: string;
  approverRole: string;
}

interface AppStore {
  // Toggles
  toggles: ToggleState;
  setToggle: (key: keyof ToggleState, value: boolean) => void;

  // Audit logs
  auditLogs: AuditEntry[];
  addAuditLog: (entry: Omit<AuditEntry, "id" | "timestamp" | "ip">) => void;

  // Pending approvals
  pendingApprovals: PendingApproval[];
  addApproval: (approval: Omit<PendingApproval, "id" | "createdAt">) => void;
  updateApproval: (id: string, status: PendingApproval["status"], comment?: string) => void;
}

const INITIAL_AUDIT: AuditEntry[] = [
  { id: "AUD-001", user: "Rajesh Kumar", role: "Admin", branch: "Central", action: "Gold rate updated", module: "Pricing", time: "2 min ago", timestamp: new Date(Date.now() - 120000), before: "₹7,200/g", after: "₹7,250/g", ip: "192.168.1.45" },
  { id: "AUD-002", user: "Priya Sharma", role: "Operations", branch: "Jayanagar", action: "Invoice generated #INV-2847", module: "POS", time: "5 min ago", timestamp: new Date(Date.now() - 300000), before: "—", after: "₹3,30,375", ip: "192.168.1.101" },
  { id: "AUD-003", user: "Anand Reddy", role: "Finance", branch: "Jayanagar", action: "Cash closing submitted", module: "Finance", time: "1 hr ago", timestamp: new Date(Date.now() - 3600000), before: "—", after: "₹4,82,300", ip: "192.168.1.102" },
  { id: "AUD-004", user: "Ravi Shetty", role: "Karigar", branch: "Workshop", action: "Order ORD-904 marked Ready", module: "Production", time: "2 hr ago", timestamp: new Date(Date.now() - 7200000), before: "In Production", after: "Ready", ip: "192.168.1.150" },
  { id: "AUD-005", user: "Rajesh Kumar", role: "Admin", branch: "Central", action: "Toggle: Exchange enabled", module: "Settings", time: "3 hr ago", timestamp: new Date(Date.now() - 10800000), before: "OFF", after: "ON", ip: "192.168.1.45" },
  { id: "AUD-006", user: "Rajesh Kumar", role: "Admin", branch: "Central", action: "Login successful", module: "Auth", time: "3 hr ago", timestamp: new Date(Date.now() - 10900000), before: "—", after: "Session started", ip: "192.168.1.45", device: "Chrome / Windows" },
  { id: "AUD-007", user: "Priya Sharma", role: "Operations", branch: "Jayanagar", action: "Refund processed #RET-201", module: "POS", time: "4 hr ago", timestamp: new Date(Date.now() - 14400000), before: "₹1,08,900 pending", after: "Refunded", ip: "192.168.1.101" },
  { id: "AUD-008", user: "System", role: "System", branch: "All", action: "Auto gold rate sync", module: "Pricing", time: "5 hr ago", timestamp: new Date(Date.now() - 18000000), before: "₹7,180/g", after: "₹7,200/g", ip: "system" },
  { id: "AUD-009", user: "Deepa M", role: "Finance", branch: "Jayanagar", action: "Expense entry ₹45,000", module: "Finance", time: "6 hr ago", timestamp: new Date(Date.now() - 21600000), before: "—", after: "₹45,000 (Office supplies)", ip: "192.168.1.103" },
  { id: "AUD-010", user: "Rajesh Kumar", role: "Admin", branch: "Central", action: "RBAC updated: Finance role", module: "Settings", time: "1 day ago", timestamp: new Date(Date.now() - 86400000), before: "Export: OFF", after: "Export: ON", ip: "192.168.1.45" },
  { id: "AUD-011", user: "Anand Reddy", role: "Finance", branch: "Jayanagar", action: "Stock count reconciliation", module: "Inventory", time: "1 day ago", timestamp: new Date(Date.now() - 90000000), before: "12.3 kg", after: "12.1 kg (variance -200g)", ip: "192.168.1.102" },
  { id: "AUD-012", user: "Priya Sharma", role: "Operations", branch: "Jayanagar", action: "Product image uploaded GN-1892", module: "Inventory", time: "1 day ago", timestamp: new Date(Date.now() - 95000000), before: "No image", after: "Image uploaded", ip: "192.168.1.101" },
];

const INITIAL_APPROVALS: PendingApproval[] = [
  { id: "APR-001", type: "refund", requestedBy: "Deepa M", requestedByRole: "Finance", branch: "Jayanagar", value: "₹1,08,900", reason: "Size mismatch return — customer verified", status: "pending", createdAt: "2026-03-04 10:30", approverRole: "operations" },
  { id: "APR-002", type: "refund", requestedBy: "Priya Sharma", requestedByRole: "Operations", branch: "Jayanagar", value: "₹2,45,000", reason: "Defective necklace — customer complaint", status: "pending", createdAt: "2026-03-04 09:15", approverRole: "admin" },
  { id: "APR-003", type: "stock_adjustment", requestedBy: "Anand Reddy", requestedByRole: "Finance", branch: "Jayanagar", value: "200g gold variance", reason: "Monthly reconciliation difference", status: "pending", createdAt: "2026-03-03 17:00", approverRole: "admin" },
  { id: "APR-004", type: "expense", requestedBy: "Anand Reddy", requestedByRole: "Finance", branch: "Jayanagar", value: "₹1,20,000", reason: "Branch renovation — contractor payment", status: "pending", createdAt: "2026-03-03 14:30", approverRole: "admin" },
  { id: "APR-005", type: "cash_mismatch", requestedBy: "Deepa M", requestedByRole: "Finance", branch: "Jayanagar", value: "₹3,200 variance", reason: "EOD cash register mismatch", status: "pending", createdAt: "2026-03-03 18:00", approverRole: "operations" },
  { id: "APR-006", type: "discount", requestedBy: "Lakshmi V", requestedByRole: "Sales", branch: "Indiranagar", value: "12% on making charges", reason: "Repeat customer loyalty — 5th purchase", status: "approved", comment: "Approved — loyal customer", createdAt: "2026-03-02 11:00", approverRole: "operations" },
  { id: "APR-007", type: "buyback", requestedBy: "Priya Sharma", requestedByRole: "Operations", branch: "Jayanagar", value: "₹85,000 buyback", reason: "Customer selling 22K bangle — 15g", status: "pending", createdAt: "2026-03-04 11:00", approverRole: "admin" },
];

let auditCounter = 13;
let approvalCounter = 8;

export const useAppStore = create<AppStore>((set) => ({
  toggles: {
    enableExchange: true,
    enableBuyback: true,
    enableCustomOrders: true,
    enableInvestmentScheme: true,
    enableInterBranchTransfer: true,
    enableDiscountOverride: true,
    enableRefundApprovalWorkflow: true,
    enableSMSNotifications: false,
    enableAutoGoldRateSync: true,
    enableAuditTracking: true,
    enableTicketManagement: true,
  },
  setToggle: (key, value) =>
    set((state) => ({ toggles: { ...state.toggles, [key]: value } })),

  auditLogs: INITIAL_AUDIT,
  addAuditLog: (entry) =>
    set((state) => ({
      auditLogs: [
        {
          ...entry,
          id: `AUD-${String(auditCounter++).padStart(3, "0")}`,
          timestamp: new Date(),
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        },
        ...state.auditLogs,
      ],
    })),

  pendingApprovals: INITIAL_APPROVALS,
  addApproval: (approval) =>
    set((state) => ({
      pendingApprovals: [
        {
          ...approval,
          id: `APR-${String(approvalCounter++).padStart(3, "0")}`,
          createdAt: new Date().toLocaleString("en-IN"),
        },
        ...state.pendingApprovals,
      ],
    })),
  updateApproval: (id, status, comment) =>
    set((state) => ({
      pendingApprovals: state.pendingApprovals.map((a) =>
        a.id === id ? { ...a, status, comment } : a
      ),
    })),
}));
