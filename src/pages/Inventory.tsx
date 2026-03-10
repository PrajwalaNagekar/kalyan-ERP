import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Package, Plus, Search, Filter, Download, ArrowUpDown,
  Eye, Edit, ArrowRightLeft, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type ProductStatus = "available" | "reserved" | "sold" | "archived";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  karat: number;
  weight: number;
  huid: string;
  branch: string;
  status: ProductStatus;
  price: number;
}

const dummyProducts: Product[] = [
  { id: "1", sku: "KJ-NK-001", name: "Temple Necklace Set", category: "Necklace", karat: 22, weight: 45.2, huid: "HUID-78291", branch: "Jayanagar", status: "available", price: 325000 },
  { id: "2", sku: "KJ-BG-002", name: "Antique Gold Bangles (4pc)", category: "Bangles", karat: 22, weight: 32.8, huid: "HUID-65423", branch: "Rajajinagar", status: "available", price: 236000 },
  { id: "3", sku: "KJ-RG-003", name: "Diamond Solitaire Ring", category: "Ring", karat: 18, weight: 5.4, huid: "HUID-91034", branch: "Marathahalli", status: "reserved", price: 185000 },
  { id: "4", sku: "KJ-ER-004", name: "Jhumka Earrings Gold", category: "Earrings", karat: 22, weight: 12.6, huid: "HUID-44782", branch: "Whitefield", status: "sold", price: 92000 },
  { id: "5", sku: "KJ-NK-005", name: "Choker Necklace Diamond", category: "Necklace", karat: 18, weight: 28.3, huid: "HUID-33901", branch: "Koramangala", status: "available", price: 410000 },
  { id: "6", sku: "KJ-CH-006", name: "Gold Chain 24K", category: "Chain", karat: 24, weight: 15.0, huid: "HUID-55612", branch: "Jayanagar", status: "available", price: 112000 },
  { id: "7", sku: "KJ-BG-007", name: "Kada Bangle Pair", category: "Bangles", karat: 22, weight: 52.1, huid: "HUID-78834", branch: "Marathahalli", status: "archived", price: 378000 },
  { id: "8", sku: "KJ-RG-008", name: "Men's Gold Ring", category: "Ring", karat: 22, weight: 8.2, huid: "HUID-22156", branch: "Rajajinagar", status: "available", price: 58000 },
];

const statusColors: Record<ProductStatus, string> = {
  available: "bg-success/20 text-success border-success/30",
  reserved: "bg-warning/20 text-warning border-warning/30",
  sold: "bg-destructive/20 text-destructive border-destructive/30",
  archived: "bg-muted text-muted-foreground border-border",
};

const Inventory = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = dummyProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.huid.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExportCSV = () => {
    const csv = [
      ["SKU", "Name", "Category", "Karat", "Weight(g)", "HUID", "Branch", "Status", "Price"].join(","),
      ...filteredProducts.map((p) =>
        [p.sku, p.name, p.category, p.karat, p.weight, p.huid, p.branch, p.status, p.price].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
    toast({ title: "Exported!", description: "Inventory data exported as CSV." });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage products across all branches</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)} className="gold-gradient text-primary-foreground font-medium">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: "1,248", icon: Package },
          { label: "Available", value: "892" },
          { label: "Reserved", value: "124" },
          { label: "Total Value", value: "₹18.4 Cr" },
        ].map((s) => (
          <Card key={s.label} className="bg-card border-border shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or HUID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-muted border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">SKU</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Karat</TableHead>
                <TableHead className="text-muted-foreground">Weight</TableHead>
                <TableHead className="text-muted-foreground">HUID</TableHead>
                <TableHead className="text-muted-foreground">Branch</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-xs text-primary">{product.sku}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{product.karat}K</TableCell>
                  <TableCell className="text-sm">{product.weight}g</TableCell>
                  <TableCell className="font-mono text-xs">{product.huid}</TableCell>
                  <TableCell className="text-sm">{product.branch}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] uppercase ${statusColors[product.status]}`}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">₹{product.price.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {product.status !== "sold" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {product.status === "available" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => { setSelectedProduct(product); setShowTransfer(true); }}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {filteredProducts.length} of {dummyProducts.length} products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm text-muted-foreground">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Add New Product</DialogTitle>
            <DialogDescription>Fill in all required fields to add a new product to inventory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input placeholder="e.g., Gold Necklace" className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="necklace">Necklace</SelectItem>
                    <SelectItem value="bangles">Bangles</SelectItem>
                    <SelectItem value="ring">Ring</SelectItem>
                    <SelectItem value="earrings">Earrings</SelectItem>
                    <SelectItem value="chain">Chain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Karat *</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24K</SelectItem>
                    <SelectItem value="22">22K</SelectItem>
                    <SelectItem value="18">18K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Weight (g) *</Label>
                <Input type="number" placeholder="0.0" min="0.1" step="0.1" className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label>HUID *</Label>
                <Input placeholder="Unique HUID" className="bg-muted border-border" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Branch *</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jayanagar">Jayanagar</SelectItem>
                    <SelectItem value="rajajinagar">Rajajinagar</SelectItem>
                    <SelectItem value="marathahalli">Marathahalli</SelectItem>
                    <SelectItem value="whitefield">Whitefield</SelectItem>
                    <SelectItem value="koramangala">Koramangala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Making Charge (%)</Label>
                <Input type="number" placeholder="12" className="bg-muted border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Image *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddProduct(false)}>Cancel</Button>
            <Button variant="secondary" onClick={() => toast({ title: "Saved!", description: "Product saved. You can continue adding." })}>
              Save & Continue
            </Button>
            <Button className="gold-gradient text-primary-foreground" onClick={() => { setShowAddProduct(false); toast({ title: "Product Added!", description: "SKU and barcode auto-generated." }); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Stock Transfer</DialogTitle>
            <DialogDescription>Transfer {selectedProduct?.name} to another branch.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Source Branch</p>
              <p className="text-sm font-medium text-foreground">{selectedProduct?.branch}</p>
            </div>
            <div className="space-y-2">
              <Label>Destination Branch *</Label>
              <Select>
                <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jayanagar">Jayanagar</SelectItem>
                  <SelectItem value="rajajinagar">Rajajinagar</SelectItem>
                  <SelectItem value="marathahalli">Marathahalli</SelectItem>
                  <SelectItem value="whitefield">Whitefield</SelectItem>
                  <SelectItem value="koramangala">Koramangala</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransfer(false)}>Cancel</Button>
            <Button className="gold-gradient text-primary-foreground" onClick={() => { setShowTransfer(false); toast({ title: "Transfer Initiated!", description: "Transfer ID generated. Destination branch notified." }); }}>
              Confirm Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
