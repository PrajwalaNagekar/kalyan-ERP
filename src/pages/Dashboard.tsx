import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, Package, Users, ShoppingCart, IndianRupee,
  ArrowUpRight, ArrowDownRight, RefreshCw, Hammer, Clock, FileText, CreditCard
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

// ── Admin Dashboard Data ──
const branchPerformance = [
  { name: "Jayanagar", revenue: 4500000, target: 5000000 },
  { name: "Rajajinagar", revenue: 3800000, target: 4000000 },
  { name: "Marathahalli", revenue: 5200000, target: 5000000 },
  { name: "Whitefield", revenue: 4100000, target: 4500000 },
  { name: "Koramangala", revenue: 3600000, target: 4000000 },
];
const salesTrend = [
  { month: "Sep", sales: 18500000 }, { month: "Oct", sales: 21200000 },
  { month: "Nov", sales: 24800000 }, { month: "Dec", sales: 28500000 },
  { month: "Jan", sales: 22100000 }, { month: "Feb", sales: 25600000 },
  { month: "Mar", sales: 21200000 },
];
const categoryBreakdown = [
  { name: "Necklaces", value: 35 }, { name: "Bangles", value: 25 },
  { name: "Rings", value: 20 }, { name: "Earrings", value: 15 }, { name: "Others", value: 5 },
];
const PIE_COLORS = ["#D4AF37", "#2ECC71", "#3498DB", "#E74C8C", "#9B59B6"];
const recentActivity = [
  { action: "Invoice #INV-2847 generated", branch: "Marathahalli", time: "2 min ago", type: "sale" },
  { action: "Gold rate updated to ₹7,250/g", branch: "Central", time: "15 min ago", type: "update" },
  { action: "Stock transfer to Whitefield", branch: "Jayanagar", time: "1 hr ago", type: "transfer" },
  { action: "New product added: GN-1892", branch: "Rajajinagar", time: "2 hr ago", type: "inventory" },
  { action: "Refund processed #REF-0412", branch: "Koramangala", time: "3 hr ago", type: "refund" },
];

// ── Operations Dashboard ──
function OperationsDashboard() {
  const kpis = [
    { title: "Today's Sales", value: "₹8.4L", icon: ShoppingCart, change: "+5.2%", up: true },
    { title: "Gold Stock", value: "12.3 kg", icon: Package, change: "-0.8 kg", up: false },
    { title: "Customer Visits", value: "47", icon: Users, change: "+12", up: true },
    { title: "Pending Orders", value: "6", icon: Clock, change: "-2", up: true },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Branch Dashboard</h1>
        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Jayanagar Branch</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.title} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{k.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {k.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                    <span className={`text-xs font-medium ${k.up ? "text-emerald-500" : "text-red-500"}`}>{k.change}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-gray-100"><k.icon className="w-5 h-5 text-blue-500" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader><CardTitle className="text-base font-serif">Staff Attendance Today</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {["Ravi K. — Present", "Meena S. — Present", "Arjun P. — Late (9:22 AM)", "Deepa R. — Absent"].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${s.includes("Absent") ? "bg-red-500" : s.includes("Late") ? "bg-amber-500" : "bg-emerald-500"}`} />
              <span className="text-gray-700">{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Finance Dashboard ──
function FinanceDashboard() {
  const kpis = [
    { title: "Today's Cash Closing", value: "₹4,82,300", icon: IndianRupee },
    { title: "Pending Invoices", value: "12", icon: FileText },
    { title: "Stock Count Due", value: "3 items", icon: Package },
    { title: "Payments Processed", value: "28", icon: CreditCard },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Finance Dashboard</h1>
        <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Execution Mode</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.title} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{k.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
              <div className="p-2 rounded-lg bg-gray-100 w-fit mt-2"><k.icon className="w-4 h-4 text-emerald-500" /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Karigar Dashboard ──
function KarigarDashboard() {
  const stages = [
    { name: "Received", count: 3, pct: 100 },
    { name: "Designing", count: 2, pct: 80 },
    { name: "Casting", count: 4, pct: 60 },
    { name: "Polishing", count: 1, pct: 40 },
    { name: "QC", count: 2, pct: 20 },
    { name: "Ready", count: 5, pct: 100 },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Production Dashboard</h1>
        <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Karigar Panel</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stages.map(s => (
          <Card key={s.name} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase">{s.name}</span>
                <Hammer className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.count}</p>
              <Progress value={s.pct} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Admin Dashboard (main) ──
const Dashboard = () => {
  const { toast } = useToast();
  const { user, roleGroup } = useAuth();
  const [goldRate, setGoldRate] = useState<number | null>(null);
  const [newGoldRate, setNewGoldRate] = useState("");
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingRate, setUpdatingRate] = useState(false);

  useEffect(() => {
    supabase.from("gold_rates").select("rate_per_gram").eq("karat", 24)
      .order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => { setGoldRate(data?.[0] ? Number(data[0].rate_per_gram) : 7250); });
  }, []);

  // Role-specific dashboards
  if (roleGroup === "operations") return <OperationsDashboard />;
  if (roleGroup === "finance") return <FinanceDashboard />;
  if (roleGroup === "goldsmith") return <KarigarDashboard />;

  const handleUpdateGoldRate = async () => {
    const rate = parseFloat(newGoldRate);
    if (isNaN(rate) || rate <= 0) {
      toast({ title: "Invalid rate", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }
    setShowConfirm(true);
  };

  const confirmGoldRateUpdate = async () => {
    setUpdatingRate(true);
    const rate = parseFloat(newGoldRate);
    try {
      await supabase.from("gold_rates").insert({ rate_per_gram: rate, karat: 24, updated_by: user?.id });
      await supabase.from("audit_logs").insert({ user_id: user?.id, action: "Gold rate updated", module: "Dashboard", details: { old_rate: goldRate, new_rate: rate } });
      setGoldRate(rate);
      setShowGoldModal(false);
      setShowConfirm(false);
      setNewGoldRate("");
      toast({ title: "Gold rate updated", description: `New rate: ₹${rate.toLocaleString("en-IN")}/g (24K)` });
    } catch {
      toast({ title: "Error", description: "Failed to update gold rate.", variant: "destructive" });
    } finally { setUpdatingRate(false); }
  };

  const kpiCards = [
    { title: "Total Revenue", value: "₹2.12 Cr", change: "+12.5%", up: true, icon: IndianRupee, color: "text-primary" },
    { title: "Gold Stock", value: "48.6 kg", change: "-2.3 kg", up: false, icon: Package, color: "text-primary" },
    { title: "Today's Sales", value: "₹38.4L", change: "+8.2%", up: true, icon: ShoppingCart, color: "text-emerald-500" },
    { title: "Active Staff", value: "127", change: "+3", up: true, icon: Users, color: "text-blue-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Central Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time overview across all branches</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30">GLOBAL</Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200">
            <span className="text-xs text-gray-500">24K Gold:</span>
            {goldRate === null ? <Skeleton className="h-4 w-20" /> : (
              <span className="text-sm font-semibold text-primary">₹{goldRate.toLocaleString("en-IN")}/g</span>
            )}
          </div>
          <Button onClick={() => setShowGoldModal(true)} className="gold-gradient text-primary-foreground font-medium hover:opacity-90">
            <RefreshCw className="w-4 h-4 mr-2" /> Update Gold Price
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="bg-white border-gray-200 hover:border-primary/30 transition-colors cursor-pointer shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                    <span className={`text-xs font-medium ${kpi.up ? "text-emerald-500" : "text-red-500"}`}>{kpi.change}</span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-gray-100"><kpi.icon className={`w-5 h-5 ${kpi.color}`} /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif text-gray-900">Branch Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={branchPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8 }} formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, ""]} />
                <Bar dataKey="revenue" fill="hsl(43,56%,52%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="target" fill="hsl(160,60%,45%)" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif text-gray-900">Sales by Category</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3} label={({ value }) => `${value}%`}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8 }} formatter={(value: number) => [`${value}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 grid grid-cols-2 gap-2">
            {categoryBreakdown.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-gray-500">{cat.name}</span>
                <span className="text-gray-900 font-medium ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif text-gray-900">Revenue Trend (6 Months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(43,56%,52%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(43,56%,52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8 }} formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, "Revenue"]} />
                <Area type="monotone" dataKey="sales" stroke="hsl(43,56%,52%)" fill="url(#goldGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif text-gray-900">Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  item.type === "sale" ? "bg-emerald-500" : item.type === "update" ? "bg-primary" :
                  item.type === "transfer" ? "bg-amber-500" : item.type === "refund" ? "bg-red-500" : "bg-gray-400"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 truncate">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.branch} · {item.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showGoldModal} onOpenChange={setShowGoldModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">Update Gold Rate (24K)</DialogTitle>
            <DialogDescription>Enter the new gold rate per gram.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">Current Rate:</span>
              <span className="font-semibold text-primary">₹{(goldRate ?? 0).toLocaleString("en-IN")}/g</span>
            </div>
            <div className="space-y-2">
              <Label>New Rate (₹/gram)</Label>
              <Input type="number" value={newGoldRate} onChange={(e) => setNewGoldRate(e.target.value)} placeholder="e.g., 7350" min="1" className="bg-muted border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoldModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateGoldRate} className="gold-gradient text-primary-foreground">Update Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Confirm Gold Rate Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update from ₹{(goldRate ?? 0).toLocaleString("en-IN")} to ₹{parseFloat(newGoldRate || "0").toLocaleString("en-IN")}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={confirmGoldRateUpdate} disabled={updatingRate} className="gold-gradient text-primary-foreground">
              {updatingRate ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
