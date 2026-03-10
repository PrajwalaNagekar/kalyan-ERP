import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp } from "lucide-react";

const SCHEMES = [
  { customer: "Priya Sharma", monthsPaid: 4, totalAmount: 48000, maturityDate: "2026-11-01", status: "Active" },
  { customer: "Anita Desai", monthsPaid: 11, totalAmount: 132000, maturityDate: "2026-04-01", status: "Maturing Soon" },
  { customer: "Vikram Singh", monthsPaid: 1, totalAmount: 12000, maturityDate: "2027-02-01", status: "Active" },
  { customer: "Meera Nair", monthsPaid: 8, totalAmount: 96000, maturityDate: "2026-07-01", status: "Active" },
  { customer: "Ravi Teja", monthsPaid: 6, totalAmount: 72000, maturityDate: "2026-09-01", status: "Active" },
  { customer: "Sneha Reddy", monthsPaid: 10, totalAmount: 120000, maturityDate: "2026-05-01", status: "Maturing Soon" },
  { customer: "Karthik S", monthsPaid: 3, totalAmount: 36000, maturityDate: "2026-12-01", status: "Active" },
  { customer: "Lakshmi V", monthsPaid: 7, totalAmount: 84000, maturityDate: "2026-08-01", status: "Active" },
];

const GoldSchemes = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Gold Schemes</h1>
      <p className="text-sm text-muted-foreground">11-Month Gold Plan management and subscriber tracking</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><div className="flex items-center gap-3"><Gift className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Total Active Plans</p><p className="text-2xl font-bold">421</p></div></div><p className="text-xs text-success mt-2">+12 this week</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Maturity Claims (30d)</p><p className="text-2xl font-bold">18</p></div></div><p className="text-xs text-muted-foreground mt-2">Valued: ₹45.5L</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><div><p className="text-xs text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-primary">₹1.85 Cr</p></div></CardContent></Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SCHEMES.map((s, i) => (
        <Card key={i} className="bg-card border-border shadow-card card-premium">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="font-serif font-semibold">{s.customer}</p>
              <Badge variant={s.status === "Maturing Soon" ? "default" : "secondary"} className={s.status === "Maturing Soon" ? "bg-warning/20 text-warning border-warning/30" : "bg-success/20 text-success border-success/30"}>{s.status}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><p className="text-xs text-muted-foreground">Months</p><p className="font-bold">{s.monthsPaid}/11</p></div>
              <div><p className="text-xs text-muted-foreground">Paid</p><p className="font-bold text-primary">₹{(s.totalAmount / 1000).toFixed(0)}K</p></div>
              <div><p className="text-xs text-muted-foreground">Maturity</p><p className="font-bold text-xs">{s.maturityDate}</p></div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full gold-gradient rounded-full" style={{ width: `${(s.monthsPaid / 11) * 100}%` }} /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default GoldSchemes;
