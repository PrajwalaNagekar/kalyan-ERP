import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, IndianRupee, FileText, RotateCcw, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Invoice = { id: string; customer: string; items: string; amount: number; payment: string; date: string; status: string; branch: string; state: string };

const STATES = ["Karnataka", "Tamil Nadu", "Kerala", "Telangana", "Maharashtra"];

const STATE_BRANCHES: Record<string, string[]> = {
  Karnataka: ["Indiranagar", "Jayanagar", "Koramangala", "Malleshwaram", "Whitefield"],
  "Tamil Nadu": ["T. Nagar", "Anna Nagar", "Velachery"],
  Kerala: ["Thrissur", "Calicut"],
  Telangana: ["Jubilee Hills", "Banjara Hills"],
  Maharashtra: ["Andheri West", "MG Road Pune"],
};

const ALL_INVOICES: Invoice[] = [
  { id: "INV-2847", customer: "Priya Sharma", items: "Gold Necklace, Earrings", amount: 330375, payment: "Card", date: "03 Mar 2026", status: "Completed", branch: "Indiranagar", state: "Karnataka" },
  { id: "INV-2846", customer: "Rajesh Kumar", items: "Men's Chain", amount: 108900, payment: "UPI", date: "03 Mar 2026", status: "Completed", branch: "Jayanagar", state: "Karnataka" },
  { id: "INV-2845", customer: "Meena Devi", items: "Bridal Choker Set", amount: 618200, payment: "Cash", date: "02 Mar 2026", status: "Completed", branch: "Koramangala", state: "Karnataka" },
  { id: "INV-2844", customer: "Arjun Reddy", items: "Diamond Ring", amount: 245000, payment: "Card", date: "02 Mar 2026", status: "Pending", branch: "Malleshwaram", state: "Karnataka" },
  { id: "INV-2843", customer: "Lakshmi Iyer", items: "Bangles (Pair)", amount: 112400, payment: "UPI", date: "01 Mar 2026", status: "Completed", branch: "T. Nagar", state: "Tamil Nadu" },
  { id: "INV-2842", customer: "Suresh Menon", items: "Gold Anklets", amount: 130680, payment: "Cash", date: "01 Mar 2026", status: "Returned", branch: "Thrissur", state: "Kerala" },
  { id: "INV-2841", customer: "Divya Nair", items: "Temple Jhumkas", amount: 90750, payment: "Card", date: "28 Feb 2026", status: "Completed", branch: "Calicut", state: "Kerala" },
  { id: "INV-2850", customer: "Ravi Shankar", items: "Gold Chain 22K", amount: 185000, payment: "UPI", date: "03 Mar 2026", status: "Completed", branch: "Anna Nagar", state: "Tamil Nadu" },
  { id: "INV-2851", customer: "Sneha Rao", items: "Diamond Studs", amount: 275000, payment: "Card", date: "02 Mar 2026", status: "Completed", branch: "Velachery", state: "Tamil Nadu" },
  { id: "INV-2852", customer: "Kavitha Reddy", items: "Bridal Set", amount: 890000, payment: "Cash", date: "03 Mar 2026", status: "Completed", branch: "Jubilee Hills", state: "Telangana" },
  { id: "INV-2853", customer: "Mohammed Ali", items: "Platinum Ring", amount: 145000, payment: "Card", date: "02 Mar 2026", status: "Completed", branch: "Banjara Hills", state: "Telangana" },
  { id: "INV-2854", customer: "Anita Desai", items: "Gold Bangles Set", amount: 420000, payment: "UPI", date: "03 Mar 2026", status: "Completed", branch: "Andheri West", state: "Maharashtra" },
  { id: "INV-2855", customer: "Vikram Patil", items: "Mangalsutra", amount: 232000, payment: "Cash", date: "01 Mar 2026", status: "Pending", branch: "MG Road Pune", state: "Maharashtra" },
];

const BranchSales = () => {
  const [stateFilter, setStateFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const branches = stateFilter !== "all" ? STATE_BRANCHES[stateFilter] || [] : Object.values(STATE_BRANCHES).flat();

  const filtered = useMemo(() => {
    let list = ALL_INVOICES;
    if (stateFilter !== "all") list = list.filter(i => i.state === stateFilter);
    if (branchFilter !== "all") list = list.filter(i => i.branch === branchFilter);
    return list;
  }, [stateFilter, branchFilter]);

  const completedRevenue = filtered.filter(i => i.status === "Completed").reduce((s, i) => s + i.amount, 0);

  const handleStateChange = (v: string) => {
    setStateFilter(v);
    setBranchFilter("all");
  };

  const handleNewSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    toast({ title: "Sale Created", description: `Invoice for ${fd.get("customer")} — ₹${Number(fd.get("amount")).toLocaleString("en-IN")}` });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Branch Sales & Billing</h1>
          <p className="text-sm text-muted-foreground">Invoice history and sales performance by state & branch</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={stateFilter} onValueChange={handleStateChange}>
            <SelectTrigger className="w-44 bg-card border-border"><SelectValue placeholder="All States" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-44 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-1" />New Sale</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Quick Sale Entry</DialogTitle></DialogHeader>
              <form onSubmit={handleNewSale} className="space-y-4">
                <div><Label>Customer Name</Label><Input name="customer" required /></div>
                <div><Label>Product</Label><Input name="product" required /></div>
                <div><Label>Amount (₹)</Label><Input name="amount" type="number" required /></div>
                <div><Label>Payment Mode</Label>
                  <Select name="payment" defaultValue="Cash">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Card">Card</SelectItem><SelectItem value="UPI">UPI</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground">Create Invoice</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue", value: `₹${(completedRevenue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-primary" },
          { label: "Invoices", value: filtered.length, icon: FileText, color: "text-sky-400" },
          { label: "Avg Order", value: filtered.length ? `₹${Math.round(completedRevenue / Math.max(filtered.filter(i=>i.status==="Completed").length, 1) / 1000)}K` : "₹0", icon: ShoppingCart, color: "text-emerald-500" },
          { label: "Returns", value: filtered.filter(i => i.status === "Returned").length, icon: RotateCcw, color: "text-rose-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div>
              <div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader><TableRow className="border-border"><TableHead>Invoice #</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Branch</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Payment</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(inv => (
                  <TableRow key={inv.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-primary">{inv.id}</TableCell>
                    <TableCell className="font-medium">{inv.customer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.items}</TableCell>
                    <TableCell className="text-xs">{inv.branch}</TableCell>
                    <TableCell className="text-right font-medium">₹{inv.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell><Badge variant="outline">{inv.payment}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                    <TableCell><Badge className={inv.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : inv.status === "Returned" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}>{inv.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No invoices found for this selection.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default BranchSales;
