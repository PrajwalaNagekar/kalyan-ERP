import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, CreditCard, Banknote, Smartphone } from "lucide-react";

const DAILY_TRANSACTIONS = [
  { time: "10:15 AM", invoice: "INV-2841", customer: "Priya Sharma", type: "Sale", method: "Card", amount: 330375 },
  { time: "11:30 AM", invoice: "INV-2842", customer: "Walk-in", type: "Sale", method: "Cash", amount: 90750 },
  { time: "12:45 PM", invoice: "INV-2843", customer: "Anita Desai", type: "Exchange", method: "Cash", amount: -45000 },
  { time: "02:10 PM", invoice: "INV-2844", customer: "Vikram Singh", type: "Sale", method: "UPI", amount: 108900 },
  { time: "03:30 PM", invoice: "INV-2845", customer: "Meera Nair", type: "Sale", method: "Card", amount: 618200 },
  { time: "04:15 PM", invoice: "REF-0412", customer: "Rahul Verma", type: "Refund", method: "Cash", amount: -108900 },
  { time: "05:00 PM", invoice: "INV-2847", customer: "Deepa Menon", type: "Sale", method: "UPI", amount: 245000 },
];

const FinancialAudits = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Financial Audits</h1>
      <p className="text-sm text-muted-foreground">Cash register, GST totals, and electronic payment reconciliation</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-lg bg-muted"><Banknote className="w-6 h-6 text-primary" /></div><div><p className="text-xs text-muted-foreground">Cash in Register</p><p className="text-xl font-bold">₹8,45,000</p></div></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-lg bg-muted"><CreditCard className="w-6 h-6 text-primary" /></div><div><p className="text-xs text-muted-foreground">Card Settlements</p><p className="text-xl font-bold">₹3,20,000</p></div></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-lg bg-muted"><Smartphone className="w-6 h-6 text-primary" /></div><div><p className="text-xs text-muted-foreground">UPI Collections</p><p className="text-xl font-bold">₹2,85,000</p></div></CardContent></Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif">Daily Reconciliation</CardTitle></CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><p className="text-xs text-muted-foreground">Total Sales</p><p className="text-lg font-bold text-primary">₹14,50,000</p></div>
          <div><p className="text-xs text-muted-foreground">Returns</p><p className="text-lg font-bold text-destructive">₹1,08,900</p></div>
          <div><p className="text-xs text-muted-foreground">Net Revenue</p><p className="text-lg font-bold text-success">₹13,41,100</p></div>
          <div><p className="text-xs text-muted-foreground">GST Collected</p><p className="text-lg font-bold">₹40,233</p></div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><IndianRupee className="w-4 h-4 text-primary" />Transaction Breakdown</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Time</TableHead><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Type</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
          <TableBody>
            {DAILY_TRANSACTIONS.map(t => (
              <TableRow key={t.invoice} className="border-border table-row-gold">
                <TableCell className="text-xs">{t.time}</TableCell>
                <TableCell className="font-mono text-xs text-primary">{t.invoice}</TableCell>
                <TableCell className="font-medium text-sm">{t.customer}</TableCell>
                <TableCell className="text-xs">{t.type}</TableCell>
                <TableCell className="text-xs">{t.method}</TableCell>
                <TableCell className={`text-right font-semibold ${t.amount < 0 ? "text-destructive" : "text-foreground"}`}>
                  {t.amount < 0 ? "-" : ""}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default FinancialAudits;
