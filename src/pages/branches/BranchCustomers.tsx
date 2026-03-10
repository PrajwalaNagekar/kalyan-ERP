import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Crown, IndianRupee, UserPlus, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const CUSTOMERS = [
  { name: "Priya Sharma", phone: "98765 43210", lastPurchase: "03 Mar 2026", totalSpent: 1245000, scheme: "Active", tier: "Platinum" },
  { name: "Rajesh Kumar", phone: "98765 43211", lastPurchase: "01 Mar 2026", totalSpent: 890000, scheme: "Active", tier: "Gold" },
  { name: "Meena Devi", phone: "98765 43212", lastPurchase: "28 Feb 2026", totalSpent: 2150000, scheme: "None", tier: "Diamond" },
  { name: "Arjun Reddy", phone: "98765 43213", lastPurchase: "25 Feb 2026", totalSpent: 345000, scheme: "Active", tier: "Silver" },
  { name: "Lakshmi Iyer", phone: "98765 43214", lastPurchase: "20 Feb 2026", totalSpent: 567000, scheme: "Completed", tier: "Gold" },
  { name: "Suresh Menon", phone: "98765 43215", lastPurchase: "15 Feb 2026", totalSpent: 178000, scheme: "None", tier: "Silver" },
  { name: "Divya Nair", phone: "98765 43216", lastPurchase: "10 Feb 2026", totalSpent: 1890000, scheme: "Active", tier: "Platinum" },
  { name: "Karthik Rajan", phone: "98765 43217", lastPurchase: "05 Feb 2026", totalSpent: 432000, scheme: "Active", tier: "Gold" },
];

const tierColor = (t: string) => t === "Diamond" ? "bg-sky-500/10 text-sky-400" : t === "Platinum" ? "bg-purple-500/10 text-purple-400" : t === "Gold" ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground";

const BranchCustomers = () => {
  const [branch, setBranch] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const filtered = CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: "Customer Added", description: "New customer has been registered." });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Branch Customers</h1><p className="text-sm text-muted-foreground">Customer directory by branch</p></div>
        <div className="flex gap-2">
          <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-56 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Add Customer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Full Name</Label><Input name="name" required /></div>
                <div><Label>Phone</Label><Input name="phone" required /></div>
                <div><Label>Email</Label><Input name="email" type="email" /></div>
                <Button type="submit" className="w-full gold-gradient text-primary-foreground">Register Customer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: CUSTOMERS.length, icon: Users, color: "text-primary" },
          { label: "Active Schemes", value: CUSTOMERS.filter(c => c.scheme === "Active").length, icon: Crown, color: "text-amber-500" },
          { label: "Avg Purchase", value: `₹${Math.round(CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0) / CUSTOMERS.length / 1000)}K`, icon: IndianRupee, color: "text-emerald-500" },
          { label: "New This Month", value: 3, icon: UserPlus, color: "text-sky-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Last Purchase</TableHead><TableHead className="text-right">Total Spent</TableHead><TableHead>Scheme</TableHead><TableHead>Loyalty Tier</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.phone} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-sm">{c.phone}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.lastPurchase}</TableCell>
                <TableCell className="text-right font-medium">₹{c.totalSpent.toLocaleString("en-IN")}</TableCell>
                <TableCell><Badge variant="outline" className={c.scheme === "Active" ? "border-emerald-500 text-emerald-500" : ""}>{c.scheme}</Badge></TableCell>
                <TableCell><Badge className={tierColor(c.tier)}>{c.tier}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchCustomers;
