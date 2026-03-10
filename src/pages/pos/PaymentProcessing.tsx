import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard, Smartphone } from "lucide-react";

const PAYMENTS = [
  { id: "PAY-501", invoice: "INV-8821", customer: "Ravi Teja", amount: 120000, method: "UPI", status: "Settled", date: "2026-03-02" },
  { id: "PAY-502", invoice: "INV-8820", customer: "Sneha Reddy", amount: 45000, method: "Card", status: "Settled", date: "2026-03-02" },
  { id: "PAY-503", invoice: "INV-8819", customer: "Walk-in", amount: 210000, method: "Cash", status: "Settled", date: "2026-03-01" },
  { id: "PAY-504", invoice: "INV-8818", customer: "Priya Sharma", amount: 330375, method: "Split", status: "Partial", date: "2026-03-01" },
];

const methodIcon = (m: string) => m === "Cash" ? <Banknote className="w-3 h-3" /> : m === "Card" ? <CreditCard className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />;

const PaymentProcessing = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Payment Processing</h1>
      <p className="text-sm text-muted-foreground">Split payments — Cash, Card, UPI tracking</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[{ label: "Cash Today", value: "₹2,10,000", icon: Banknote },
        { label: "Card Today", value: "₹45,000", icon: CreditCard },
        { label: "UPI Today", value: "₹1,20,000", icon: Smartphone }].map(k => (
        <Card key={k.label} className="bg-card border-border shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-muted"><k.icon className="w-5 h-5 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-xl font-bold">{k.value}</p></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif">Payment Ledger</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {PAYMENTS.map(p => (
              <TableRow key={p.id} className="border-border">
                <TableCell className="font-mono text-xs text-primary">{p.id}</TableCell>
                <TableCell className="font-mono text-xs">{p.invoice}</TableCell>
                <TableCell>{p.customer}</TableCell>
                <TableCell className="font-semibold">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                <TableCell><div className="flex items-center gap-1.5">{methodIcon(p.method)}<span className="text-xs">{p.method}</span></div></TableCell>
                <TableCell><Badge variant={p.status === "Settled" ? "default" : "secondary"} className={p.status === "Settled" ? "bg-success/20 text-success border-success/30" : ""}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default PaymentProcessing;
