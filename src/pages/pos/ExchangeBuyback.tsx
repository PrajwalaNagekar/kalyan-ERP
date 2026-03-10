import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ArrowRightLeft, Scale, Search, ShieldAlert, CheckCircle, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/contexts/AuthContext";

const RATE_PER_GRAM_22K = 7260;

const EXCHANGE_LOG = [
  { id: "EXC-101", customer: "Priya Sharma", oldItem: "22K Bangle (18g)", purity: "21.8K", grossWt: 18, stoneWt: 0.5, wearTear: 5, creditValue: 118800, newItem: "22K Necklace", date: "2026-03-01", status: "Completed" },
  { id: "EXC-102", customer: "Vikram Singh", oldItem: "24K Coin (10g)", purity: "23.9K", grossWt: 10, stoneWt: 0, wearTear: 2, creditValue: 73500, newItem: "Pending Selection", date: "2026-03-02", status: "In Progress" },
  { id: "EXC-103", customer: "Meera Nair", oldItem: "22K Chain (25g)", purity: "21.5K", grossWt: 25, stoneWt: 1.2, wearTear: 8, creditValue: 155000, newItem: "22K Necklace Set", date: "2026-03-03", status: "Completed" },
];

const BUYBACK_LOG = [
  { id: "BUY-201", customer: "Ravi Teja", item: "22K Bangle", weight: 15, purity: "21.8K", deduction: 3, value: 85000, status: "Pending Approval", date: "2026-03-04" },
  { id: "BUY-202", customer: "Anita Desai", item: "24K Coin", weight: 10, purity: "23.9K", deduction: 2, value: 71000, status: "Approved", date: "2026-03-03" },
];

const ExchangeBuyback = () => {
  const { toast } = useToast();
  const { toggles, addAuditLog, addApproval } = useAppStore();
  const { profile, roleGroup } = useAuth();

  // Exchange form
  const [customerSearch, setCustomerSearch] = useState("");
  const [metalType, setMetalType] = useState("22K Gold");
  const [grossWeight, setGrossWeight] = useState("");
  const [stoneWeight, setStoneWeight] = useState("");
  const [purity, setPurity] = useState("");
  const [wearTear, setWearTear] = useState("");
  const [exchangeResult, setExchangeResult] = useState<{ netWeight: number; value: number } | null>(null);

  // Buyback form
  const [buybackCustomer, setBuybackCustomer] = useState("");
  const [buybackItem, setBuybackItem] = useState("");
  const [buybackWeight, setBuybackWeight] = useState("");
  const [buybackPurity, setBuybackPurity] = useState("");
  const [buybackDeduction, setBuybackDeduction] = useState("");
  const [buybackValue, setBuybackValue] = useState<number | null>(null);
  const [showBuybackApproval, setShowBuybackApproval] = useState(false);

  const [activeTab, setActiveTab] = useState<"exchange" | "buyback">("exchange");

  if (!toggles.enableExchange && !toggles.enableBuyback) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="bg-card border-border max-w-md"><CardContent className="p-8 text-center">
          <Ban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-serif font-bold text-foreground mb-2">Feature Disabled by Admin</h2>
          <p className="text-sm text-muted-foreground">Exchange & Buyback features have been disabled. Contact your administrator to enable them.</p>
        </CardContent></Card>
      </div>
    );
  }

  const handleCalculateExchange = () => {
    const gw = parseFloat(grossWeight);
    const sw = parseFloat(stoneWeight) || 0;
    const p = parseFloat(purity);
    const wt = parseFloat(wearTear) || 0;
    if (!gw || !p || !customerSearch) {
      toast({ title: "Missing Fields", description: "Please fill customer, weight, and purity.", variant: "destructive" });
      return;
    }
    if (wt < 0 || wt > 100) {
      toast({ title: "Invalid Deduction", description: "Wear & tear must be 0-100%.", variant: "destructive" });
      return;
    }
    const netWeight = (gw - sw) * (1 - wt / 100);
    const purityFactor = p / 24;
    const value = Math.round(netWeight * RATE_PER_GRAM_22K * purityFactor);
    setExchangeResult({ netWeight: Math.round(netWeight * 100) / 100, value });
    addAuditLog({ user: profile?.full_name || "User", role: roleGroup || "operations", branch: "Jayanagar", action: `Exchange calculated for ${customerSearch}`, module: "POS", time: "Just now", before: `${gw}g gross`, after: `₹${value.toLocaleString("en-IN")} credit` });
    toast({ title: "Exchange Value Calculated", description: `Net weight: ${netWeight.toFixed(2)}g → Credit: ₹${value.toLocaleString("en-IN")}` });
  };

  const handleApplyExchange = () => {
    toast({ title: "Exchange Applied", description: "Exchange credit applied to new purchase invoice." });
    setExchangeResult(null);
    setCustomerSearch("");
    setGrossWeight("");
    setStoneWeight("");
    setPurity("");
    setWearTear("");
  };

  const handleCalculateBuyback = () => {
    const w = parseFloat(buybackWeight);
    const p = parseFloat(buybackPurity);
    const d = parseFloat(buybackDeduction) || 0;
    if (!w || !p || !buybackCustomer) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const purityFactor = p / 24;
    const value = Math.round(w * RATE_PER_GRAM_22K * purityFactor * (1 - d / 100));
    setBuybackValue(value);
  };

  const handleBuybackSubmit = () => {
    if (!buybackValue) return;
    if (buybackValue > 50000) {
      addApproval({
        type: "buyback",
        requestedBy: profile?.full_name || "User",
        requestedByRole: roleGroup || "operations",
        branch: "Jayanagar",
        value: `₹${buybackValue.toLocaleString("en-IN")}`,
        reason: `Buyback: ${buybackItem} from ${buybackCustomer}`,
        status: "pending",
        approverRole: "admin",
      });
      setShowBuybackApproval(true);
    } else {
      addAuditLog({ user: profile?.full_name || "User", role: roleGroup || "operations", branch: "Jayanagar", action: `Buyback processed for ${buybackCustomer}`, module: "POS", time: "Just now", before: `${buybackWeight}g ${buybackItem}`, after: `₹${buybackValue.toLocaleString("en-IN")} paid` });
      toast({ title: "Buyback Processed", description: `₹${buybackValue.toLocaleString("en-IN")} credited to customer.` });
      setBuybackCustomer(""); setBuybackItem(""); setBuybackWeight(""); setBuybackPurity(""); setBuybackDeduction(""); setBuybackValue(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Exchange & Buyback</h1>
        <p className="text-sm text-muted-foreground">Old gold evaluation, purity testing, exchange credits, and buyback processing</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {toggles.enableExchange && (
          <Button variant={activeTab === "exchange" ? "default" : "outline"} onClick={() => setActiveTab("exchange")} className={activeTab === "exchange" ? "gold-gradient text-primary-foreground" : ""}>
            <ArrowRightLeft className="w-4 h-4 mr-2" />Exchange
          </Button>
        )}
        {toggles.enableBuyback && (
          <Button variant={activeTab === "buyback" ? "default" : "outline"} onClick={() => setActiveTab("buyback")} className={activeTab === "buyback" ? "gold-gradient text-primary-foreground" : ""}>
            <Scale className="w-4 h-4 mr-2" />Buyback
          </Button>
        )}
      </div>

      {/* Exchange Tab */}
      {activeTab === "exchange" && toggles.enableExchange && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Scale className="w-4 h-4 text-primary" />New Exchange Evaluation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Search Customer</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Customer name or phone..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="pl-10 bg-muted border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Metal Type</Label>
                <Input value={metalType} onChange={e => setMetalType(e.target.value)} className="bg-muted border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">Gross Weight (g)</Label><Input type="number" placeholder="e.g. 18.5" value={grossWeight} onChange={e => setGrossWeight(e.target.value)} className="bg-muted border-border" /></div>
                <div className="space-y-2"><Label className="text-xs">Stone Weight (g)</Label><Input type="number" placeholder="e.g. 0.5" value={stoneWeight} onChange={e => setStoneWeight(e.target.value)} className="bg-muted border-border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label className="text-xs">Tested Purity (K)</Label><Input type="number" placeholder="e.g. 21.8" value={purity} onChange={e => setPurity(e.target.value)} className="bg-muted border-border" /></div>
                <div className="space-y-2"><Label className="text-xs">Wear & Tear (%)</Label><Input type="number" placeholder="e.g. 5" value={wearTear} onChange={e => setWearTear(e.target.value)} className="bg-muted border-border" /></div>
              </div>
              {exchangeResult && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">Net Weight: {exchangeResult.netWeight}g</p>
                  <p className="text-2xl font-bold text-primary">₹{exchangeResult.value.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-muted-foreground">Exchange Credit Value</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={handleCalculateExchange}>Validate & Calculate</Button>
                {exchangeResult && <Button className="flex-1 gold-gradient text-primary-foreground" onClick={handleApplyExchange}>Apply Exchange</Button>}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif">Recent Exchanges</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Credit</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {EXCHANGE_LOG.map(e => (
                    <TableRow key={e.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{e.id}</TableCell>
                      <TableCell className="text-sm">{e.customer}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.oldItem}</TableCell>
                      <TableCell className="font-semibold">₹{e.creditValue.toLocaleString("en-IN")}</TableCell>
                      <TableCell><Badge variant={e.status === "Completed" ? "default" : "secondary"} className={e.status === "Completed" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" : ""}>{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Buyback Tab */}
      {activeTab === "buyback" && toggles.enableBuyback && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Scale className="w-4 h-4 text-primary" />Buyback Evaluation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label className="text-xs">Customer Name</Label><Input placeholder="Enter customer name" value={buybackCustomer} onChange={e => setBuybackCustomer(e.target.value)} className="bg-muted border-border" /></div>
              <div className="space-y-2"><Label className="text-xs">Item Description</Label><Input placeholder="e.g. 22K Bangle" value={buybackItem} onChange={e => setBuybackItem(e.target.value)} className="bg-muted border-border" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2"><Label className="text-xs">Weight (g)</Label><Input type="number" value={buybackWeight} onChange={e => setBuybackWeight(e.target.value)} className="bg-muted border-border" /></div>
                <div className="space-y-2"><Label className="text-xs">Purity (K)</Label><Input type="number" value={buybackPurity} onChange={e => setBuybackPurity(e.target.value)} className="bg-muted border-border" /></div>
                <div className="space-y-2"><Label className="text-xs">Deduction (%)</Label><Input type="number" value={buybackDeduction} onChange={e => setBuybackDeduction(e.target.value)} className="bg-muted border-border" /></div>
              </div>
              {buybackValue !== null && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <p className="text-xs text-muted-foreground">Buyback Value</p>
                  <p className="text-2xl font-bold text-primary">₹{buybackValue.toLocaleString("en-IN")}</p>
                  {buybackValue > 50000 && <p className="text-[10px] text-warning mt-1">⚠ Requires manager approval (above ₹50,000 threshold)</p>}
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" onClick={handleCalculateBuyback}>Calculate Value</Button>
                {buybackValue !== null && <Button className="flex-1 gold-gradient text-primary-foreground" onClick={handleBuybackSubmit}>{buybackValue > 50000 ? "Submit for Approval" : "Process Buyback"}</Button>}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif">Recent Buybacks</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Customer</TableHead><TableHead>Weight</TableHead><TableHead>Value</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {BUYBACK_LOG.map(b => (
                    <TableRow key={b.id} className="border-border">
                      <TableCell className="font-mono text-xs text-primary">{b.id}</TableCell>
                      <TableCell className="text-sm">{b.customer}</TableCell>
                      <TableCell className="text-xs">{b.weight}g</TableCell>
                      <TableCell className="font-semibold">₹{b.value.toLocaleString("en-IN")}</TableCell>
                      <TableCell><Badge variant={b.status === "Approved" ? "default" : "secondary"} className={b.status === "Approved" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" : "bg-warning/20 text-warning border-warning/30"}>{b.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Buyback Approval Dialog */}
      <Dialog open={showBuybackApproval} onOpenChange={setShowBuybackApproval}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-warning" /><DialogTitle className="font-serif">Approval Required</DialogTitle></div>
            <DialogDescription>Buyback value exceeds ₹50,000 threshold. This request has been sent to Admin for approval.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setShowBuybackApproval(false); setBuybackValue(null); setBuybackCustomer(""); setBuybackItem(""); setBuybackWeight(""); setBuybackPurity(""); setBuybackDeduction(""); toast({ title: "Submitted for Approval", description: "Buyback request sent to manager." }); }} className="gold-gradient text-primary-foreground">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExchangeBuyback;
