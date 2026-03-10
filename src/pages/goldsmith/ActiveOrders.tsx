import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Hammer, Clock, Upload, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PRODUCT_IMAGES: Record<string, string> = {
  "ORD-901": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&h=80&fit=crop",
  "ORD-902": "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=80&h=80&fit=crop",
  "ORD-903": "https://images.unsplash.com/photo-1515562141589-67f0d934d51a?w=80&h=80&fit=crop",
  "ORD-904": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=80&h=80&fit=crop",
  "ORD-905": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=80&h=80&fit=crop",
  "ORD-906": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=80&h=80&fit=crop",
};

interface Order {
  id: string;
  customer: string;
  design: string;
  status: string;
  due: string;
  goldReceived: number;
  goldUsed: number;
  scrap: number;
  karigar: string;
  expectedCompletion: string;
}

const INITIAL_ORDERS: Order[] = [
  { id: "ORD-901", customer: "Priya Sharma", design: "Custom Temple Ring", status: "In Work", due: "2026-03-10", goldReceived: 12.5, goldUsed: 10.2, scrap: 1.8, karigar: "Ramesh Jewelers", expectedCompletion: "2026-03-09" },
  { id: "ORD-902", customer: "Rahul Verma", design: "Platinum Band Replica", status: "Assigned", due: "2026-03-12", goldReceived: 8.0, goldUsed: 0, scrap: 0, karigar: "Srikar Designs", expectedCompletion: "2026-03-11" },
  { id: "ORD-903", customer: "Anita Desai", design: "Heritage Necklace Set", status: "QC", due: "2026-03-15", goldReceived: 45.0, goldUsed: 42.3, scrap: 2.1, karigar: "Artisan Gold Works", expectedCompletion: "2026-03-14" },
  { id: "ORD-904", customer: "Vikram Singh", design: "Custom Engagement Ring", status: "Ready", due: "2026-03-08", goldReceived: 6.0, goldUsed: 5.2, scrap: 0.5, karigar: "Ramesh Jewelers", expectedCompletion: "2026-03-07" },
  { id: "ORD-905", customer: "Meera Nair", design: "Antique Bangles (Set of 4)", status: "In Work", due: "2026-03-18", goldReceived: 32.0, goldUsed: 28.5, scrap: 2.8, karigar: "Srikar Designs", expectedCompletion: "2026-03-17" },
  { id: "ORD-906", customer: "Deepa Menon", design: "Kundan Bridal Set", status: "QC", due: "2026-03-20", goldReceived: 58.0, goldUsed: 55.1, scrap: 2.2, karigar: "Artisan Gold Works", expectedCompletion: "2026-03-19" },
];

const STAGES = ["Assigned", "In Work", "QC", "Ready", "Delivered"];

const stageProgress = (status: string) => {
  const idx = STAGES.indexOf(status);
  return idx >= 0 ? Math.round(((idx + 1) / STAGES.length) * 100) : 0;
};

const stageColor = (s: string) =>
  s === "Ready" || s === "Delivered" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" :
  s === "QC" ? "bg-blue-500/20 text-blue-600 border-blue-500/30" :
  s === "Assigned" ? "bg-purple-500/20 text-purple-600 border-purple-500/30" :
  s === "In Work" ? "bg-orange-500/20 text-orange-600 border-orange-500/30" :
  "";

const ActiveOrders = () => {
  const { roleGroup } = useAuth();
  const isKarigar = roleGroup === "goldsmith";
  const { toast } = useToast();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [showProductionEntry, setShowProductionEntry] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [goldUsedInput, setGoldUsedInput] = useState("");
  const [scrapInput, setScrapInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [goldError, setGoldError] = useState("");

  const stageCounts = STAGES.map(s => ({ name: s, count: orders.filter(o => o.status === s).length }));

  const openProductionEntry = (order: Order) => {
    setSelectedOrder(order);
    setGoldUsedInput(String(order.goldUsed));
    setScrapInput(String(order.scrap));
    setStatusInput(order.status);
    setGoldError("");
    setShowProductionEntry(true);
  };

  const handleSaveProduction = () => {
    if (!selectedOrder) return;
    const used = parseFloat(goldUsedInput);
    const scrap = parseFloat(scrapInput);
    if (isNaN(used) || isNaN(scrap)) {
      toast({ title: "Invalid Input", description: "Please enter valid numbers.", variant: "destructive" });
      return;
    }
    if (used > selectedOrder.goldReceived) {
      setGoldError(`Gold used (${used}g) cannot exceed gold issued (${selectedOrder.goldReceived}g)`);
      return;
    }
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, goldUsed: used, scrap, status: statusInput } : o));
    setShowProductionEntry(false);
    toast({ title: "Production Updated", description: `Order ${selectedOrder.id} updated successfully.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          {isKarigar ? "My Production Orders" : "Active Karigar Orders"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isKarigar ? "Track your assigned orders and update production stages" : "Custom order status tracking and karigar assignments"}
        </p>
      </div>

      {/* Production Stage Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stageCounts.map((s) => (
          <Card key={s.name} className="bg-card border-border shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.count}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{s.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Hammer className="w-4 h-4 text-primary" />Order Queue</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Order</TableHead>
                <TableHead>Design</TableHead>
                <TableHead>Ref Image</TableHead>
                {!isKarigar && <TableHead>Karigar</TableHead>}
                <TableHead>Progress</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Gold Issued (g)</TableHead>
                <TableHead>Gold Used (g)</TableHead>
                <TableHead>Scrap (g)</TableHead>
                <TableHead>Stage</TableHead>
                {isKarigar && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{o.id}</TableCell>
                  <TableCell className="text-sm font-medium">{o.design}</TableCell>
                  <TableCell>
                    {PRODUCT_IMAGES[o.id] ? (
                      <img src={PRODUCT_IMAGES[o.id]} alt={o.design} className="w-10 h-10 rounded-md object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                    )}
                  </TableCell>
                  {!isKarigar && <TableCell className="text-xs">{o.karigar}</TableCell>}
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={stageProgress(o.status)} className="h-1.5 flex-1" />
                      <span className="text-[10px] text-muted-foreground">{stageProgress(o.status)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{o.due}</TableCell>
                  <TableCell className="text-sm font-medium">{o.goldReceived}</TableCell>
                  <TableCell className="text-sm">{o.goldUsed}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.scrap}</TableCell>
                  <TableCell><Badge variant="secondary" className={stageColor(o.status)}>{o.status}</Badge></TableCell>
                  {isKarigar && (
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openProductionEntry(o)} disabled={o.status === "Ready" || o.status === "Delivered"}>
                        <Upload className="w-3 h-3 mr-1" />Update
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Production Entry Dialog */}
      <Dialog open={showProductionEntry} onOpenChange={setShowProductionEntry}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">Production Entry — {selectedOrder?.id}</DialogTitle>
            <DialogDescription>{selectedOrder?.design}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              {PRODUCT_IMAGES[selectedOrder.id] && (
                <div className="flex justify-center">
                  <img src={PRODUCT_IMAGES[selectedOrder.id]} alt="Reference" className="w-24 h-24 rounded-lg object-cover border border-border" />
                </div>
              )}
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">Gold Issued</p>
                <p className="text-lg font-bold text-foreground">{selectedOrder.goldReceived}g</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Gold Used (g)</Label>
                  <Input type="number" value={goldUsedInput} onChange={e => { setGoldUsedInput(e.target.value); setGoldError(""); }} className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Scrap Generated (g)</Label>
                  <Input type="number" value={scrapInput} onChange={e => setScrapInput(e.target.value)} className="bg-muted/50 border-border" />
                </div>
              </div>
              {goldError && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {goldError}
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Work Status</Label>
                <Select value={statusInput} onValueChange={setStatusInput}>
                  <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assigned">Assigned</SelectItem>
                    <SelectItem value="In Work">In Work</SelectItem>
                    <SelectItem value="QC" disabled={isKarigar}>QC (Admin/Ops only)</SelectItem>
                    <SelectItem value="Ready" disabled={isKarigar}>Ready (Admin/Ops only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductionEntry(false)}>Cancel</Button>
            <Button className="gold-gradient text-primary-foreground" onClick={handleSaveProduction}>Save Production Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveOrders;
