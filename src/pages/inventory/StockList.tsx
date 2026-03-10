import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PRODUCT_IMAGES: Record<string, string> = {
  SKU001: "https://images.unsplash.com/photo-1515562141589-67f0d934d51a?w=60&h=60&fit=crop",
  SKU002: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=60&h=60&fit=crop",
  SKU003: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=60&h=60&fit=crop",
  SKU004: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=60&h=60&fit=crop",
  SKU005: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=60&h=60&fit=crop",
  SKU009: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=60&h=60&fit=crop",
  SKU012: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=60&h=60&fit=crop",
};

const INVENTORY = [
  { sku: "SKU001", name: "Antique Gold Necklace", category: "Necklace", weight: 45.5, purity: "22K", stock: 12, branch: "Indiranagar", value: 330375 },
  { sku: "SKU002", name: "Diamond Studded Bangle", category: "Bangle", weight: 20.0, purity: "18K", stock: 5, branch: "Koramangala", value: 112400 },
  { sku: "SKU003", name: "Bridal Choker Set", category: "Necklace", weight: 85.2, purity: "22K", stock: 2, branch: "Jayanagar", value: 618200 },
  { sku: "SKU004", name: "Men's Gold Chain", category: "Chain", weight: 15.0, purity: "22K", stock: 18, branch: "Indiranagar", value: 108900 },
  { sku: "SKU005", name: "Temple Design Jhumka", category: "Earrings", weight: 12.5, purity: "22K", stock: 8, branch: "Malleshwaram", value: 90750 },
  { sku: "SKU006", name: "Navaratna Ring", category: "Ring", weight: 8.2, purity: "18K", stock: 15, branch: "Malleshwaram", value: 46084 },
  { sku: "SKU007", name: "Platinum Couple Bands", category: "Ring", weight: 14.0, purity: "950Pt", stock: 4, branch: "Whitefield", value: 145000 },
  { sku: "SKU008", name: "Rose Gold Bracelet", category: "Bracelet", weight: 22.4, purity: "18K", stock: 7, branch: "Whitefield", value: 125888 },
  { sku: "SKU009", name: "Gold Mangalsutra", category: "Mangalsutra", weight: 32.0, purity: "22K", stock: 10, branch: "T. Nagar", value: 232320 },
  { sku: "SKU010", name: "Diamond Nose Pin", category: "Nose Pin", weight: 1.5, purity: "18K", stock: 25, branch: "Andheri West", value: 18500 },
  { sku: "SKU011", name: "Gold Toe Ring Set", category: "Toe Ring", weight: 4.0, purity: "22K", stock: 30, branch: "Jayanagar", value: 29040 },
  { sku: "SKU012", name: "Bridal Waist Chain", category: "Waist Chain", weight: 65.0, purity: "22K", stock: 3, branch: "Indiranagar", value: 471900 },
];

const StockList = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const filtered = INVENTORY.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));
  const totalValue = filtered.reduce((s, i) => s + i.value * i.stock, 0);

  const handleCSV = () => {
    const header = "SKU,Product,Category,Weight,Purity,Stock,Branch,Value";
    const rows = filtered.map(i => `${i.sku},${i.name},${i.category},${i.weight},${i.purity},${i.stock},${i.branch},${i.value}`);
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "stock-list.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV Exported", description: `${filtered.length} item(s) downloaded.` });
  };

  const handlePDF = () => {
    toast({ title: "PDF Export", description: `Generating PDF for ${filtered.length} items — feature coming soon.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Stock List</h1>
          <p className="text-sm text-muted-foreground">Central inventory — Total Value: <span className="text-primary font-semibold">₹{(totalValue / 10000000).toFixed(2)} Cr</span></p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCSV} className="gold-gradient text-primary-foreground">
            <Download className="w-4 h-4 mr-1" />CSV
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{filtered.length}</Badge>
          </Button>
          <Button onClick={handlePDF} variant="outline">
            <FileText className="w-4 h-4 mr-1" />PDF
          </Button>
        </div>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search SKU or product..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader><TableRow className="border-border"><TableHead className="w-[50px]"></TableHead><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Weight</TableHead><TableHead>Purity</TableHead><TableHead>Stock</TableHead><TableHead>Branch</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(i => (
                  <TableRow key={i.sku} className="border-border hover:bg-muted/30">
                    <TableCell>
                      {PRODUCT_IMAGES[i.sku] ? (
                        <img src={PRODUCT_IMAGES[i.sku]} alt={i.name} className="w-9 h-9 rounded-md object-cover border border-border" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-primary">{i.sku}</TableCell>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-xs">{i.category}</TableCell>
                    <TableCell>{i.weight}g</TableCell>
                    <TableCell><Badge variant="outline" className="border-primary text-primary">{i.purity}</Badge></TableCell>
                    <TableCell className={i.stock < 5 ? "text-destructive font-bold" : ""}>{i.stock}</TableCell>
                    <TableCell className="text-xs">{i.branch}</TableCell>
                    <TableCell className="text-right font-semibold">₹{i.value.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StockList;
