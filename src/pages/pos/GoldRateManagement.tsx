import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

const RATE_HISTORY = [
  { date: "2026-03-03", k24: 7250, k22: 6646, k18: 5438, change: "+0.8%" },
  { date: "2026-03-02", k24: 7192, k22: 6593, k18: 5394, change: "-0.3%" },
  { date: "2026-03-01", k24: 7214, k22: 6613, k18: 5411, change: "+1.2%" },
  { date: "2026-02-28", k24: 7128, k22: 6534, k18: 5346, change: "+0.5%" },
  { date: "2026-02-27", k24: 7093, k22: 6502, k18: 5320, change: "-0.2%" },
  { date: "2026-02-26", k24: 7107, k22: 6515, k18: 5331, change: "+0.9%" },
  { date: "2026-02-25", k24: 7044, k22: 6457, k18: 5284, change: "+0.4%" },
];

const GoldRateManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [rates, setRates] = useState<{ karat: number; rate: number }[]>([]);
  const [newRate24k, setNewRate24k] = useState("");
  const [newRate22k, setNewRate22k] = useState("");
  const [newRate18k, setNewRate18k] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase.from("gold_rates").select("karat, rate_per_gram").order("created_at", { ascending: false });
      if (data) {
        const latest: Record<number, number> = {};
        data.forEach(r => { if (!latest[r.karat]) latest[r.karat] = Number(r.rate_per_gram); });
        setRates(Object.entries(latest).map(([k, v]) => ({ karat: Number(k), rate: v })));
      }
    };
    fetchRates();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    const entries = [
      { karat: 24, rate: parseFloat(newRate24k) },
      { karat: 22, rate: parseFloat(newRate22k) },
      { karat: 18, rate: parseFloat(newRate18k) },
    ].filter(e => !isNaN(e.rate) && e.rate > 0);

    for (const entry of entries) {
      await supabase.from("gold_rates").insert({ rate_per_gram: entry.rate, karat: entry.karat, updated_by: user?.id });
    }
    toast({ title: "Rates Updated", description: `${entries.length} rate(s) updated across all branches.` });
    setLoading(false);
    setNewRate24k(""); setNewRate22k(""); setNewRate18k("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Gold Rate Management</h1>
        <p className="text-sm text-muted-foreground">Centralized rate control — reflects across all POS terminals</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ label: "24K Gold", karat: 24, value: newRate24k, set: setNewRate24k },
          { label: "22K Gold", karat: 22, value: newRate22k, set: setNewRate22k },
          { label: "18K Gold", karat: 18, value: newRate18k, set: setNewRate18k }].map(item => (
          <Card key={item.karat} className="bg-card border-border shadow-card card-premium">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">₹{(rates.find(r => r.karat === item.karat)?.rate || 0).toLocaleString("en-IN")}<span className="text-sm text-muted-foreground">/g</span></p>
              <div className="space-y-1">
                <Label className="text-xs">New Rate (₹/g)</Label>
                <Input type="number" value={item.value} onChange={e => item.set(e.target.value)} placeholder="Enter new rate" className="bg-muted border-border" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={handleUpdate} disabled={loading} className="gold-gradient text-primary-foreground">
        <RefreshCw className="w-4 h-4 mr-2" />{loading ? "Updating..." : "Broadcast Rates to All Branches"}
      </Button>
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Rate History (7 Days)</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-border"><TableHead>Date</TableHead><TableHead>24K</TableHead><TableHead>22K</TableHead><TableHead>18K</TableHead><TableHead>Change</TableHead></TableRow></TableHeader>
            <TableBody>
              {RATE_HISTORY.map(r => {
                const isUp = r.change.startsWith("+");
                return (
                  <TableRow key={r.date} className="border-border table-row-gold">
                    <TableCell className="text-xs font-medium">{r.date}</TableCell>
                    <TableCell className="font-semibold">₹{r.k24.toLocaleString("en-IN")}</TableCell>
                    <TableCell>₹{r.k22.toLocaleString("en-IN")}</TableCell>
                    <TableCell>₹{r.k18.toLocaleString("en-IN")}</TableCell>
                    <TableCell className={`flex items-center gap-1 text-xs font-semibold ${isUp ? "text-success" : "text-destructive"}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{r.change}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoldRateManagement;
