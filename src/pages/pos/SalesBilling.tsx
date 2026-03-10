import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, ShoppingCart, Plus, Minus, CreditCard, Banknote, Smartphone, Printer } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PRODUCTS = [
  { sku: "SKU001", name: "Antique Gold Necklace", category: "Necklace", weight: 45.5, purity: "22K", price: 330375, making: 15000 },
  { sku: "SKU002", name: "Diamond Studded Bangle", category: "Bangle", weight: 20.0, purity: "18K", price: 112400, making: 8500 },
  { sku: "SKU003", name: "Bridal Choker Set", category: "Necklace", weight: 85.2, purity: "22K", price: 618200, making: 25000 },
  { sku: "SKU004", name: "Men's Gold Chain", category: "Chain", weight: 15.0, purity: "22K", price: 108900, making: 5000 },
  { sku: "SKU005", name: "Temple Design Jhumka", category: "Earrings", weight: 12.5, purity: "22K", price: 90750, making: 6000 },
  { sku: "SKU009", name: "Diamond Solitaire Ring", category: "Ring", weight: 6.8, purity: "18K", price: 245000, making: 12000 },
  { sku: "SKU010", name: "Gold Anklet Pair", category: "Anklet", weight: 18.0, purity: "22K", price: 130680, making: 4500 },
  { sku: "SKU011", name: "Silver Pooja Thali Set", category: "Pooja", weight: 250.0, purity: "925S", price: 23000, making: 3500 },
];

interface CartItem {
  sku: string;
  name: string;
  weight: number;
  price: number;
  making: number;
  qty: number;
}

const SalesBilling = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.sku === product.sku);
      if (existing) return prev.map(i => i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { sku: product.sku, name: product.name, weight: product.weight, price: product.price, making: product.making, qty: 1 }];
    });
  };

  const updateQty = (sku: string, delta: number) => {
    setCart(prev => prev.map(i => i.sku === sku ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const handleGenerateInvoice = () => {
    if (!paymentMethod) {
      toast({ title: "Select Payment Method", description: "Please select Cash, Card, or UPI before generating invoice.", variant: "destructive" });
      return;
    }
    const invoiceId = `INV-${Date.now().toString().slice(-4)}`;
    toast({ title: "Invoice Generated", description: `${invoiceId} — ₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })} via ${paymentMethod}` });
    setCart([]);
    setPaymentMethod(null);
  };

  const subtotal = cart.reduce((s, i) => s + (i.price + i.making) * i.qty, 0);
  const gst = subtotal * 0.03;
  const total = subtotal + gst;
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Sales Billing</h1>
        <p className="text-sm text-muted-foreground">POS Terminal — Create invoices and process sales</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by SKU or product name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
            </div>
            <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
              <DialogTrigger asChild>
                <Button className="gold-gradient text-primary-foreground"><Plus className="w-4 h-4 mr-1" />New Product</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Custom Product</DialogTitle></DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const item: CartItem = {
                    sku: `CUST-${Date.now().toString().slice(-4)}`,
                    name: fd.get("name") as string,
                    weight: Number(fd.get("weight")),
                    price: Number(fd.get("price")),
                    making: Number(fd.get("making")),
                    qty: 1,
                  };
                  setCart(prev => [...prev, item]);
                  setNewProductOpen(false);
                  toast({ title: "Product Added", description: `${item.name} added to cart.` });
                }} className="space-y-4">
                  <div><Label>Product Name</Label><Input name="name" required /></div>
                  <div><Label>Weight (grams)</Label><Input name="weight" type="number" step="0.1" required /></div>
                  <div><Label>Price (₹)</Label><Input name="price" type="number" required /></div>
                  <div><Label>Making Charge (₹)</Label><Input name="making" type="number" required /></div>
                  <Button type="submit" className="w-full gold-gradient text-primary-foreground">Add to Cart</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Card className="bg-card border-border shadow-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead>Weight</TableHead><TableHead>Purity</TableHead><TableHead className="text-right">Price</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.sku} className="border-border hover:bg-muted/30">
                    <TableCell className="font-mono text-xs text-primary">{p.sku}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.weight}g</TableCell>
                    <TableCell><Badge variant="outline" className="border-primary text-primary">{p.purity}</Badge></TableCell>
                    <TableCell className="text-right">₹{p.price.toLocaleString("en-IN")}</TableCell>
                    <TableCell><Button size="sm" onClick={() => addToCart(p)} className="gold-gradient text-primary-foreground"><Plus className="w-3 h-3" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="bg-card border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-primary" />Cart ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No items in cart</p>}
              {cart.map(item => (
                <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{((item.price + item.making) * item.qty).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => updateQty(item.sku, -1)} className="h-6 w-6"><Minus className="w-3 h-3" /></Button>
                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                    <Button size="icon" variant="ghost" onClick={() => updateQty(item.sku, 1)} className="h-6 w-6"><Plus className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
              {cart.length > 0 && (
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (3%)</span><span>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></div>
                  <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-primary">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <Button variant={paymentMethod === "Cash" ? "default" : "outline"} className="text-xs" onClick={() => setPaymentMethod("Cash")}><Banknote className="w-3 h-3 mr-1" />Cash</Button>
                    <Button variant={paymentMethod === "Card" ? "default" : "outline"} className="text-xs" onClick={() => setPaymentMethod("Card")}><CreditCard className="w-3 h-3 mr-1" />Card</Button>
                    <Button variant={paymentMethod === "UPI" ? "default" : "outline"} className="text-xs" onClick={() => setPaymentMethod("UPI")}><Smartphone className="w-3 h-3 mr-1" />UPI</Button>
                  </div>
                  <Button className="w-full gold-gradient text-primary-foreground mt-2" onClick={handleGenerateInvoice}><Printer className="w-4 h-4 mr-2" />Generate Invoice</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesBilling;
