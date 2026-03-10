import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowRightLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const INITIAL_TRANSFERS = [
  { id: "TRF-101", date: "2026-03-01", item: "SKU001 — Antique Gold Necklace", from: "Central Vault", to: "Indiranagar", qty: 5, status: "Completed" },
  { id: "TRF-102", date: "2026-03-02", item: "SKU003 — Bridal Choker Set", from: "Indiranagar", to: "Jayanagar", qty: 2, status: "In Transit" },
  { id: "TRF-103", date: "2026-03-02", item: "SKU005 — Temple Design Jhumka", from: "Malleshwaram", to: "Whitefield", qty: 3, status: "Pending Approval" },
  { id: "TRF-104", date: "2026-03-01", item: "SKU009 — Gold Mangalsutra", from: "T. Nagar", to: "Anna Nagar", qty: 4, status: "Completed" },
  { id: "TRF-105", date: "2026-02-28", item: "SKU012 — Bridal Waist Chain", from: "Central Vault", to: "Andheri West", qty: 1, status: "Completed" },
  { id: "TRF-106", date: "2026-03-03", item: "SKU010 — Diamond Nose Pin", from: "Andheri West", to: "Koramangala", qty: 10, status: "In Transit" },
];

const StockTransfers = () => {
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: "", from: "", to: "", qty: "" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.item || !form.from || !form.to || !form.qty) { toast({ title: "Missing Fields", description: "All fields are required.", variant: "destructive" }); return; }
    const newId = `TRF-${100 + transfers.length + 1}`;
    const today = new Date().toISOString().slice(0, 10);
    setTransfers(prev => [...prev, { id: newId, date: today, item: form.item, from: form.from, to: form.to, qty: Number(form.qty), status: "Pending Approval" }]);
    toast({ title: "Transfer Created", description: `${newId}: ${form.item} from ${form.from} → ${form.to}` });
    setForm({ item: "", from: "", to: "", qty: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">Inter-branch transfer management</p>
        </div>
        <Button className="gold-gradient text-primary-foreground" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />New Transfer</Button>
      </div>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-primary" />Transfer Log</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Date</TableHead><TableHead>Item</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {transfers.map(t => (
                <TableRow key={t.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                  <TableCell className="text-xs">{t.date}</TableCell>
                  <TableCell className="text-sm">{t.item}</TableCell>
                  <TableCell className="text-xs">{t.from}</TableCell>
                  <TableCell className="text-xs">{t.to}</TableCell>
                  <TableCell>{t.qty}</TableCell>
                  <TableCell><Badge variant={t.status === "Completed" ? "default" : t.status === "In Transit" ? "secondary" : "outline"} className={t.status === "Completed" ? "bg-success/20 text-success border-success/30" : ""}>{t.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">New Stock Transfer</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Item (SKU — Name)</Label><Input placeholder="e.g. SKU001 — Antique Gold Necklace" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>From Branch</Label><Input placeholder="e.g. Central Vault" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} /></div>
              <div className="space-y-2"><Label>To Branch</Label><Input placeholder="e.g. Indiranagar" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Quantity</Label><Input type="number" placeholder="e.g. 5" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button className="gold-gradient text-primary-foreground" onClick={handleCreate}>Create Transfer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTransfers;
