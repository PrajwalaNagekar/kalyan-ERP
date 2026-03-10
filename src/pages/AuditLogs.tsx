import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, Download, Search, Filter } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

const AuditLogs = () => {
  const { auditLogs } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const modules = [...new Set(auditLogs.map(l => l.module))];
  const roles = [...new Set(auditLogs.map(l => l.role))];

  const filtered = auditLogs.filter(e => {
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.user.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterModule !== "all" && e.module !== filterModule) return false;
    if (filterRole !== "all" && e.role !== filterRole) return false;
    return true;
  });

  const handleExport = () => {
    const csv = ["User,Role,Branch,Action,Module,Before,After,Time,IP"]
      .concat(filtered.map(e => `${e.user},${e.role},${e.branch},"${e.action}",${e.module},"${e.before}","${e.after}",${e.time},${e.ip}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit_logs.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSearch className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-serif font-bold text-foreground">Audit Center</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by user or action..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
        </div>
        <Select value={filterModule} onValueChange={setFilterModule}>
          <SelectTrigger className="w-[160px] bg-card border-border"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[160px] bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-serif flex items-center justify-between">
            <span>Activity Log ({filtered.length} entries)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase">
                  <th className="pb-2 pr-3">User</th>
                  <th className="pb-2 pr-3">Role</th>
                  <th className="pb-2 pr-3">Branch</th>
                  <th className="pb-2 pr-3">Action</th>
                  <th className="pb-2 pr-3">Module</th>
                  <th className="pb-2 pr-3">Before</th>
                  <th className="pb-2 pr-3">After</th>
                  <th className="pb-2 pr-3">IP</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                    <td className="py-3 pr-3 font-medium text-foreground">{e.user}</td>
                    <td className="py-3 pr-3"><Badge variant="outline" className="text-[10px]">{e.role}</Badge></td>
                    <td className="py-3 pr-3 text-muted-foreground text-xs">{e.branch}</td>
                    <td className="py-3 pr-3 text-foreground text-xs">{e.action}</td>
                    <td className="py-3 pr-3"><Badge variant="secondary" className="text-[10px]">{e.module}</Badge></td>
                    <td className="py-3 pr-3 text-destructive text-xs font-mono">{e.before}</td>
                    <td className="py-3 pr-3 text-emerald-600 text-xs font-mono">{e.after}</td>
                    <td className="py-3 pr-3 text-muted-foreground text-[10px] font-mono">{e.ip}</td>
                    <td className="py-3 text-muted-foreground text-xs">{e.time}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-8 text-center text-muted-foreground">No audit entries match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
