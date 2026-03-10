import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, FlaskConical } from "lucide-react";

const HALLMARK = [
  { id: "HM-881", sku: "SKU001", item: "Antique Gold Necklace", center: "BIS Center #42", status: "Passed", date: "2026-03-01" },
  { id: "HM-882", sku: "SKU005", item: "Temple Design Jhumka", center: "BIS Center #42", status: "In Progress", date: "2026-03-02" },
  { id: "HM-883", sku: "SKU003", item: "Bridal Choker Set", center: "BIS Center #18", status: "Passed", date: "2026-02-28" },
  { id: "HM-884", sku: "SKU009", item: "Gold Mangalsutra", center: "BIS Center #42", status: "Passed", date: "2026-03-01" },
  { id: "HM-885", sku: "SKU012", item: "Bridal Waist Chain", center: "BIS Center #18", status: "In Progress", date: "2026-03-03" },
  { id: "HM-886", sku: "SKU004", item: "Men's Gold Chain", center: "BIS Center #42", status: "Passed", date: "2026-02-27" },
  { id: "HM-887", sku: "SKU011", item: "Gold Toe Ring Set", center: "BIS Center #18", status: "Failed", date: "2026-03-02" },
];

const PURITY_TESTS = [
  { id: "PT-301", sku: "SKU001", item: "Antique Gold Necklace", declared: "22K (91.6%)", tested: "91.4%", result: "Pass", variance: "-0.2%" },
  { id: "PT-302", sku: "SKU004", item: "Men's Gold Chain", declared: "22K (91.6%)", tested: "91.7%", result: "Pass", variance: "+0.1%" },
  { id: "PT-303", sku: "SKU002", item: "Diamond Studded Bangle", declared: "18K (75.0%)", tested: "74.8%", result: "Pass", variance: "-0.2%" },
  { id: "PT-304", sku: "SKU011", item: "Gold Toe Ring Set", declared: "22K (91.6%)", tested: "89.2%", result: "Fail", variance: "-2.4%" },
];

const QualityHallmark = () => (
  <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-serif font-bold text-foreground">Quality & Hallmark</h1><p className="text-sm text-muted-foreground">BIS hallmark tracking, quality assurance, and purity testing</p></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-success">5</p><p className="text-xs text-muted-foreground mt-1">Passed</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-warning">2</p><p className="text-xs text-muted-foreground mt-1">In Progress</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-destructive">1</p><p className="text-xs text-muted-foreground mt-1">Failed</p></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 text-center"><p className="text-2xl font-bold text-primary">98.5%</p><p className="text-xs text-muted-foreground mt-1">Pass Rate</p></CardContent></Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-primary" />Hallmark Status</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[600px]">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>SKU</TableHead><TableHead>Item</TableHead><TableHead>Center</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {HALLMARK.map(h => (
              <TableRow key={h.id} className="border-border table-row-gold">
                <TableCell className="font-mono text-xs text-primary">{h.id}</TableCell>
                <TableCell className="font-mono text-xs">{h.sku}</TableCell>
                <TableCell className="font-medium">{h.item}</TableCell>
                <TableCell className="text-xs">{h.center}</TableCell>
                <TableCell className="text-xs">{h.date}</TableCell>
                <TableCell><Badge className={h.status === "Passed" ? "bg-success/20 text-success border-success/30" : h.status === "Failed" ? "bg-destructive/20 text-destructive border-destructive/30" : ""}>{h.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><FlaskConical className="w-4 h-4 text-primary" />Purity Test Results</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[700px]">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>Test ID</TableHead><TableHead>SKU</TableHead><TableHead>Item</TableHead><TableHead>Declared</TableHead><TableHead>Tested</TableHead><TableHead>Variance</TableHead><TableHead>Result</TableHead></TableRow></TableHeader>
          <TableBody>
            {PURITY_TESTS.map(p => (
              <TableRow key={p.id} className="border-border table-row-gold">
                <TableCell className="font-mono text-xs text-primary">{p.id}</TableCell>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell className="font-medium">{p.item}</TableCell>
                <TableCell className="text-xs">{p.declared}</TableCell>
                <TableCell className="text-xs font-semibold">{p.tested}</TableCell>
                <TableCell className={`text-xs font-semibold ${p.result === "Fail" ? "text-destructive" : "text-success"}`}>{p.variance}</TableCell>
                <TableCell><Badge className={p.result === "Pass" ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30"}>{p.result}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default QualityHallmark;
