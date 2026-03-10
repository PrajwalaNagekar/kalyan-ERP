import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const INVOICES = [
  { id: "INV-8821", date: "2026-03-02", customer: "Ravi Teja", branch: "Indiranagar", items: 2, total: 120000, status: "Paid", method: "UPI" },
  { id: "INV-8820", date: "2026-03-02", customer: "Sneha Reddy", branch: "Koramangala", items: 1, total: 45000, status: "Paid", method: "Card" },
  { id: "INV-8819", date: "2026-03-01", customer: "Walk-in", branch: "Jayanagar", items: 3, total: 210000, status: "Paid", method: "Cash" },
  { id: "INV-8818", date: "2026-03-01", customer: "Priya Sharma", branch: "Indiranagar", items: 1, total: 330375, status: "Partial", method: "Split" },
];

const POSReports = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const filtered = INVOICES.filter(i => i.id.toLowerCase().includes(search.toLowerCase()) || i.customer.toLowerCase().includes(search.toLowerCase()));

  const handleExport = () => {
    const header = "Invoice,Date,Customer,Branch,Items,Total,Method,Status";
    const rows = filtered.map(i => `${i.id},${i.date},${i.customer},${i.branch},${i.items},${i.total},${i.method},${i.status}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pos-reports.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV Exported", description: `${filtered.length} invoice(s) downloaded.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">POS Reports</h1>
          <p className="text-sm text-muted-foreground">Invoice history and sales reports</p>
        </div>
        <Button variant="outline" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Branch</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(i => (
              <TableRow key={i.id} className="border-border hover:bg-muted/30 cursor-pointer">
                <TableCell className="font-mono text-xs text-primary flex items-center gap-1"><FileText className="w-3 h-3" />{i.id}</TableCell>
                <TableCell className="text-xs">{i.date}</TableCell>
                <TableCell className="font-medium">{i.customer}</TableCell>
                <TableCell className="text-xs">{i.branch}</TableCell>
                <TableCell>{i.items}</TableCell>
                <TableCell className="font-semibold">₹{i.total.toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{i.method}</TableCell>
                <TableCell><Badge variant={i.status === "Paid" ? "default" : "secondary"} className={i.status === "Paid" ? "bg-success/20 text-success border-success/30" : ""}>{i.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default POSReports;
