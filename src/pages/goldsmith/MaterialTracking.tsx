import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

const MATERIALS = [
  { id: "MAT-001", goldsmith: "Ramesh Jewelers", type: "Raw Gold (24K)", weightGiven: 100, yieldExpected: 98.5, due: "2026-03-05", status: "Processing" },
  { id: "MAT-002", goldsmith: "Srikar Designs", type: "Silver Bars", weightGiven: 500, yieldExpected: 490, due: "2026-03-04", status: "Pending" },
  { id: "MAT-003", goldsmith: "Artisan Gold Works", type: "Raw Gold (22K)", weightGiven: 50, yieldExpected: 49.2, due: "2026-03-07", status: "Completed" },
  { id: "MAT-004", goldsmith: "Ramesh Jewelers", type: "Platinum Wire", weightGiven: 25, yieldExpected: 24.5, due: "2026-03-09", status: "Processing" },
  { id: "MAT-005", goldsmith: "Srikar Designs", type: "Raw Gold (24K)", weightGiven: 200, yieldExpected: 197, due: "2026-03-10", status: "Pending" },
  { id: "MAT-006", goldsmith: "Artisan Gold Works", type: "Raw Gold (22K)", weightGiven: 80, yieldExpected: 78.8, due: "2026-03-06", status: "Completed" },
];

const MaterialTracking = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Material Tracking</h1>
      <p className="text-sm text-muted-foreground">Raw material yield tracking and karigar accountability</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-primary">455g</p><p className="text-xs text-muted-foreground mt-1">Total Gold Issued</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-success">98.4%</p><p className="text-xs text-muted-foreground mt-1">Avg Yield Rate</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-warning">2</p><p className="text-xs text-muted-foreground mt-1">Pending Returns</p></CardContent></Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Scale className="w-4 h-4 text-primary" />Material Log</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Karigar</TableHead><TableHead>Material</TableHead><TableHead>Given (g)</TableHead><TableHead>Expected Yield (g)</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {MATERIALS.map(m => (
              <TableRow key={m.id} className="border-border table-row-gold">
                <TableCell className="font-mono text-xs text-primary">{m.id}</TableCell>
                <TableCell className="font-medium">{m.goldsmith}</TableCell>
                <TableCell className="text-sm">{m.type}</TableCell>
                <TableCell>{m.weightGiven}g</TableCell>
                <TableCell>{m.yieldExpected}g <span className="text-xs text-muted-foreground">({((m.yieldExpected / m.weightGiven) * 100).toFixed(1)}%)</span></TableCell>
                <TableCell className="text-xs">{m.due}</TableCell>
                <TableCell><Badge variant={m.status === "Completed" ? "default" : "secondary"} className={m.status === "Completed" ? "bg-success/20 text-success border-success/30" : ""}>{m.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default MaterialTracking;
