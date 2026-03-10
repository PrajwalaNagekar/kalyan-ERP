import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Smartphone, CreditCard, Receipt } from "lucide-react";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala"];

const TRANSACTIONS = [
  { date: "03 Mar", opening: 250000, sales: 890000, returns: 45000, closing: 1095000, gst: 26700 },
  { date: "02 Mar", opening: 180000, sales: 1250000, returns: 0, closing: 1430000, gst: 37500 },
  { date: "01 Mar", opening: 320000, sales: 675000, returns: 112000, closing: 883000, gst: 20250 },
  { date: "28 Feb", opening: 290000, sales: 520000, returns: 0, closing: 810000, gst: 15600 },
  { date: "27 Feb", opening: 150000, sales: 980000, returns: 65000, closing: 1065000, gst: 29400 },
  { date: "26 Feb", opening: 200000, sales: 430000, returns: 0, closing: 630000, gst: 12900 },
  { date: "25 Feb", opening: 175000, sales: 1100000, returns: 89000, closing: 1186000, gst: 33000 },
];

const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}K`;

const BranchFinance = () => {
  const [branch, setBranch] = useState("all");
  const totalSales = TRANSACTIONS.reduce((s, t) => s + t.sales, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-serif font-bold text-foreground">Branch Financials</h1><p className="text-sm text-muted-foreground">Cash registers, GST, and payment tracking</p></div>
        <Select value={branch} onValueChange={setBranch}><SelectTrigger className="w-64 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cash in Register", value: `₹${(TRANSACTIONS[0].closing / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-primary" },
          { label: "UPI Collections", value: `₹${(totalSales * 0.35 / 100000).toFixed(1)}L`, icon: Smartphone, color: "text-emerald-500" },
          { label: "Card Payments", value: `₹${(totalSales * 0.25 / 100000).toFixed(1)}L`, icon: CreditCard, color: "text-sky-400" },
          { label: "GST Payable", value: `₹${(TRANSACTIONS.reduce((s, t) => s + t.gst, 0) / 1000).toFixed(0)}K`, icon: Receipt, color: "text-amber-500" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card"><CardContent className="p-4 flex items-center gap-3"><div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div><div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Date</TableHead><TableHead className="text-right">Opening</TableHead><TableHead className="text-right">Sales</TableHead><TableHead className="text-right">Returns</TableHead><TableHead className="text-right">Closing</TableHead><TableHead className="text-right">GST</TableHead></TableRow></TableHeader>
          <TableBody>
            {TRANSACTIONS.map(t => (
              <TableRow key={t.date} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{t.date}</TableCell>
                <TableCell className="text-right">{fmt(t.opening)}</TableCell>
                <TableCell className="text-right text-emerald-500">{fmt(t.sales)}</TableCell>
                <TableCell className="text-right text-rose-400">{t.returns > 0 ? fmt(t.returns) : "—"}</TableCell>
                <TableCell className="text-right font-medium">{fmt(t.closing)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{fmt(t.gst)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchFinance;
