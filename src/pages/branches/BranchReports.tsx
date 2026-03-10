import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Crown, Users, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const METRICS = [
  { metric: "Total Revenue", thisMonth: "₹58.2L", lastMonth: "₹52.1L", change: "+11.7%" },
  { metric: "Gold Sales (Weight)", thisMonth: "2.8 kg", lastMonth: "2.5 kg", change: "+12.0%" },
  { metric: "Silver Sales (Weight)", thisMonth: "8.5 kg", lastMonth: "7.2 kg", change: "+18.1%" },
  { metric: "Diamond Pieces Sold", thisMonth: "45", lastMonth: "38", change: "+18.4%" },
  { metric: "Average Order Value", thisMonth: "₹1.85L", lastMonth: "₹1.72L", change: "+7.6%" },
  { metric: "Customer Footfall", thisMonth: "1,240", lastMonth: "1,180", change: "+5.1%" },
  { metric: "Return Rate", thisMonth: "2.1%", lastMonth: "2.8%", change: "-25.0%" },
  { metric: "Scheme Enrollments", thisMonth: "28", lastMonth: "22", change: "+27.3%" },
];

const BranchReports = () => {
  const [branch, setBranch] = useState("all");
  const { toast } = useToast();

  const exportCSV = () => {
    const header = "Metric,This Month,Last Month,Change %\n";
    const rows = METRICS.map(m => `${m.metric},${m.thisMonth},${m.lastMonth},${m.change}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "branch-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Exported", description: "CSV file downloaded successfully." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Branch Reports & Dashboard</h1><p className="text-sm text-muted-foreground">Branch-level overview and analytics</p></div>
        <div className="flex gap-2">
          <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-56 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" />Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Revenue", value: "₹58.2L", icon: BarChart3, color: "text-primary" },
          { label: "Growth", value: "+11.7%", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Top Category", value: "Necklaces", icon: Crown, color: "text-amber-500" },
          { label: "Customer Footfall", value: "1,240", icon: Users, color: "text-sky-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Metric</TableHead><TableHead className="text-right">This Month</TableHead><TableHead className="text-right">Last Month</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
          <TableBody>
            {METRICS.map(m => (
              <TableRow key={m.metric} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{m.metric}</TableCell>
                <TableCell className="text-right">{m.thisMonth}</TableCell>
                <TableCell className="text-right text-muted-foreground">{m.lastMonth}</TableCell>
                <TableCell className={`text-right font-medium ${m.change.startsWith("+") ? "text-emerald-500" : "text-rose-400"}`}>{m.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchReports;
