import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, Building2, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface GoldRate {
  id: string; karat: number; rate_per_gram: number; created_at: string;
}
interface AuditLog {
  id: string; user_id: string | null; action: string; module: string; created_at: string; ip_address: string | null; details: any;
}
interface Branch {
  id: string; name: string; code: string; city: string; is_active: boolean;
}

const PAGE_SIZE = 8;

const SettingsPage = () => {
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditPage, setAuditPage] = useState(1);

  useEffect(() => {
    supabase.from("gold_rates").select("*").order("created_at", { ascending: false }).limit(20).then(({ data }) => {
      if (data) setGoldRates(data);
    });
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => {
      if (data) setAuditLogs(data);
    });
    supabase.from("branches").select("id, name, code, city, is_active").order("name").then(({ data }) => {
      if (data) setBranches(data);
    });
  }, []);

  const latestRates = (() => {
    const map = new Map<number, GoldRate>();
    goldRates.forEach(r => { if (!map.has(r.karat)) map.set(r.karat, r); });
    return [24, 22, 18].map(k => map.get(k)).filter(Boolean) as GoldRate[];
  })();

  const filteredAudit = auditLogs.filter(l =>
    l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.module.toLowerCase().includes(auditSearch.toLowerCase())
  );
  const auditTotalPages = Math.ceil(filteredAudit.length / PAGE_SIZE);
  const pagedAudit = filteredAudit.slice((auditPage - 1) * PAGE_SIZE, auditPage * PAGE_SIZE);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System configuration and audit trail</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="gold-rates">Gold Rates</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif">Company Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Company Name", "Malabar Gold & Diamonds"],
                  ["Headquarters", "Bangalore, Karnataka"],
                  ["Active Branches", `${branches.filter(b => b.is_active).length}`],
                  ["GST Number", "29AABCK1234F1Z5"],
                  ["Financial Year", "2025-2026"],
                  ["Currency", "INR (₹)"],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gold Rates Tab */}
        <TabsContent value="gold-rates">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {latestRates.map(r => (
                <Card key={r.karat} className="bg-card border-border shadow-card">
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{r.karat}K Gold</p>
                    <p className="text-2xl font-bold text-primary mt-1">₹{Number(r.rate_per_gram).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground mt-1">per gram · Updated {format(new Date(r.created_at), "dd MMM yyyy, HH:mm")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-card border-border shadow-card">
              <CardHeader><CardTitle className="text-base font-serif">Rate History</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Karat</TableHead>
                      <TableHead>Rate (₹/g)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goldRates.map(r => (
                      <TableRow key={r.id}>
                        <TableCell><Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">{r.karat}K</Badge></TableCell>
                        <TableCell className="font-medium">₹{Number(r.rate_per_gram).toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{format(new Date(r.created_at), "dd MMM yyyy, HH:mm")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches">
          <Card className="bg-card border-border shadow-card">
            <CardHeader><CardTitle className="text-base font-serif">Branch List</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" />{b.name}</TableCell>
                      <TableCell className="font-mono text-xs text-primary">{b.code}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{b.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={b.is_active ? "bg-success/20 text-success border-success/30 text-[10px]" : "bg-destructive/20 text-destructive text-[10px]"}>
                          {b.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card className="bg-card border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-serif">Audit Trail</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={auditSearch} onChange={e => { setAuditSearch(e.target.value); setAuditPage(1); }} placeholder="Search logs..." className="pl-9 bg-muted border-border h-8 text-xs" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedAudit.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(l.created_at), "dd MMM yyyy, HH:mm:ss")}</TableCell>
                      <TableCell className="text-sm">{l.action}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{l.module}</Badge></TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{l.ip_address || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {pagedAudit.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No audit logs found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              {auditTotalPages > 1 && (
                <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                  <p className="text-xs text-muted-foreground">Showing {(auditPage - 1) * PAGE_SIZE + 1}-{Math.min(auditPage * PAGE_SIZE, filteredAudit.length)} of {filteredAudit.length}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={auditPage === 1} onClick={() => setAuditPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                    <span className="text-xs text-muted-foreground px-2">Page {auditPage} of {auditTotalPages}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={auditPage === auditTotalPages} onClick={() => setAuditPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Password Policy</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Minimum Length", "8 characters"],
                  ["Require Uppercase", "Yes"],
                  ["Require Numbers", "Yes"],
                  ["Require Special Characters", "Yes"],
                  ["Password Expiry", "90 days"],
                  ["Max Failed Attempts", "5"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-card">
              <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Session Settings</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Session Timeout", "30 minutes"],
                  ["Remember Me Duration", "7 days"],
                  ["Concurrent Sessions", "1 per user"],
                  ["Two-Factor Auth", "Optional"],
                  ["IP Whitelisting", "Disabled"],
                  ["Login Notifications", "Email"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
