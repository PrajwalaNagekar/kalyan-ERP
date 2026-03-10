import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ShieldCheck, Check, X, MessageSquare, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/contexts/AuthContext";

const TYPE_LABELS: Record<string, string> = {
  refund: "Refund",
  stock_adjustment: "Stock Adjustment",
  expense: "Expense",
  cash_mismatch: "Cash Mismatch",
  rate_change: "Rate Change",
  buyback: "Buyback",
  discount: "Discount Override",
};

const TYPE_COLORS: Record<string, string> = {
  refund: "bg-destructive/10 text-destructive border-destructive/20",
  stock_adjustment: "bg-warning/10 text-warning border-warning/20",
  expense: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  cash_mismatch: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  rate_change: "bg-primary/10 text-primary border-primary/20",
  buyback: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  discount: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const ApprovalsControls = () => {
  const { toast } = useToast();
  const { pendingApprovals, updateApproval, addAuditLog } = useAppStore();
  const { profile, roleGroup } = useAuth();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [infoModal, setInfoModal] = useState<string | null>(null);
  const [infoComment, setInfoComment] = useState("");

  const filtered = pendingApprovals.filter(a => {
    if (search && !a.requestedBy.toLowerCase().includes(search.toLowerCase()) && !a.value.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && a.type !== filterType) return false;
    return true;
  });

  const pending = pendingApprovals.filter(a => a.status === "pending").length;
  const approved = pendingApprovals.filter(a => a.status === "approved").length;
  const rejected = pendingApprovals.filter(a => a.status === "rejected").length;

  const handleApprove = (id: string) => {
    const item = pendingApprovals.find(a => a.id === id);
    updateApproval(id, "approved");
    addAuditLog({ user: profile?.full_name || "Manager", role: roleGroup || "admin", branch: "Central", action: `Approved ${item?.type}: ${item?.value}`, module: "Approvals", time: "Just now", before: "Pending", after: "Approved" });
    toast({ title: "Approved", description: `${id} has been approved.` });
  };

  const handleReject = () => {
    if (!rejectModal || !rejectComment.trim()) {
      toast({ title: "Comment Required", description: "Please provide a reason for rejection.", variant: "destructive" });
      return;
    }
    const item = pendingApprovals.find(a => a.id === rejectModal);
    updateApproval(rejectModal, "rejected", rejectComment);
    addAuditLog({ user: profile?.full_name || "Manager", role: roleGroup || "admin", branch: "Central", action: `Rejected ${item?.type}: ${item?.value} — "${rejectComment}"`, module: "Approvals", time: "Just now", before: "Pending", after: "Rejected" });
    toast({ title: "Rejected", description: `${rejectModal} has been rejected.` });
    setRejectModal(null);
    setRejectComment("");
  };

  const handleRequestInfo = () => {
    if (!infoModal || !infoComment.trim()) return;
    updateApproval(infoModal, "info_requested", infoComment);
    toast({ title: "Info Requested", description: "Additional information has been requested." });
    setInfoModal(null);
    setInfoComment("");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Approved</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      case "info_requested": return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Info Requested</Badge>;
      default: return <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Approvals & Controls</h1>
        <p className="text-sm text-muted-foreground">Manager approval queue for refunds, expenses, stock adjustments, and overrides</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-card"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-warning">{pending}</p><p className="text-xs text-muted-foreground mt-1">Pending Approvals</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-emerald-600">{approved}</p><p className="text-xs text-muted-foreground mt-1">Approved</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card"><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-destructive">{rejected}</p><p className="text-xs text-muted-foreground mt-1">Rejected</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
        </div>
        <Button variant={filterType === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterType("all")} className={filterType === "all" ? "gold-gradient text-primary-foreground" : ""}>All</Button>
        {Object.keys(TYPE_LABELS).map(t => (
          <Button key={t} variant={filterType === t ? "default" : "outline"} size="sm" onClick={() => setFilterType(t)} className={filterType === t ? "gold-gradient text-primary-foreground" : ""}>
            {TYPE_LABELS[t]}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" />Approval Queue</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Requested By</TableHead><TableHead>Branch</TableHead><TableHead>Value</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{a.id}</TableCell>
                  <TableCell><Badge variant="outline" className={TYPE_COLORS[a.type] || ""}>{TYPE_LABELS[a.type]}</Badge></TableCell>
                  <TableCell className="text-sm">{a.requestedBy}<span className="text-[10px] text-muted-foreground ml-1">({a.requestedByRole})</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.branch}</TableCell>
                  <TableCell className="font-semibold text-sm">{a.value}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{a.reason}</TableCell>
                  <TableCell>{statusBadge(a.status)}</TableCell>
                  <TableCell>
                    {a.status === "pending" && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50" onClick={() => handleApprove(a.id)} title="Approve"><Check className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => setRejectModal(a.id)} title="Reject"><X className="w-3.5 h-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600 hover:bg-blue-50" onClick={() => setInfoModal(a.id)} title="Request Info"><MessageSquare className="w-3.5 h-3.5" /></Button>
                      </div>
                    )}
                    {a.comment && <p className="text-[10px] text-muted-foreground mt-1 italic">"{a.comment}"</p>}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No approvals match your filters</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={!!rejectModal} onOpenChange={() => { setRejectModal(null); setRejectComment(""); }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle className="font-serif">Reject Request</DialogTitle><DialogDescription>Please provide a reason for rejecting this request.</DialogDescription></DialogHeader>
          <Textarea placeholder="Reason for rejection (required)..." value={rejectComment} onChange={e => setRejectComment(e.target.value)} className="bg-muted border-border" />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectModal(null); setRejectComment(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog */}
      <Dialog open={!!infoModal} onOpenChange={() => { setInfoModal(null); setInfoComment(""); }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle className="font-serif">Request Additional Information</DialogTitle><DialogDescription>What information do you need?</DialogDescription></DialogHeader>
          <Textarea placeholder="What details are needed..." value={infoComment} onChange={e => setInfoComment(e.target.value)} className="bg-muted border-border" />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setInfoModal(null); setInfoComment(""); }}>Cancel</Button>
            <Button className="gold-gradient text-primary-foreground" onClick={handleRequestInfo}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalsControls;
