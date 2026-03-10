import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Star } from "lucide-react";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const STAFF = [
  { name: "Anand Kumar", role: "Branch Manager", attendance: "Present", rating: 4.8, shift: "Morning", contact: "98765 00001" },
  { name: "Deepa Sharma", role: "Sales Executive", attendance: "Present", rating: 4.5, shift: "Morning", contact: "98765 00002" },
  { name: "Ravi Prasad", role: "Cashier", attendance: "Present", rating: 4.2, shift: "Full Day", contact: "98765 00003" },
  { name: "Sunitha Reddy", role: "Sales Executive", attendance: "On Leave", rating: 4.6, shift: "Evening", contact: "98765 00004" },
  { name: "Mohammed Riyaz", role: "Goldsmith", attendance: "Present", rating: 4.9, shift: "Morning", contact: "98765 00005" },
  { name: "Preethi M.", role: "Inventory Manager", attendance: "Present", rating: 4.3, shift: "Full Day", contact: "98765 00006" },
  { name: "Ganesh R.", role: "Security", attendance: "Present", rating: 4.0, shift: "Night", contact: "98765 00007" },
  { name: "Kavitha S.", role: "Accountant", attendance: "On Leave", rating: 4.4, shift: "Morning", contact: "98765 00008" },
];

const BranchHR = () => {
  const [branch, setBranch] = useState("all");
  const present = STAFF.filter(s => s.attendance === "Present").length;
  const onLeave = STAFF.filter(s => s.attendance === "On Leave").length;
  const avgRating = (STAFF.reduce((s, st) => s + st.rating, 0) / STAFF.length).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">HR & Staff Monitoring</h1><p className="text-sm text-muted-foreground">Staff performance by branch</p></div>
        <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-64 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: STAFF.length, icon: Users, color: "text-primary" },
          { label: "Present Today", value: present, icon: UserCheck, color: "text-emerald-500" },
          { label: "On Leave", value: onLeave, icon: UserX, color: "text-rose-400" },
          { label: "Avg Performance", value: avgRating, icon: Star, color: "text-amber-500" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Rating</TableHead><TableHead>Shift</TableHead><TableHead>Contact</TableHead></TableRow></TableHeader>
          <TableBody>
            {STAFF.map(s => (
              <TableRow key={s.contact} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.role}</TableCell>
                <TableCell><Badge className={s.attendance === "Present" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-400"}>{s.attendance}</Badge></TableCell>
                <TableCell><span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" />{s.rating}</span></TableCell>
                <TableCell className="text-sm">{s.shift}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchHR;
