import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Weight, Gem, Diamond } from "lucide-react";

const BRANCHES = ["T. Nagar Chennai", "Anna Nagar Chennai", "Velachery Chennai", "Whitefield Bangalore", "Jayanagar Bangalore", "Jubilee Hills Hyderabad", "Thrissur Kerala", "Calicut Kerala", "Banjara Hills Hyderabad", "MG Road Pune"];

const INVENTORY = [
  { huid: "HUID-78234", name: "Antique Gold Necklace", category: "Necklace", weight: 45.5, purity: "22K", status: "Available", branch: "T. Nagar Chennai" },
  { huid: "HUID-78235", name: "Diamond Studded Bangle", category: "Bangle", weight: 20.0, purity: "18K", status: "Reserved", branch: "T. Nagar Chennai" },
  { huid: "HUID-78236", name: "Bridal Choker Set", category: "Necklace", weight: 85.2, purity: "22K", status: "Available", branch: "T. Nagar Chennai" },
  { huid: "HUID-78237", name: "Temple Jhumka Pair", category: "Earrings", weight: 12.5, purity: "22K", status: "Sold", branch: "T. Nagar Chennai" },
  { huid: "HUID-78238", name: "Men's Gold Chain", category: "Chain", weight: 15.0, purity: "22K", status: "Available", branch: "Anna Nagar Chennai" },
  { huid: "HUID-78239", name: "Mangalsutra 22K", category: "Necklace", weight: 18.0, purity: "22K", status: "Available", branch: "Anna Nagar Chennai" },
  { huid: "HUID-78240", name: "Gold Nose Pin", category: "Nose Pin", weight: 1.2, purity: "22K", status: "Available", branch: "Whitefield Bangalore" },
  { huid: "HUID-78241", name: "Diamond Solitaire Ring", category: "Ring", weight: 6.8, purity: "18K", status: "Reserved", branch: "Whitefield Bangalore" },
  { huid: "HUID-78242", name: "Silver Pooja Thali", category: "Pooja", weight: 250.0, purity: "925S", status: "Available", branch: "Thrissur Kerala" },
  { huid: "HUID-78243", name: "Gold Waist Chain", category: "Waist Chain", weight: 35.0, purity: "22K", status: "Available", branch: "Jubilee Hills Hyderabad" },
];

const statusColor = (s: string) => s === "Available" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : s === "Reserved" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-muted text-muted-foreground border-border";

const BranchInventory = () => {
  const [branch, setBranch] = useState("all");
  const filtered = branch === "all" ? INVENTORY : INVENTORY.filter(i => i.branch === branch);
  const goldWeight = filtered.filter(i => i.purity.includes("K")).reduce((s, i) => s + i.weight, 0);
  const silverWeight = filtered.filter(i => i.purity === "925S").reduce((s, i) => s + i.weight, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Branch Inventory</h1>
          <p className="text-sm text-muted-foreground">Branch-specific stock levels and filters</p>
        </div>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-64 bg-card border-border"><SelectValue placeholder="All Branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: filtered.length, icon: Package, color: "text-primary" },
          { label: "Gold Weight", value: `${goldWeight.toFixed(1)}g`, icon: Weight, color: "text-amber-500" },
          { label: "Silver Weight", value: `${silverWeight.toFixed(1)}g`, icon: Gem, color: "text-slate-400" },
          { label: "Diamond Pieces", value: filtered.filter(i => i.category === "Ring" || i.name.includes("Diamond")).length, icon: Diamond, color: "text-sky-400" },
        ].map(k => (
          <Card key={k.label} className="bg-card border-border shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="w-5 h-5" /></div>
              <div><p className="text-xs text-muted-foreground">{k.label}</p><p className="text-lg font-bold">{k.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>HUID</TableHead><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Weight</TableHead><TableHead>Purity</TableHead><TableHead>Status</TableHead><TableHead>Branch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(i => (
              <TableRow key={i.huid} className="border-border hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-primary">{i.huid}</TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell>{i.weight}g</TableCell>
                <TableCell><Badge variant="outline" className="border-primary text-primary">{i.purity}</Badge></TableCell>
                <TableCell><Badge className={statusColor(i.status)}>{i.status}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.branch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default BranchInventory;
