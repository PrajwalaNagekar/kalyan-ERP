import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Truck, FileText, Plus } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  type: string;
  balance: number;
  status: string;
  phone?: string;
}

const INITIAL_VENDORS: Vendor[] = [
  { id: "V-001", name: "Rajesh Exports", type: "Bullion", balance: 1250000, status: "Active" },
  { id: "V-002", name: "KGF Suppliers", type: "Raw Gold", balance: 0, status: "Active" },
  { id: "V-003", name: "Srikar Designs", type: "Goldsmith", balance: 340000, status: "Active" },
  { id: "V-004", name: "Artisan Gold Works", type: "Goldsmith", balance: 180000, status: "Active" },
  { id: "V-005", name: "Mumbai Bullion House", type: "Bullion", balance: 2450000, status: "Active" },
  { id: "V-006", name: "Hyderabad Gems Co.", type: "Gemstones", balance: 560000, status: "Active" },
  { id: "V-007", name: "Chennai Silver Corp", type: "Silver", balance: 120000, status: "Active" },
  { id: "V-008", name: "Jaipur Kundan Arts", type: "Goldsmith", balance: 890000, status: "Inactive" },
];

const PURCHASE_ORDERS = [
  { po: "PO-4501", vendor: "Rajesh Exports", item: "24K Gold Bars (1kg)", qty: 2, amount: 14500000, date: "2026-03-01", status: "Delivered" },
  { po: "PO-4502", vendor: "Hyderabad Gems Co.", item: "Polished Diamonds (5ct)", qty: 10, amount: 2500000, date: "2026-03-02", status: "In Transit" },
  { po: "PO-4503", vendor: "Chennai Silver Corp", item: "Silver Bars (10kg)", qty: 5, amount: 460000, date: "2026-03-03", status: "Pending" },
];

const VENDOR_TYPES = ["Bullion", "Raw Gold", "Goldsmith", "Gemstones", "Silver"];

const VendorProcurement = () => {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", type: "", phone: "", status: "Active" });

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.type) return;
    const lastNum = Math.max(...vendors.map(v => parseInt(v.id.split("-")[1])));
    const newId = `V-${String(lastNum + 1).padStart(3, "0")}`;
    setVendors(prev => [...prev, { id: newId, name: newVendor.name, type: newVendor.type, balance: 0, status: newVendor.status, phone: newVendor.phone }]);
    setNewVendor({ name: "", type: "", phone: "", status: "Active" });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Vendor & Procurement</h1>
          <p className="text-sm text-muted-foreground">Vendor directory, outstanding balances, and purchase orders</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Vendor Name</Label>
              <Input placeholder="Enter vendor name" value={newVendor.name} onChange={e => setNewVendor(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={newVendor.type} onValueChange={v => setNewVendor(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {VENDOR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input placeholder="Enter phone number" value={newVendor.phone} onChange={e => setNewVendor(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={newVendor.status} onValueChange={v => setNewVendor(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVendor} disabled={!newVendor.name || !newVendor.type}>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total Vendors</p><p className="text-2xl font-bold text-primary">{vendors.length}</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Outstanding Balance</p><p className="text-2xl font-bold text-warning">₹{(vendors.reduce((s, v) => s + v.balance, 0) / 100000).toFixed(1)}L</p></CardContent></Card>
        <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Pending POs</p><p className="text-2xl font-bold">{PURCHASE_ORDERS.filter(p => p.status !== "Delivered").length}</p></CardContent></Card>
      </div>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Vendor List</CardTitle></CardHeader>
        <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {vendors.map(v => (
                <TableRow key={v.id} className="border-border table-row-gold">
                  <TableCell className="font-mono text-xs text-primary">{v.id}</TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-xs">{v.type}</TableCell>
                  <TableCell className="font-semibold">₹{v.balance.toLocaleString("en-IN")}</TableCell>
                  <TableCell><Badge className={v.status === "Active" ? "bg-success/20 text-success border-success/30" : ""}>{v.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />Purchase Orders</CardTitle></CardHeader>
        <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>PO #</TableHead><TableHead>Vendor</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {PURCHASE_ORDERS.map(p => (
                <TableRow key={p.po} className="border-border table-row-gold">
                  <TableCell className="font-mono text-xs text-primary">{p.po}</TableCell>
                  <TableCell className="font-medium text-sm">{p.vendor}</TableCell>
                  <TableCell className="text-xs">{p.item}</TableCell>
                  <TableCell>{p.qty}</TableCell>
                  <TableCell className="font-semibold">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs">{p.date}</TableCell>
                  <TableCell><Badge className={p.status === "Delivered" ? "bg-success/20 text-success border-success/30" : p.status === "In Transit" ? "" : "bg-warning/20 text-warning border-warning/30"}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProcurement;
