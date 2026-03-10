import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";
import { useState } from "react";

const STAFF = [
  { id: "EMP-101", name: "Suresh Kumar", role: "Store Manager", branch: "Indiranagar", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "09:45 AM" },
  { id: "EMP-102", name: "Ramesh Singh", role: "Sales Executive", branch: "Koramangala", state: "Karnataka", city: "Bengaluru", status: "On Leave", punchIn: null },
  { id: "EMP-103", name: "Deepa M", role: "Cashier", branch: "Jayanagar", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "09:30 AM" },
  { id: "EMP-104", name: "Lakshmi V", role: "Sales Executive", branch: "Indiranagar", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "10:05 AM" },
  { id: "EMP-107", name: "Ashwin R", role: "Store Manager", branch: "T. Nagar", state: "Tamil Nadu", city: "Chennai", status: "Absent", punchIn: null },
  { id: "EMP-108", name: "Karthik S", role: "Sales Executive", branch: "Anna Nagar", state: "Tamil Nadu", city: "Chennai", status: "Present", punchIn: "09:40 AM" },
  { id: "EMP-109", name: "Pooja Hegde", role: "Sales Executive", branch: "Andheri West", state: "Maharashtra", city: "Mumbai", status: "Present", punchIn: "10:00 AM" },
  { id: "EMP-110", name: "VVS Laxman", role: "Store Manager", branch: "Banjara Hills", state: "Telangana", city: "Hyderabad", status: "Present", punchIn: "09:15 AM" },
  { id: "EMP-111", name: "Ravi Teja", role: "Cashier", branch: "Whitefield", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "09:50 AM" },
  { id: "EMP-112", name: "Sneha Reddy", role: "Sales Executive", branch: "MG Road", state: "Maharashtra", city: "Pune", status: "Present", punchIn: "10:10 AM" },
  { id: "EMP-113", name: "Meera Nair", role: "Sales Executive", branch: "Koramangala", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "09:55 AM" },
  { id: "EMP-114", name: "Rahul Dravid", role: "Sales Executive", branch: "Malleshwaram", state: "Karnataka", city: "Bengaluru", status: "Present", punchIn: "09:35 AM" },
];

const statusColor = (s: string) => s === "Present" ? "bg-success/20 text-success border-success/30" : s === "On Leave" ? "bg-warning/20 text-warning border-warning/30" : "bg-destructive/20 text-destructive border-destructive/30";

const Attendance = () => {
  const [stateFilter, setStateFilter] = useState("all");
  const states = [...new Set(STAFF.map(s => s.state))];
  const filtered = stateFilter === "all" ? STAFF : STAFF.filter(s => s.state === stateFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Staff punch-in/out tracking — <span className="text-primary font-semibold">{STAFF.length}</span> total staff</p>
      </div>
      <div className="flex gap-3">
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-48 bg-card border-border"><SelectValue placeholder="Filter by State" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-success">{filtered.filter(s => s.status === "Present").length}</p><p className="text-xs text-muted-foreground mt-1">Present</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">{filtered.filter(s => s.status === "Absent").length}</p><p className="text-xs text-muted-foreground mt-1">Absent</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">{filtered.filter(s => s.status === "On Leave").length}</p><p className="text-xs text-muted-foreground mt-1">On Leave</p></CardContent></Card>
      </div>
      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Branch</TableHead><TableHead>State</TableHead><TableHead>Punch In</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(s => (
              <TableRow key={s.id} className="border-border table-row-gold">
                <TableCell className="font-mono text-xs text-primary">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-xs">{s.role}</TableCell>
                <TableCell className="text-xs">{s.branch}</TableCell>
                <TableCell className="text-xs">{s.state}</TableCell>
                <TableCell className="flex items-center gap-1 text-xs">{s.punchIn ? <><Clock className="w-3 h-3" />{s.punchIn}</> : "—"}</TableCell>
                <TableCell><Badge className={statusColor(s.status)}>{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Attendance;
