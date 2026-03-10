import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Camera, Lock, ClipboardCheck } from "lucide-react";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const EVENTS = [
  { timestamp: "03 Mar, 10:15 AM", type: "Access Log", description: "Vault opened by Branch Manager (Anand Kumar)", severity: "Info", resolved: "—" },
  { timestamp: "03 Mar, 09:30 AM", type: "CCTV Alert", description: "Camera #4 offline for 2 minutes — auto-recovered", severity: "Warning", resolved: "Yes" },
  { timestamp: "02 Mar, 08:45 PM", type: "Alarm Trigger", description: "Motion detected in stock room after hours", severity: "Critical", resolved: "Yes" },
  { timestamp: "02 Mar, 06:00 PM", type: "Access Log", description: "End-of-day vault sealed — verified by security", severity: "Info", resolved: "—" },
  { timestamp: "01 Mar, 11:20 AM", type: "Compliance", description: "Fire extinguisher inspection completed", severity: "Info", resolved: "—" },
  { timestamp: "28 Feb, 03:45 PM", type: "CCTV Alert", description: "Unusual crowd detected at entrance — monitored", severity: "Warning", resolved: "Yes" },
];

const sevColor = (s: string) => s === "Critical" ? "bg-rose-500/10 text-rose-400" : s === "Warning" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground";

const BranchSecurity = () => {
  const [branch, setBranch] = useState("all");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Security & Compliance</h1><p className="text-sm text-muted-foreground">CCTV, access logs, vault status</p></div>
        <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-64 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CCTV Cameras", value: "14/16 Online", icon: Camera, color: "text-primary" },
          { label: "Vault Status", value: "Sealed", icon: Lock, color: "text-emerald-500" },
          { label: "Last Audit", value: "28 Feb 2026", icon: ClipboardCheck, color: "text-sky-400" },
          { label: "Compliance Score", value: "96%", icon: Shield, color: "text-amber-500" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Timestamp</TableHead><TableHead>Event Type</TableHead><TableHead>Description</TableHead><TableHead>Severity</TableHead><TableHead>Resolved</TableHead></TableRow></TableHeader>
          <TableBody>
            {EVENTS.map((e, i) => (
              <TableRow key={i} className="border-border hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{e.timestamp}</TableCell>
                <TableCell><Badge variant="outline">{e.type}</Badge></TableCell>
                <TableCell className="text-sm">{e.description}</TableCell>
                <TableCell><Badge className={sevColor(e.severity)}>{e.severity}</Badge></TableCell>
                <TableCell className="text-sm">{e.resolved}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchSecurity;
