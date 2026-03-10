import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRightLeft, Clock, CheckCircle, Truck, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const TRANSFERS = [
  { id: "TRF-1001", from: "T. Nagar Chennai", to: "Anna Nagar Chennai", items: "Gold Necklaces (5 pcs)", weight: "125g", status: "Completed", date: "03 Mar 2026" },
  { id: "TRF-1002", from: "Whitefield Bangalore", to: "Jayanagar Bangalore", items: "Diamond Rings (10 pcs)", weight: "45g", status: "In Transit", date: "02 Mar 2026" },
  { id: "TRF-1003", from: "Thrissur Kerala", to: "Calicut Kerala", items: "Silver Pooja Items (20 pcs)", weight: "1.5kg", status: "Pending Approval", date: "02 Mar 2026" },
  { id: "TRF-1004", from: "Jubilee Hills Hyderabad", to: "T. Nagar Chennai", items: "Bridal Sets (3 pcs)", weight: "250g", status: "Completed", date: "01 Mar 2026" },
  { id: "TRF-1005", from: "Anna Nagar Chennai", to: "Velachery Chennai", items: "Men's Chains (8 pcs)", weight: "96g", status: "In Transit", date: "01 Mar 2026" },
  { id: "TRF-1006", from: "Calicut Kerala", to: "Thrissur Kerala", items: "Temple Jewellery (12 pcs)", weight: "180g", status: "Pending Approval", date: "28 Feb 2026" },
];

const statusColor = (s: string) => s === "Completed" ? "bg-emerald-500/10 text-emerald-500" : s === "In Transit" ? "bg-sky-500/10 text-sky-400" : "bg-amber-500/10 text-amber-500";

const InterBranchOps = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Transfer Initiated", description: "Transfer request submitted for approval." });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Inter-Branch Operations</h1><p className="text-sm text-muted-foreground">Cross-branch stock transfers and coordination</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-1" />New Transfer</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Stock Transfer</DialogTitle></DialogHeader>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div><Label>From Branch</Label><Select name="from"><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>To Branch</Label><Select name="to"><SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger><SelectContent>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Item Description</Label><Input name="items" required /></div>
              <div><Label>Weight</Label><Input name="weight" required /></div>
              <Button type="submit" className="w-full gold-gradient text-primary-foreground">Submit Transfer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Transfers", value: TRANSFERS.filter(t => t.status !== "Completed").length, icon: ArrowRightLeft, color: "text-primary" },
          { label: "Pending Approvals", value: TRANSFERS.filter(t => t.status === "Pending Approval").length, icon: Clock, color: "text-amber-500" },
          { label: "Completed Today", value: TRANSFERS.filter(t => t.status === "Completed" && t.date.includes("03")).length, icon: CheckCircle, color: "text-emerald-500" },
          { label: "In Transit", value: TRANSFERS.filter(t => t.status === "In Transit").length, icon: Truck, color: "text-sky-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Transfer ID</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Items</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {TRANSFERS.map(t => (
              <TableRow key={t.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                <TableCell className="text-sm">{t.from}</TableCell>
                <TableCell className="text-sm">{t.to}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.items}</TableCell>
                <TableCell>{t.weight}</TableCell>
                <TableCell><Badge className={statusColor(t.status)}>{t.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default InterBranchOps;
