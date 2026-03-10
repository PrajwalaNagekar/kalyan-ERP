import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ScanBarcode, ShoppingCart, Plus, Minus, Trash2, Receipt,
  CreditCard, Banknote, IndianRupee, CheckCircle, Printer, Download
} from "lucide-react";

interface CartItem {
  id: string;
  sku: string;
  name: string;
  karat: number;
  weight: number;
  goldRate: number;
  makingCharge: number;
  gst: number;
  total: number;
}

const POS = () => {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "1", sku: "KJ-NK-001", name: "Temple Necklace Set", karat: 22,
      weight: 45.2, goldRate: 6650, makingCharge: 38000, gst: 9720, total: 348200
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalGST = cart.reduce((sum, item) => sum + item.gst, 0);
  const totalMaking = cart.reduce((sum, item) => sum + item.makingCharge, 0);

  const handleScanBarcode = () => {
    if (!barcode.trim()) return;
    const newItem: CartItem = {
      id: Date.now().toString(), sku: barcode, name: "Gold Chain 22K",
      karat: 22, weight: 15.0, goldRate: 6650, makingCharge: 12000, gst: 3240, total: 114990
    };
    setCart([...cart, newItem]);
    setBarcode("");
    toast({ title: "Product added", description: `${newItem.name} added to cart` });
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleGenerateInvoice = () => {
    if (cart.length === 0) {
      toast({ title: "Cart is empty", description: "Add products before generating invoice.", variant: "destructive" });
      return;
    }
    if (!amountPaid || parseFloat(amountPaid) < cartTotal) {
      toast({ title: "Payment required", description: "Enter payment amount equal to or greater than total.", variant: "destructive" });
      return;
    }
    setShowInvoice(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Point of Sale</h1>
        <p className="text-sm text-muted-foreground mt-1">Process transactions & generate invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scanner + Cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Scanner */}
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Scan barcode or enter SKU..."
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScanBarcode()}
                    className="pl-10 bg-muted border-border"
                  />
                </div>
                <Button onClick={handleScanBarcode} className="gold-gradient text-primary-foreground">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-primary" /> Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Scan a barcode to add products</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="space-y-1">
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku} · {item.karat}K · {item.weight}g
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Gold: ₹{(item.weight * item.goldRate).toLocaleString("en-IN")}</span>
                        <span>Making: ₹{item.makingCharge.toLocaleString("en-IN")}</span>
                        <span>GST: ₹{item.gst.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-primary">₹{item.total.toLocaleString("en-IN")}</p>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary + Payment */}
        <div className="space-y-4">
          <Card className="bg-card border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gold Value</span>
                <span className="text-foreground">₹{(cartTotal - totalGST - totalMaking).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Making Charges</span>
                <span className="text-foreground">₹{totalMaking.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (3%)</span>
                <span className="text-foreground">₹{totalGST.toLocaleString("en-IN")}</span>
              </div>
              <Separator className="bg-border" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-serif">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="split">Split Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Amount Received</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="pl-10 bg-muted border-border"
                  />
                </div>
              </div>
              <Button onClick={handleGenerateInvoice} className="w-full gold-gradient text-primary-foreground font-semibold h-11">
                <Receipt className="w-4 h-4 mr-2" /> Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Success Dialog */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="bg-card border-border max-w-md text-center">
          <div className="py-4 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <DialogTitle className="font-serif text-xl">Invoice Generated!</DialogTitle>
            <DialogDescription>
              Invoice <span className="font-mono text-primary font-semibold">#INV-{Date.now().toString().slice(-6)}</span> has been created successfully.
            </DialogDescription>
            <div className="p-4 rounded-lg bg-muted space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-primary">₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loyalty Points</span>
                <span className="text-success">+{Math.floor(cartTotal / 100)}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline"><Printer className="w-4 h-4 mr-2" /> Print</Button>
              <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download</Button>
              <Button className="gold-gradient text-primary-foreground" onClick={() => { setShowInvoice(false); setCart([]); setAmountPaid(""); }}>
                New Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
