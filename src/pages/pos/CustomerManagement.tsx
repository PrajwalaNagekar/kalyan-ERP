import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, UserPlus, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const INITIAL_CUSTOMERS = [
  { id: "CUST-001", name: "Priya Sharma", phone: "+91 9876543210", appStatus: "Active", scheme: "11-Month Gold Plan", monthsPaid: 4, totalPurchases: 250000 },
  { id: "CUST-002", name: "Rahul Verma", phone: "+91 9123456789", appStatus: "Inactive", scheme: "None", monthsPaid: 0, totalPurchases: 45000 },
  { id: "CUST-003", name: "Anita Desai", phone: "+91 9988776655", appStatus: "Active", scheme: "11-Month Gold Plan", monthsPaid: 11, totalPurchases: 850000 },
  { id: "CUST-004", name: "Vikram Singh", phone: "+91 9888777666", appStatus: "Active", scheme: "11-Month Gold Plan", monthsPaid: 1, totalPurchases: 12000 },
];

const CustomerManagement = () => {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const { toast } = useToast();
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const handleAdd = () => {
    if (!form.name || !form.phone) { toast({ title: "Missing Fields", description: "Name and phone are required.", variant: "destructive" }); return; }
    const newId = `CUST-${String(customers.length + 1).padStart(3, "0")}`;
    setCustomers(prev => [...prev, { id: newId, name: form.name, phone: form.phone, appStatus: "Inactive", scheme: "None", monthsPaid: 0, totalPurchases: 0 }]);
    toast({ title: "Customer Added", description: `${form.name} added as ${newId}` });
    setForm({ name: "", phone: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Customer Management</h1>
          <p className="text-sm text-muted-foreground">Customer directory and profile management</p>
        </div>
        <Button className="gold-gradient text-primary-foreground" onClick={() => setOpen(true)}><UserPlus className="w-4 h-4 mr-2" />Add Customer</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>App</TableHead><TableHead>Scheme</TableHead><TableHead>Total Purchases</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="border-border hover:bg-muted/30 cursor-pointer">
                <TableCell className="font-mono text-xs text-primary">{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" />{c.phone}</TableCell>
                <TableCell><Badge variant={c.appStatus === "Active" ? "default" : "outline"} className={c.appStatus === "Active" ? "bg-success/20 text-success border-success/30" : ""}>{c.appStatus}</Badge></TableCell>
                <TableCell className="text-xs">{c.scheme}</TableCell>
                <TableCell className="font-semibold">₹{c.totalPurchases.toLocaleString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add New Customer</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Phone Number</Label><Input placeholder="e.g. +91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button className="gold-gradient text-primary-foreground" onClick={handleAdd}>Add Customer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
