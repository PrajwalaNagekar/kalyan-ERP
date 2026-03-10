import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const GST_DATA = [
  { month: "March 2026", cgst: 450000, sgst: 450000, status: "Pending", due: "2026-04-20" },
  { month: "February 2026", cgst: 1250000, sgst: 1250000, status: "Paid", due: "2026-03-20" },
  { month: "January 2026", cgst: 980000, sgst: 980000, status: "Paid", due: "2026-02-20" },
  { month: "December 2025", cgst: 1450000, sgst: 1450000, status: "Paid", due: "2026-01-20" },
  { month: "November 2025", cgst: 1120000, sgst: 1120000, status: "Paid", due: "2025-12-20" },
  { month: "October 2025", cgst: 890000, sgst: 890000, status: "Paid", due: "2025-11-20" },
];

const GSTTaxes = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">GST & Taxes</h1>
      <p className="text-sm text-muted-foreground">Monthly GST filing status and tax compliance</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Total GST Paid (FY)</p><p className="text-2xl font-bold text-primary">₹11.38L</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Pending Filing</p><p className="text-2xl font-bold text-warning">1 Month</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Compliance Status</p><p className="text-2xl font-bold text-success">On Track</p></CardContent></Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />GST Filing Status</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Month</TableHead><TableHead>CGST</TableHead><TableHead>SGST</TableHead><TableHead>Total</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {GST_DATA.map(g => (
              <TableRow key={g.month} className="border-border table-row-gold">
                <TableCell className="font-medium">{g.month}</TableCell>
                <TableCell>₹{g.cgst.toLocaleString("en-IN")}</TableCell>
                <TableCell>₹{g.sgst.toLocaleString("en-IN")}</TableCell>
                <TableCell className="font-semibold text-primary">₹{(g.cgst + g.sgst).toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-xs">{g.due}</TableCell>
                <TableCell><Badge variant={g.status === "Paid" ? "default" : "secondary"} className={g.status === "Paid" ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"}>{g.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default GSTTaxes;
