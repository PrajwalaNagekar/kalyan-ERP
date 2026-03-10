import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const INITIAL_ORDERS = [
  { id: "ORD-901", customer: "Priya Sharma", design: "Custom Temple Ring", advance: 25000, total: 85000, due: "2026-03-10", branch: "Indiranagar", status: "With Goldsmith" },
  { id: "ORD-902", customer: "Rahul Verma", design: "Platinum Band Replica", advance: 15000, total: 62000, due: "2026-03-12", branch: "Koramangala", status: "Pending Materials" },
  { id: "ORD-903", customer: "Anita Desai", design: "Heritage Necklace Set", advance: 100000, total: 450000, due: "2026-03-15", branch: "Jayanagar", status: "Design Approved" },
];

const OrderBilling = () => {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", design: "", advance: "", total: "", due: "" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.customer || !form.design || !form.total) { toast({ title: "Missing Fields", description: "Customer, design, and total are required.", variant: "destructive" }); return; }
    const newId = `ORD-${900 + orders.length + 1}`;
    setOrders(prev => [...prev, { id: newId, customer: form.customer, design: form.design, advance: Number(form.advance) || 0, total: Number(form.total), due: form.due || "TBD", branch: "Indiranagar", status: "Design Approved" }]);
    toast({ title: "Order Created", description: `${newId} for ${form.customer}` });
    setForm({ customer: "", design: "", advance: "", total: "", due: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Order Billing</h1>
          <p className="text-sm text-muted-foreground">Custom order tickets with advance payment tracking</p>
        </div>
        <Button className="gold-gradient text-primary-foreground" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />New Order</Button>
      </div>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary" />Active Orders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Design</TableHead><TableHead>Advance</TableHead><TableHead>Total</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{o.id}</TableCell>
                  <TableCell className="font-medium">{o.customer}</TableCell>
                  <TableCell className="text-sm">{o.design}</TableCell>
                  <TableCell>₹{o.advance.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="font-semibold">₹{o.total.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs">{o.due}</TableCell>
                  <TableCell><Badge variant="secondary">{o.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">New Custom Order</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Customer Name</Label><Input placeholder="e.g. Priya Sharma" value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Design Description</Label><Input placeholder="e.g. Custom Temple Ring" value={form.design} onChange={e => setForm(f => ({ ...f, design: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Advance (₹)</Label><Input type="number" placeholder="25000" value={form.advance} onChange={e => setForm(f => ({ ...f, advance: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Total (₹)</Label><Input type="number" placeholder="85000" value={form.total} onChange={e => setForm(f => ({ ...f, total: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button className="gold-gradient text-primary-foreground" onClick={handleCreate}>Create Order</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderBilling;
