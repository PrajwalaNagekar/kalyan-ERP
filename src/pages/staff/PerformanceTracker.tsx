import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, TrendingUp, TrendingDown, Download, Award, AlertTriangle, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STAFF = [
  { id: "EMP-101", name: "Suresh Kumar", role: "Store Manager", branch: "Indiranagar", salesToday: 450000, salesWeek: 2800000, salesMonth: 11500000, target: 500000, targetWeek: 3000000, targetMonth: 12000000, conversions: 18, trend: "up" as const },
  { id: "EMP-103", name: "Deepa M", role: "Cashier", branch: "Jayanagar", salesToday: 850000, salesWeek: 4200000, salesMonth: 17000000, target: 800000, targetWeek: 4000000, targetMonth: 16000000, conversions: 25, trend: "up" as const },
  { id: "EMP-105", name: "Rahul Dravid", role: "Sales Executive", branch: "Malleshwaram", salesToday: 670000, salesWeek: 3500000, salesMonth: 14200000, target: 500000, targetWeek: 2500000, targetMonth: 10000000, conversions: 22, trend: "up" as const },
  { id: "EMP-109", name: "Pooja Hegde", role: "Sales Executive", branch: "Andheri West", salesToday: 950000, salesWeek: 5100000, salesMonth: 19500000, target: 1000000, targetWeek: 5000000, targetMonth: 20000000, conversions: 19, trend: "down" as const },
  { id: "EMP-113", name: "VVS Laxman", role: "Store Manager", branch: "Banjara Hills", salesToday: 1450000, salesWeek: 7200000, salesMonth: 29000000, target: 1200000, targetWeek: 6000000, targetMonth: 24000000, conversions: 28, trend: "up" as const },
  { id: "EMP-114", name: "Ashwin R", role: "Store Manager", branch: "T. Nagar", salesToday: 1120000, salesWeek: 5800000, salesMonth: 22400000, target: 1000000, targetWeek: 5000000, targetMonth: 20000000, conversions: 24, trend: "up" as const },
  { id: "EMP-115", name: "Meera Nair", role: "Sales Executive", branch: "Koramangala", salesToday: 380000, salesWeek: 1900000, salesMonth: 7600000, target: 400000, targetWeek: 2000000, targetMonth: 8000000, conversions: 14, trend: "down" as const },
  { id: "EMP-116", name: "Ravi Teja", role: "Cashier", branch: "Whitefield", salesToday: 520000, salesWeek: 2600000, salesMonth: 10400000, target: 600000, targetWeek: 3000000, targetMonth: 12000000, conversions: 16, trend: "down" as const },
  { id: "EMP-117", name: "Sneha Reddy", role: "Sales Executive", branch: "MG Road", salesToday: 290000, salesWeek: 1500000, salesMonth: 5800000, target: 350000, targetWeek: 1750000, targetMonth: 7000000, conversions: 11, trend: "down" as const },
  { id: "EMP-118", name: "Karthik S", role: "Sales Executive", branch: "Anna Nagar", salesToday: 410000, salesWeek: 2100000, salesMonth: 8200000, target: 450000, targetWeek: 2250000, targetMonth: 9000000, conversions: 15, trend: "up" as const },
];

const BRANCHES = [...new Set(STAFF.map(s => s.branch))];
const ROLES = [...new Set(STAFF.map(s => s.role))];

const PerformanceTracker = () => {
  const [branchFilter, setBranchFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    let list = STAFF;
    if (branchFilter !== "all") list = list.filter(s => s.branch === branchFilter);
    if (roleFilter !== "all") list = list.filter(s => s.role === roleFilter);
    return list;
  }, [branchFilter, roleFilter]);

  const getSales = (s: typeof STAFF[0]) => period === "today" ? s.salesToday : period === "week" ? s.salesWeek : s.salesMonth;
  const getTarget = (s: typeof STAFF[0]) => period === "today" ? s.target : period === "week" ? s.targetWeek : s.targetMonth;

  const ranked = useMemo(() =>
    [...filtered].sort((a, b) => getSales(b) - getSales(a)),
    [filtered, period]
  );

  const topPerformer = ranked[0];
  const lowestPerformer = ranked[ranked.length - 1];
  const totalRevenue = ranked.reduce((s, r) => s + getSales(r), 0);
  const totalConversions = ranked.reduce((s, r) => s + r.conversions, 0);
  const avgAchievement = ranked.length ? Math.round(ranked.reduce((s, r) => s + (getSales(r) / getTarget(r)) * 100, 0) / ranked.length) : 0;

  const formatVal = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
    return `₹${(v / 100000).toFixed(1)}L`;
  };

  const handleExport = () => {
    const header = "Rank,ID,Name,Role,Branch,Sales,Target,Achievement%,Conversions,Trend";
    const rows = ranked.map((s, i) => {
      const pct = Math.round((getSales(s) / getTarget(s)) * 100);
      return `${i + 1},${s.id},${s.name},${s.role},${s.branch},${getSales(s)},${getTarget(s)},${pct},${s.conversions},${s.trend}`;
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "performance-report.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${ranked.length} staff records downloaded.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Performance Tracker</h1>
          <p className="text-sm text-muted-foreground">KPIs, targets, and top performers across all branches</p>
        </div>
        <Button onClick={handleExport} className="gold-gradient text-primary-foreground">
          <Download className="w-4 h-4 mr-1" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-card border-border"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as "today" | "week" | "month")}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Top Performer</p>
              <p className="font-serif font-bold text-sm truncate">{topPerformer?.name}</p>
              <p className="text-xs text-primary">{formatVal(getSales(topPerformer))}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-destructive shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Needs Attention</p>
              <p className="font-serif font-bold text-sm truncate">{lowestPerformer?.name}</p>
              <p className="text-xs text-destructive">{formatVal(getSales(lowestPerformer))}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-primary">{formatVal(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground">Total Conversions</p>
            <p className="text-xl font-bold text-primary">{totalConversions}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground">Avg Achievement</p>
            <p className="text-xl font-bold text-emerald-500">{avgAchievement}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Staff Performance ({ranked.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead className="w-40">Achievement</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranked.map((s, i) => {
                    const sales = getSales(s);
                    const target = getTarget(s);
                    const pct = Math.round((sales / target) * 100);
                    return (
                      <TableRow key={s.id} className="border-border table-row-gold">
                        <TableCell>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? "bg-primary/20 text-primary" : i === 1 ? "bg-muted text-muted-foreground" : i === 2 ? "bg-amber-500/20 text-amber-600" : "text-muted-foreground"}`}>
                            {i + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-primary">{s.id}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-xs">{s.role}</TableCell>
                        <TableCell className="text-xs">{s.branch}</TableCell>
                        <TableCell className="font-semibold">{formatVal(sales)}</TableCell>
                        <TableCell className="text-xs">{formatVal(target)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(pct, 100)} className="h-2 flex-1" />
                            <Badge className={pct >= 100 ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : pct >= 80 ? "bg-amber-500/20 text-amber-500 border-amber-500/30" : "bg-destructive/20 text-destructive border-destructive/30"}>{pct}%</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{s.conversions}</TableCell>
                        <TableCell>
                          {s.trend === "up" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-500 text-xs"><TrendingUp className="w-3.5 h-3.5" />Rising</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive text-xs"><TrendingDown className="w-3.5 h-3.5" />Declining</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTracker;
