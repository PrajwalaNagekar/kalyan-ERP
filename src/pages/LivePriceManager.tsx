import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MetalType = "gold" | "platinum" | "silver" | "palladium";

const METAL_VARIANTS: Record<MetalType, { label: string; key: string }[]> = {
  gold: [
    { label: "24K Gold", key: "24K" },
    { label: "22K Gold", key: "22K" },
    { label: "18K Gold", key: "18K" },
  ],
  platinum: [
    { label: "950 Platinum", key: "950Pt" },
    { label: "900 Platinum", key: "900Pt" },
  ],
  silver: [
    { label: "999 Silver", key: "999Ag" },
    { label: "925 Sterling", key: "925Ag" },
  ],
  palladium: [
    { label: "950 Palladium", key: "950Pd" },
  ],
};

const STATIC_RATES: Record<string, number> = {
  "950Pt": 3150, "900Pt": 2980,
  "999Ag": 92, "925Ag": 78,
  "950Pd": 3450,
};

const HISTORY_DATA: Record<MetalType, { date: string; variant: string; rate: number; change: number }[]> = {
  gold: [
    { date: "03 Mar 2026", variant: "24K", rate: 7260, change: 1.2 },
    { date: "03 Mar 2026", variant: "22K", rate: 6650, change: 0.9 },
    { date: "03 Mar 2026", variant: "18K", rate: 5440, change: 0.7 },
    { date: "02 Mar 2026", variant: "24K", rate: 7174, change: -0.3 },
    { date: "02 Mar 2026", variant: "22K", rate: 6591, change: -0.5 },
    { date: "02 Mar 2026", variant: "18K", rate: 5402, change: -0.2 },
    { date: "01 Mar 2026", variant: "24K", rate: 7196, change: 0.8 },
    { date: "01 Mar 2026", variant: "22K", rate: 6624, change: 0.6 },
    { date: "01 Mar 2026", variant: "18K", rate: 5413, change: 0.4 },
    { date: "28 Feb 2026", variant: "24K", rate: 7139, change: 1.1 },
    { date: "28 Feb 2026", variant: "22K", rate: 6585, change: 0.9 },
  ],
  platinum: [
    { date: "03 Mar 2026", variant: "950Pt", rate: 3150, change: 0.5 },
    { date: "03 Mar 2026", variant: "900Pt", rate: 2980, change: 0.3 },
    { date: "02 Mar 2026", variant: "950Pt", rate: 3134, change: -0.8 },
    { date: "02 Mar 2026", variant: "900Pt", rate: 2971, change: -0.6 },
    { date: "01 Mar 2026", variant: "950Pt", rate: 3159, change: 1.2 },
    { date: "01 Mar 2026", variant: "900Pt", rate: 2989, change: 0.9 },
  ],
  silver: [
    { date: "03 Mar 2026", variant: "999Ag", rate: 92, change: 2.1 },
    { date: "03 Mar 2026", variant: "925Ag", rate: 78, change: 1.8 },
    { date: "02 Mar 2026", variant: "999Ag", rate: 90, change: -1.1 },
    { date: "02 Mar 2026", variant: "925Ag", rate: 77, change: -0.7 },
    { date: "01 Mar 2026", variant: "999Ag", rate: 91, change: 0.5 },
    { date: "01 Mar 2026", variant: "925Ag", rate: 77, change: 0.3 },
  ],
  palladium: [
    { date: "03 Mar 2026", variant: "950Pd", rate: 3450, change: 0.9 },
    { date: "02 Mar 2026", variant: "950Pd", rate: 3419, change: -0.4 },
    { date: "01 Mar 2026", variant: "950Pd", rate: 3433, change: 1.5 },
  ],
};

const LivePriceManager = () => {
  const { roleGroup } = useAuth();
  const [metal, setMetal] = useState<MetalType>("gold");
  const [goldRates, setGoldRates] = useState<Record<number, number>>({});

  useEffect(() => {
    supabase.from("gold_rates").select("karat, rate_per_gram").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        const latest: Record<number, number> = {};
        data.forEach(r => { if (!latest[r.karat]) latest[r.karat] = Number(r.rate_per_gram); });
        setGoldRates(latest);
      }
    });
  }, []);

  const getRate = (key: string) => {
    if (metal === "gold") {
      const k = parseInt(key);
      return goldRates[k] || 0;
    }
    return STATIC_RATES[key] || 0;
  };

  const variants = METAL_VARIANTS[metal];
  const history = HISTORY_DATA[metal];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Live Price Manager</h1>
        <p className="text-sm text-muted-foreground">
          {roleGroup === "admin" ? "Centralized rate broadcast — reflects across all POS terminals and mobile app" : "Current metal rates (read-only)"}
        </p>
      </div>

      <Tabs value={metal} onValueChange={(v) => setMetal(v as MetalType)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="gold">Gold</TabsTrigger>
          <TabsTrigger value="platinum">Platinum</TabsTrigger>
          <TabsTrigger value="silver">Silver</TabsTrigger>
          <TabsTrigger value="palladium">Palladium</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {variants.map(v => {
          const rate = getRate(v.key);
          return (
            <Card key={v.key} className="bg-card border-border shadow-card hover:shadow-royal transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-serif font-semibold text-muted-foreground">{v.label}</span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xl sm:text-3xl font-bold text-foreground">₹{rate.toLocaleString("en-IN")}<span className="text-xs sm:text-sm text-muted-foreground">/g</span></p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-serif">Rate History — {metal.charAt(0).toUpperCase() + metal.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Date</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead className="text-right">Rate (₹/g)</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h, i) => (
                    <TableRow key={i} className="border-border hover:bg-muted/30">
                      <TableCell className="text-xs text-muted-foreground">{h.date}</TableCell>
                      <TableCell><Badge variant="outline" className="border-primary text-primary">{h.variant}</Badge></TableCell>
                      <TableCell className="text-right font-semibold">₹{h.rate.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${h.change > 0 ? "text-emerald-500" : h.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          {h.change > 0 ? <TrendingUp className="w-3 h-3" /> : h.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          {h.change > 0 ? "+" : ""}{h.change}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePriceManager;
