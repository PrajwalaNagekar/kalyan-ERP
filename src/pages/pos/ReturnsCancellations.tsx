import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApprovalModal } from "@/components/ApprovalModal";

const RETURNS = [
  { id: "RET-201", invoice: "INV-8815", customer: "Ravi Teja", item: "Men's Gold Chain", amount: 108900, reason: "Size mismatch", date: "2026-03-01", status: "Refunded" },
  { id: "RET-202", invoice: "INV-8810", customer: "Walk-in", item: "Rose Gold Bracelet", amount: 112400, reason: "Quality concern", date: "2026-02-28", status: "Under Review" },
];

const REFUND_THRESHOLD = 50000;

const ReturnsCancellations = () => {
  const { roleGroup } = useAuth();
  const [search, setSearch] = useState("");
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);

  const handleProcessRefund = (id: string, amount: number) => {
    if (roleGroup === "finance" && amount > REFUND_THRESHOLD) {
      setSelectedReturn(id);
      setApprovalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Returns & Cancellations</h1>
        <p className="text-sm text-muted-foreground">Invoice lookup and refund processing</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by invoice or customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><RotateCcw className="w-4 h-4 text-primary" />Return Log</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {RETURNS.map(r => (
                <TableRow key={r.id} className="border-border">
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-mono text-xs">{r.invoice}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell className="text-sm">{r.item}</TableCell>
                  <TableCell className="font-semibold">₹{r.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                  <TableCell><Badge variant={r.status === "Refunded" ? "default" : "secondary"} className={r.status === "Refunded" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" : ""}>{r.status}</Badge></TableCell>
                  <TableCell>
                    {r.status !== "Refunded" && roleGroup === "finance" && (
                      <Button size="sm" variant="outline" onClick={() => handleProcessRefund(r.id, r.amount)} className="text-xs">
                        Process Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ApprovalModal
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
        title="High-Value Refund Approval"
        description={`Refund amount exceeds ₹${REFUND_THRESHOLD.toLocaleString("en-IN")} threshold. This action requires approval from an Admin or Operations Manager.`}
      />
    </div>
  );
};

export default ReturnsCancellations;
