import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Ticket, Plus, Search, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/contexts/AuthContext";

interface TicketItem {
  id: string;
  title: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "assigned" | "resolved" | "closed";
  assignedTo: string;
  branch: string;
  createdBy: string;
  createdAt: string;
  description: string;
}

const INITIAL_TICKETS: TicketItem[] = [
  { id: "TKT-001", title: "POS terminal not printing receipts", category: "Hardware", priority: "high", status: "assigned", assignedTo: "IT Support", branch: "Jayanagar", createdBy: "Priya Sharma", createdAt: "2026-03-04 09:30", description: "Thermal printer at counter 2 is not responding" },
  { id: "TKT-002", title: "Gold rate not updating on app", category: "Software", priority: "critical", status: "open", assignedTo: "—", branch: "Marathahalli", createdBy: "Anand Reddy", createdAt: "2026-03-04 10:15", description: "Customer-facing app showing yesterday's gold rate" },
  { id: "TKT-003", title: "CCTV camera offline - Vault area", category: "Security", priority: "critical", status: "assigned", assignedTo: "Security Team", branch: "Whitefield", createdBy: "Branch Manager", createdAt: "2026-03-03 18:00", description: "Camera 4 in vault area went offline" },
  { id: "TKT-004", title: "Customer complaint - wrong hallmark", category: "Quality", priority: "medium", status: "resolved", assignedTo: "QC Team", branch: "Jayanagar", createdBy: "Lakshmi V", createdAt: "2026-03-02 14:00", description: "Customer reported wrong hallmark on purchased ring" },
  { id: "TKT-005", title: "AC not working in showroom", category: "Maintenance", priority: "low", status: "closed", assignedTo: "Facility Mgmt", branch: "Koramangala", createdBy: "Staff", createdAt: "2026-03-01 11:00", description: "AC unit 3 in main showroom floor not cooling" },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-warning/20 text-warning border-warning/30",
  assigned: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  resolved: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

const TicketManagement = () => {
  const { toast } = useToast();
  const { toggles, addAuditLog } = useAppStore();
  const { profile, roleGroup } = useAuth();
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", category: "Hardware", priority: "medium" as const, description: "" });

  if (!toggles.enableTicketManagement) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="bg-card border-border max-w-md"><CardContent className="p-8 text-center">
          <Ban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-serif font-bold text-foreground mb-2">Feature Disabled by Admin</h2>
          <p className="text-sm text-muted-foreground">Ticket Management has been disabled. Contact your administrator to enable it.</p>
        </CardContent></Card>
      </div>
    );
  }

  const filtered = tickets.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  const handleCreate = () => {
    if (!newTicket.title.trim()) {
      toast({ title: "Title Required", variant: "destructive" });
      return;
    }
    const ticket: TicketItem = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      ...newTicket,
      status: "open",
      assignedTo: "—",
      branch: "Jayanagar",
      createdBy: profile?.full_name || "User",
      createdAt: new Date().toLocaleString("en-IN"),
    };
    setTickets(prev => [ticket, ...prev]);
    addAuditLog({ user: profile?.full_name || "User", role: roleGroup || "operations", branch: "Jayanagar", action: `Ticket created: ${ticket.id}`, module: "Tickets", time: "Just now", before: "—", after: ticket.title });
    toast({ title: "Ticket Created", description: `${ticket.id} has been created.` });
    setShowCreate(false);
    setNewTicket({ title: "", category: "Hardware", priority: "medium", description: "" });
  };

  const handleStatusChange = (id: string, newStatus: TicketItem["status"]) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    addAuditLog({ user: profile?.full_name || "User", role: roleGroup || "operations", branch: "Jayanagar", action: `Ticket ${id} status changed`, module: "Tickets", time: "Just now", before: tickets.find(t => t.id === id)?.status || "", after: newStatus });
    toast({ title: "Status Updated", description: `${id} → ${newStatus}` });
  };

  const counts = {
    open: tickets.filter(t => t.status === "open").length,
    assigned: tickets.filter(t => t.status === "assigned").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Ticket Management</h1>
          <p className="text-sm text-muted-foreground">Track and resolve issues across branches</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />New Ticket</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{counts.open}</p><p className="text-xs text-muted-foreground">Open</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{counts.assigned}</p><p className="text-xs text-muted-foreground">Assigned</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-600">{counts.resolved}</p><p className="text-xs text-muted-foreground">Resolved</p></CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-muted-foreground">{counts.closed}</p><p className="text-xs text-muted-foreground">Closed</p></CardContent></Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
        </div>
        {["all", "open", "assigned", "resolved", "closed"].map(s => (
          <Button key={s} variant={filterStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilterStatus(s)} className={filterStatus === s ? "gold-gradient text-primary-foreground" : ""}>{s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}</Button>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Branch</TableHead><TableHead>Assigned To</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                  <TableCell className="text-sm font-medium max-w-[200px] truncate">{t.title}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.category}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.branch}</TableCell>
                  <TableCell className="text-xs">{t.assignedTo}</TableCell>
                  <TableCell><Badge variant="outline" className={STATUS_COLORS[t.status]}>{t.status}</Badge></TableCell>
                  <TableCell>
                    {t.status === "open" && <Button size="sm" variant="outline" className="text-xs" onClick={() => handleStatusChange(t.id, "assigned")}>Assign</Button>}
                    {t.status === "assigned" && <Button size="sm" variant="outline" className="text-xs" onClick={() => handleStatusChange(t.id, "resolved")}>Resolve</Button>}
                    {t.status === "resolved" && <Button size="sm" variant="outline" className="text-xs" onClick={() => handleStatusChange(t.id, "closed")}>Close</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="font-serif">Create New Ticket</DialogTitle><DialogDescription>Report an issue or request</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={newTicket.title} onChange={e => setNewTicket(p => ({ ...p, title: e.target.value }))} placeholder="Brief issue description" className="bg-muted border-border" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Category</Label>
                <Select value={newTicket.category} onValueChange={v => setNewTicket(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Hardware", "Software", "Security", "Quality", "Maintenance", "Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Priority</Label>
                <Select value={newTicket.priority} onValueChange={v => setNewTicket(p => ({ ...p, priority: v as any }))}>
                  <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>{["low", "medium", "high", "critical"].map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} placeholder="Detailed description..." className="bg-muted border-border" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button className="gold-gradient text-primary-foreground" onClick={handleCreate}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketManagement;
