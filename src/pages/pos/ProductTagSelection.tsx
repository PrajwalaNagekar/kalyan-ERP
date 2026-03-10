import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Tag, Printer, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PRODUCT_IMAGES: Record<string, string> = {
  SKU001: "https://images.unsplash.com/photo-1515562141589-67f0d934d51a?w=60&h=60&fit=crop",
  SKU002: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=60&h=60&fit=crop",
  SKU003: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=60&h=60&fit=crop",
  SKU004: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=60&h=60&fit=crop",
  SKU005: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=60&h=60&fit=crop",
};

const INITIAL_PRODUCTS = [
  { sku: "SKU001", name: "Antique Gold Necklace", rfid: "RFID-8821", barcode: "8901234567890", category: "Necklace", weight: 45.5, status: "Tagged" },
  { sku: "SKU002", name: "Diamond Studded Bangle", rfid: "RFID-8822", barcode: "8901234567891", category: "Bangle", weight: 20.0, status: "Tagged" },
  { sku: "SKU003", name: "Bridal Choker Set", rfid: "", barcode: "8901234567892", category: "Necklace", weight: 85.2, status: "Pending" },
  { sku: "SKU004", name: "Men's Gold Chain", rfid: "RFID-8824", barcode: "8901234567893", category: "Chain", weight: 15.0, status: "Tagged" },
  { sku: "SKU005", name: "Temple Design Jhumka", rfid: "", barcode: "", category: "Earrings", weight: 12.5, status: "Untagged" },
];

const ProductTagSelection = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const { toast } = useToast();
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const handlePrintTags = () => {
    const tagged = products.filter(p => p.status === "Tagged");
    toast({ title: "Print Job Sent", description: `${tagged.length} tag(s) sent to printer.` });
  };

  const handleAssign = (sku: string) => {
    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, status: "Tagged", rfid: p.rfid || `RFID-${Math.floor(Math.random() * 9000 + 1000)}`, barcode: p.barcode || `890123456${Math.floor(Math.random() * 9000 + 1000)}` } : p));
    toast({ title: "Tag Assigned", description: `RFID/Barcode assigned to ${sku}` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Product & Tag Selection</h1>
          <p className="text-sm text-muted-foreground">RFID and barcode tag management</p>
        </div>
        <Button className="gold-gradient text-primary-foreground" onClick={handlePrintTags}><Printer className="w-4 h-4 mr-2" />Print Tags</Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead>Weight</TableHead><TableHead>RFID</TableHead><TableHead>Barcode</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.sku} className="border-border">
                <TableCell>
                  {PRODUCT_IMAGES[p.sku] ? (
                    <img src={PRODUCT_IMAGES[p.sku]} alt={p.name} className="w-9 h-9 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-primary">{p.sku}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.weight}g</TableCell>
                <TableCell className="font-mono text-xs">{p.rfid || "—"}</TableCell>
                <TableCell className="font-mono text-xs">{p.barcode || "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.status === "Tagged" ? "default" : p.status === "Pending" ? "secondary" : "outline"} className={p.status === "Tagged" ? "bg-success/20 text-success border-success/30" : ""}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => handleAssign(p.sku)} disabled={p.status === "Tagged"}>
                    <Tag className="w-3 h-3 mr-1" />Assign
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ProductTagSelection;
