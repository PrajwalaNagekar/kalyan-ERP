import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Download, IndianRupee, ShoppingCart, TrendingUp, Building2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

const BRANCHES = ["All Branches", "Jayanagar", "Rajajinagar", "Marathahalli", "Whitefield", "Koramangala"];

const revenueByBranch = [
  { name: "Jayanagar", revenue: 4500000 },
  { name: "Rajajinagar", revenue: 3800000 },
  { name: "Marathahalli", revenue: 5200000 },
  { name: "Whitefield", revenue: 4100000 },
  { name: "Koramangala", revenue: 3600000 },
];

const dailySales = [
  { date: "01 Mar", sales: 1850000 }, { date: "02 Mar", sales: 2120000 },
  { date: "03 Mar", sales: 1980000 }, { date: "04 Mar", sales: 2480000 },
  { date: "05 Mar", sales: 2850000 }, { date: "06 Mar", sales: 2210000 },
  { date: "07 Mar", sales: 2560000 }, { date: "08 Mar", sales: 1920000 },
  { date: "09 Mar", sales: 3100000 }, { date: "10 Mar", sales: 2750000 },
];

const categorySales = [
  { name: "Necklaces", value: 8200000 },
  { name: "Bangles", value: 5800000 },
  { name: "Rings", value: 4600000 },
  { name: "Earrings", value: 3400000 },
  { name: "Chains", value: 1200000 },
];

const PIE_COLORS = ["#FFD700", "#50C878", "#4169E1", "#FF6B8A", "#FF8C42"];
const totalCategoryValue = categorySales.reduce((s, c) => s + c.value, 0);

const topProducts = [
  { rank: 1, name: "22K Gold Necklace - Lakshmi Collection", sku: "GN-1842", qty: 48, revenue: 3840000 },
  { rank: 2, name: "22K Gold Bangle Set - Bridal", sku: "GB-2201", qty: 36, revenue: 2880000 },
  { rank: 3, name: "24K Gold Chain - Classic", sku: "GC-0914", qty: 62, revenue: 2480000 },
  { rank: 4, name: "22K Gold Ring - Solitaire", sku: "GR-1156", qty: 54, revenue: 2160000 },
  { rank: 5, name: "18K Gold Earrings - Temple", sku: "GE-0738", qty: 41, revenue: 1640000 },
  { rank: 6, name: "22K Gold Pendant - Peacock", sku: "GP-1423", qty: 33, revenue: 1320000 },
  { rank: 7, name: "24K Gold Coin - 10g", sku: "GCN-010", qty: 85, revenue: 6170000 },
  { rank: 8, name: "22K Gold Anklet - Traditional", sku: "GA-0567", qty: 28, revenue: 840000 },
];

const Reports = () => {
  const [branch, setBranch] = useState("All Branches");
  const [dateFrom, setDateFrom] = useState<Date>(new Date(2026, 2, 1));
  const [dateTo, setDateTo] = useState<Date>(new Date(2026, 2, 10));

  const totalRevenue = useMemo(() => revenueByBranch.reduce((s, b) => s + b.revenue, 0), []);
  const totalTransactions = 284;
  const avgOrderValue = Math.round(totalRevenue / totalTransactions);
  const topBranch = "Marathahalli";

  const exportCSV = () => {
    const header = "Rank,Product,SKU,Quantity,Revenue\n";
    const rows = topProducts.map(p => `${p.rank},${p.name},${p.sku},${p.qty},${p.revenue}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${format(dateFrom, "yyyyMMdd")}_${format(dateTo, "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { title: "Total Revenue", value: `₹${(totalRevenue / 10000000).toFixed(2)} Cr`, icon: IndianRupee, color: "text-primary" },
    { title: "Total Transactions", value: totalTransactions.toString(), icon: ShoppingCart, color: "text-success" },
    { title: "Avg Order Value", value: `₹${(avgOrderValue / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-primary" },
    { title: "Top Branch", value: topBranch, icon: Building2, color: "text-primary" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed performance reports across branches</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[140px] justify-start text-left text-xs", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                {dateFrom ? format(dateFrom, "dd MMM yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={(d) => d && setDateFrom(d)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground text-xs">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[140px] justify-start text-left text-xs", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                {dateTo ? format(dateTo, "dd MMM yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={(d) => d && setDateTo(d)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[160px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.title} className="bg-card border-border shadow-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue by Branch */}
        <Card className="lg:col-span-2 bg-card border-border shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Revenue by Branch</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByBranch}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,12%,20%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: "hsl(220,14%,16%)", border: "1px solid hsl(220,12%,22%)", borderRadius: 8, color: "hsl(40,20%,92%)" }} formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(43,56%,52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Category-wise Sales</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                  {categorySales.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,14%,16%)", border: "1px solid hsl(220,12%,22%)", borderRadius: 8, color: "hsl(40,20%,92%)" }} formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 grid grid-cols-2 gap-1.5">
            {categorySales.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{cat.name}</span>
                <span className="font-semibold">{((cat.value / totalCategoryValue) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Sales Trend */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Daily Sales Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dailySales}>
              <defs>
                <linearGradient id="reportGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(43,56%,52%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(43,56%,52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,12%,20%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(220,10%,55%)", fontSize: 11 }} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: "hsl(220,14%,16%)", border: "1px solid hsl(220,12%,22%)", borderRadius: 8, color: "hsl(40,20%,92%)" }} formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, "Sales"]} />
              <Area type="monotone" dataKey="sales" stroke="hsl(43,56%,52%)" fill="url(#reportGoldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Top Selling Products</CardTitle></CardHeader>
        <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Qty Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map(p => (
                <TableRow key={p.rank}>
                  <TableCell className="font-medium text-primary">{p.rank}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                  <TableCell className="text-right">{p.qty}</TableCell>
                  <TableCell className="text-right font-medium">₹{(p.revenue / 100000).toFixed(1)}L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
