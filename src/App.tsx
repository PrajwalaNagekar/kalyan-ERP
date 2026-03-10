import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { RoleGuard } from "@/components/RoleGuard";
import { lazy, Suspense } from "react";

import Login from "./pages/Login";

// Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));

// POS
const SalesBilling = lazy(() => import("./pages/pos/SalesBilling"));
const ProductTagSelection = lazy(() => import("./pages/pos/ProductTagSelection"));
const GoldRateManagement = lazy(() => import("./pages/pos/GoldRateManagement"));
const ExchangeBuyback = lazy(() => import("./pages/pos/ExchangeBuyback"));
const PaymentProcessing = lazy(() => import("./pages/pos/PaymentProcessing"));
const CustomerManagement = lazy(() => import("./pages/pos/CustomerManagement"));
const SchemeOfferHandling = lazy(() => import("./pages/pos/SchemeOfferHandling"));
const OrderBilling = lazy(() => import("./pages/pos/OrderBilling"));
const ReturnsCancellations = lazy(() => import("./pages/pos/ReturnsCancellations"));
const ApprovalsControls = lazy(() => import("./pages/pos/ApprovalsControls"));
const POSReports = lazy(() => import("./pages/pos/POSReports"));
const IntegrationModules = lazy(() => import("./pages/pos/IntegrationModules"));

// Inventory
const StockList = lazy(() => import("./pages/inventory/StockList"));
const StockTransfers = lazy(() => import("./pages/inventory/StockTransfers"));

// Branches
const BranchSetup = lazy(() => import("./pages/branches/BranchSetup"));
const BranchInventory = lazy(() => import("./pages/branches/BranchInventory"));
const BranchSales = lazy(() => import("./pages/branches/BranchSales"));
const BranchPurchase = lazy(() => import("./pages/branches/BranchPurchase"));
const BranchCustomers = lazy(() => import("./pages/branches/BranchCustomers"));
const BranchFinance = lazy(() => import("./pages/branches/BranchFinance"));
const InterBranchOps = lazy(() => import("./pages/branches/InterBranchOps"));
const BranchHR = lazy(() => import("./pages/branches/BranchHR"));
const BranchSecurity = lazy(() => import("./pages/branches/BranchSecurity"));
const BranchReports = lazy(() => import("./pages/branches/BranchReports"));

// Goldsmith
const ActiveOrders = lazy(() => import("./pages/goldsmith/ActiveOrders"));
const MaterialTracking = lazy(() => import("./pages/goldsmith/MaterialTracking"));

// Customers
const GoldSchemes = lazy(() => import("./pages/customers/GoldSchemes"));
const CustomerDirectory = lazy(() => import("./pages/customers/CustomerDirectory"));

// Finance
const FinancialAudits = lazy(() => import("./pages/finance/FinancialAudits"));
const GSTTaxes = lazy(() => import("./pages/finance/GSTTaxes"));

// Staff
const PerformanceTracker = lazy(() => import("./pages/staff/PerformanceTracker"));
const Attendance = lazy(() => import("./pages/staff/Attendance"));

// Standalone
const LivePriceManager = lazy(() => import("./pages/LivePriceManager"));
const VendorProcurement = lazy(() => import("./pages/VendorProcurement"));
const QualityHallmark = lazy(() => import("./pages/QualityHallmark"));
const AnalyticsReports = lazy(() => import("./pages/AnalyticsReports"));
const AppMarketing = lazy(() => import("./pages/AppMarketing"));
const SystemSettings = lazy(() => import("./pages/SystemSettings"));

// New pages
import NotFound from "./pages/NotFound";
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const TicketManagement = lazy(() => import("./pages/TicketManagement"));
const RBACEditor = lazy(() => import("./pages/RBACEditor"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, demoMode } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  if (!session && !demoMode) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<RoleGuard><Dashboard /></RoleGuard>} />
                <Route path="pos/sales-billing" element={<RoleGuard><SalesBilling /></RoleGuard>} />
                <Route path="pos/product-tags" element={<RoleGuard><ProductTagSelection /></RoleGuard>} />
                <Route path="pos/gold-rates" element={<RoleGuard><GoldRateManagement /></RoleGuard>} />
                <Route path="pos/exchange-buyback" element={<RoleGuard><ExchangeBuyback /></RoleGuard>} />
                <Route path="pos/payments" element={<RoleGuard><PaymentProcessing /></RoleGuard>} />
                <Route path="pos/customers" element={<RoleGuard><CustomerManagement /></RoleGuard>} />
                <Route path="pos/schemes" element={<RoleGuard><SchemeOfferHandling /></RoleGuard>} />
                <Route path="pos/orders" element={<RoleGuard><OrderBilling /></RoleGuard>} />
                <Route path="pos/returns" element={<RoleGuard><ReturnsCancellations /></RoleGuard>} />
                <Route path="pos/approvals" element={<RoleGuard><ApprovalsControls /></RoleGuard>} />
                <Route path="pos/reports" element={<RoleGuard><POSReports /></RoleGuard>} />
                <Route path="pos/integrations" element={<RoleGuard><IntegrationModules /></RoleGuard>} />
                <Route path="inventory/stock-list" element={<RoleGuard><StockList /></RoleGuard>} />
                <Route path="inventory/transfers" element={<RoleGuard><StockTransfers /></RoleGuard>} />
                <Route path="branches/setup" element={<RoleGuard><BranchSetup /></RoleGuard>} />
                <Route path="branches/inventory" element={<RoleGuard><BranchInventory /></RoleGuard>} />
                <Route path="branches/sales" element={<RoleGuard><BranchSales /></RoleGuard>} />
                <Route path="branches/purchase" element={<RoleGuard><BranchPurchase /></RoleGuard>} />
                <Route path="branches/customers" element={<RoleGuard><BranchCustomers /></RoleGuard>} />
                <Route path="branches/finance" element={<RoleGuard><BranchFinance /></RoleGuard>} />
                <Route path="branches/inter-branch" element={<RoleGuard><InterBranchOps /></RoleGuard>} />
                <Route path="branches/hr" element={<RoleGuard><BranchHR /></RoleGuard>} />
                <Route path="branches/security" element={<RoleGuard><BranchSecurity /></RoleGuard>} />
                <Route path="branches/reports" element={<RoleGuard><BranchReports /></RoleGuard>} />
                <Route path="goldsmith/orders" element={<RoleGuard><ActiveOrders /></RoleGuard>} />
                <Route path="goldsmith/materials" element={<RoleGuard><MaterialTracking /></RoleGuard>} />
                <Route path="customers/schemes" element={<RoleGuard><GoldSchemes /></RoleGuard>} />
                <Route path="customers/directory" element={<RoleGuard><CustomerDirectory /></RoleGuard>} />
                <Route path="finance/audits" element={<RoleGuard><FinancialAudits /></RoleGuard>} />
                <Route path="finance/gst" element={<RoleGuard><GSTTaxes /></RoleGuard>} />
                <Route path="staff/performance" element={<RoleGuard><PerformanceTracker /></RoleGuard>} />
                <Route path="staff/attendance" element={<RoleGuard><Attendance /></RoleGuard>} />
                <Route path="live-prices" element={<RoleGuard><LivePriceManager /></RoleGuard>} />
                <Route path="vendors" element={<RoleGuard><VendorProcurement /></RoleGuard>} />
                <Route path="quality" element={<RoleGuard><QualityHallmark /></RoleGuard>} />
                <Route path="analytics" element={<RoleGuard><AnalyticsReports /></RoleGuard>} />
                <Route path="marketing" element={<RoleGuard><AppMarketing /></RoleGuard>} />
                <Route path="settings" element={<RoleGuard><SystemSettings /></RoleGuard>} />
                <Route path="settings/rbac" element={<RoleGuard><RBACEditor /></RoleGuard>} />
                <Route path="audit" element={<RoleGuard><AuditLogs /></RoleGuard>} />
                <Route path="tickets" element={<RoleGuard><TicketManagement /></RoleGuard>} />
                <Route path="access-denied" element={<AccessDenied />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
