import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, IndianRupee, Package, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const branchData = [
  { name: "Indiranagar", revenue: 4100000 }, { name: "Koramangala", revenue: 2800000 },
  { name: "Jayanagar", revenue: 3500000 }, { name: "Malleshwaram", revenue: 1800000 },
  { name: "Whitefield", revenue: 2900000 }, { name: "T. Nagar", revenue: 5200000 },
  { name: "Andheri West", revenue: 6800000 },
];
const categoryData = [
  { name: "Necklaces", value: 35 }, { name: "Bangles", value: 25 }, { name: "Rings", value: 20 },
  { name: "Earrings", value: 12 }, { name: "Chains", value: 8 },
];
const COLORS = ["#FFD700", "#50C878", "#4169E1", "#FF6B8A", "#FF8C42"];
const trend = [
  { month: "Oct", sales: 21200000 }, { month: "Nov", sales: 24800000 }, { month: "Dec", sales: 28500000 },
  { month: "Jan", sales: 22100000 }, { month: "Feb", sales: 25600000 }, { month: "Mar", sales: 27100000 },
];

const AnalyticsReports = () => (
  <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-serif font-bold text-foreground">Analytics & Reports</h1><p className="text-sm text-muted-foreground">Comprehensive analytics dashboard</p></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[{ label: "Total Revenue", value: "₹2.71 Cr", icon: IndianRupee }, { label: "Units Sold", value: "142", icon: Package }, { label: "Active Staff", value: "127", icon: Users }, { label: "Branches", value: "8", icon: BarChart3 }].map(k => (
        <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-5 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><k.icon className="w-5 h-5 text-primary" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-xl font-bold">{k.value}</p></div></CardContent></Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif">Revenue by Branch</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={branchData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(260,20%,18%)" /><XAxis dataKey="name" tick={{ fill: "hsl(260,15%,55%)", fontSize: 10 }} /><YAxis tick={{ fill: "hsl(260,15%,55%)", fontSize: 10 }} tickFormatter={v => `₹${(v/1000000).toFixed(1)}M`} /><Tooltip contentStyle={{ background: "hsl(260,30%,11%)", border: "1px solid hsl(260,20%,18%)", borderRadius: 8, color: "hsl(45,20%,92%)" }} /><Bar dataKey="revenue" fill="hsl(43,56%,52%)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif">Category Split</CardTitle></CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart><Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" paddingAngle={3}>{categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip contentStyle={{ background: "hsl(260,30%,11%)", border: "1px solid hsl(260,20%,18%)", borderRadius: 8, color: "hsl(45,20%,92%)" }} /></PieChart>
          </ResponsiveContainer>
        </CardContent>
        <div className="px-6 pb-4 grid grid-cols-2 gap-1.5">
          {categoryData.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-muted-foreground">{cat.name}</span>
              <span className="font-semibold">{cat.value}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif">Revenue Trend</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trend}><defs><linearGradient id="agGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(43,56%,52%)" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(43,56%,52%)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(260,20%,18%)" /><XAxis dataKey="month" tick={{ fill: "hsl(260,15%,55%)", fontSize: 11 }} /><YAxis tick={{ fill: "hsl(260,15%,55%)", fontSize: 11 }} tickFormatter={v => `₹${(v/1000000).toFixed(0)}M`} /><Tooltip contentStyle={{ background: "hsl(260,30%,11%)", border: "1px solid hsl(260,20%,18%)", borderRadius: 8, color: "hsl(45,20%,92%)" }} /><Area type="monotone" dataKey="sales" stroke="hsl(43,56%,52%)" fill="url(#agGold)" strokeWidth={2} /></AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsReports;
