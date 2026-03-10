import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Percent, CalendarDays } from "lucide-react";

const SCHEMES = [
  { id: "SCH-001", name: "11-Month Gold Plan", activeCustomers: 421, totalCollected: "₹1.85 Cr", status: "Active" },
  { id: "SCH-002", name: "Wedding Season Advance", activeCustomers: 89, totalCollected: "₹42L", status: "Active" },
];

const OFFERS = [
  { id: "OFF-001", title: "Akshaya Tritiya Pre-book", discount: "Flat 5% Off Making", validTill: "2026-04-14", status: "Active", redemptions: 156 },
  { id: "OFF-002", title: "Wedding Season Special", discount: "Zero Wastage on Diamonds", validTill: "2026-06-30", status: "Scheduled", redemptions: 0 },
  { id: "OFF-003", title: "Silver Making Discount", discount: "Extra 2% Off Silver Making", validTill: "2026-03-31", status: "Active", redemptions: 89 },
];

const SchemeOfferHandling = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Scheme & Offer Handling</h1>
      <p className="text-sm text-muted-foreground">EMI collection, promo codes, and scheme management</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SCHEMES.map(s => (
        <Card key={s.id} className="bg-card border-border shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /><span className="font-serif font-semibold">{s.name}</span></div>
              <Badge className="bg-success/20 text-success border-success/30">{s.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-muted-foreground">Active Customers</p><p className="text-lg font-bold">{s.activeCustomers}</p></div>
              <div><p className="text-xs text-muted-foreground">Total Collected</p><p className="text-lg font-bold text-primary">{s.totalCollected}</p></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Percent className="w-4 h-4 text-primary" />Active Offers</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Discount</TableHead><TableHead>Valid Till</TableHead><TableHead>Redemptions</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {OFFERS.map(o => (
              <TableRow key={o.id} className="border-border">
                <TableCell className="font-mono text-xs text-primary">{o.id}</TableCell>
                <TableCell className="font-medium">{o.title}</TableCell>
                <TableCell className="text-xs">{o.discount}</TableCell>
                <TableCell className="flex items-center gap-1 text-xs"><CalendarDays className="w-3 h-3" />{o.validTill}</TableCell>
                <TableCell>{o.redemptions}</TableCell>
                <TableCell><Badge variant={o.status === "Active" ? "default" : "secondary"} className={o.status === "Active" ? "bg-success/20 text-success border-success/30" : ""}>{o.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default SchemeOfferHandling;
