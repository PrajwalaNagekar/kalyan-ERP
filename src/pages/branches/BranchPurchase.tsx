import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, Package, Clock, Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala", "Banjara Hills Hyderabad", "MG Road Pune"];

const POS = [
  { po: "PO-4501", vendor: "Rajesh Gold Suppliers", items: "22K Gold Bars (500g)", amount: 3625000, status: "Delivered", date: "28 Feb 2026" },
  { po: "PO-4502", vendor: "Mehta Diamond Co.", items: "VVS Diamonds (20 pcs)", amount: 1850000, status: "Pending", date: "01 Mar 2026" },
  { po: "PO-4503", vendor: "Southern Gems Ltd", items: "Ruby & Emerald Stones", amount: 425000, status: "Partial", date: "25 Feb 2026" },
  { po: "PO-4504", vendor: "Jain Silver Works", items: "925 Silver Sheets (2kg)", amount: 184000, status: "Delivered", date: "20 Feb 2026" },
  { po: "PO-4505", vendor: "Bangalore Bullion", items: "24K Gold Coins (100 pcs)", amount: 7250000, status: "Pending", date: "02 Mar 2026" },
  { po: "PO-4506", vendor: "Tanishq Packaging", items: "Velvet Boxes & Bags", amount: 35000, status: "Delivered", date: "18 Feb 2026" },
];

const BranchPurchase = () => {
  const [branch, setBranch] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleNewPO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Purchase Order Created", description: "New PO has been submitted for approval." });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Purchase & Procurement</h1><p className="text-sm text-muted-foreground">Vendor purchase orders and procurement</p></div>
        <div className="flex gap-2">
          <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-56 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-1" />New PO</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
              <form onSubmit={handleNewPO} className="space-y-4">
                <div><Label>Vendor</Label><Input name="vendor" required /></div>
                <div><Label>Items Description</Label><Input name="items" required /></div>
                <div><Label>Amount (₹)</Label><Input name="amount" type="number" required /></div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground">Submit PO</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open POs", value: POS.filter(p => p.status !== "Delivered").length, icon: Package, color: "text-primary" },
          { label: "Total Value", value: `₹${(POS.reduce((s, p) => s + p.amount, 0) / 100000).toFixed(1)}L`, icon: Truck, color: "text-emerald-500" },
          { label: "Pending Deliveries", value: POS.filter(p => p.status === "Pending").length, icon: Clock, color: "text-amber-500" },
          { label: "Vendors", value: new Set(POS.map(p => p.vendor)).size, icon: Users, color: "text-sky-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>PO #</TableHead><TableHead>Vendor</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {POS.map(p => (
              <TableRow key={p.po} className="border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">{p.po}</TableCell>
                <TableCell className="font-medium">{p.vendor}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.items}</TableCell>
                <TableCell className="text-right font-medium">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell><Badge className={p.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : p.status === "Partial" ? "bg-amber-500/10 text-amber-500" : "bg-sky-500/10 text-sky-500"}>{p.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchPurchase;
