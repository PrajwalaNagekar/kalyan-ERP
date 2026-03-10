import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Shield, Save, Copy, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores/appStore";
import { useAuth } from "@/contexts/AuthContext";

interface RolePermission {
  id: string;
  name: string;
  label: string;
  isCustom: boolean;
  modules: Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean; export: boolean }>;
  limits: { refundLimit: number; expenseLimit: number; discountOverride: number; stockAdjustLimit: number };
}

const MODULES = ["Dashboard", "POS & Billing", "Gold Rate & Pricing", "Central Inventory", "Branch Management", "Karigar / Manufacturer", "App Customers", "Financial Overview", "Staff Management", "Analytics & Reports", "System Settings", "Audit Logs"];
const PERMS = ["view", "create", "edit", "delete", "approve", "export"] as const;

const defaultModulePerms = (all: boolean) =>
  Object.fromEntries(MODULES.map(m => [m, { view: all, create: all, edit: all, delete: all, approve: all, export: all }]));

const INITIAL_ROLES: RolePermission[] = [
  { id: "admin", name: "admin", label: "Admin", isCustom: false, modules: defaultModulePerms(true), limits: { refundLimit: 999999999, expenseLimit: 999999999, discountOverride: 100, stockAdjustLimit: 999999999 } },
  {
    id: "operations", name: "operations", label: "Operations Manager", isCustom: false,
    modules: Object.fromEntries(MODULES.map(m => [m, {
      view: ["Dashboard", "POS & Billing", "Branch Management", "App Customers", "Staff Management"].includes(m),
      create: ["POS & Billing", "App Customers", "Staff Management"].includes(m),
      edit: ["POS & Billing", "App Customers", "Staff Management"].includes(m),
      delete: false,
      approve: ["POS & Billing"].includes(m),
      export: ["Dashboard", "POS & Billing"].includes(m),
    }])),
    limits: { refundLimit: 200000, expenseLimit: 100000, discountOverride: 15, stockAdjustLimit: 500 },
  },
  {
    id: "finance", name: "finance", label: "Finance & Ops Controller", isCustom: false,
    modules: Object.fromEntries(MODULES.map(m => [m, {
      view: ["Dashboard", "POS & Billing", "Central Inventory", "Financial Overview", "Audit Logs"].includes(m),
      create: ["POS & Billing", "Financial Overview"].includes(m),
      edit: ["POS & Billing", "Financial Overview"].includes(m),
      delete: false,
      approve: false,
      export: ["POS & Billing", "Financial Overview", "Audit Logs"].includes(m),
    }])),
    limits: { refundLimit: 50000, expenseLimit: 50000, discountOverride: 5, stockAdjustLimit: 100 },
  },
  {
    id: "goldsmith", name: "goldsmith", label: "Karigar / Manufacturer", isCustom: false,
    modules: Object.fromEntries(MODULES.map(m => [m, {
      view: m === "Karigar / Manufacturer",
      create: m === "Karigar / Manufacturer",
      edit: m === "Karigar / Manufacturer",
      delete: false,
      approve: false,
      export: false,
    }])),
    limits: { refundLimit: 0, expenseLimit: 0, discountOverride: 0, stockAdjustLimit: 0 },
  },
];

const RBACEditor = () => {
  const { toast } = useToast();
  const { addAuditLog } = useAppStore();
  const { profile } = useAuth();
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [showCreate, setShowCreate] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const currentRole = roles.find(r => r.id === selectedRole)!;

  const togglePerm = (module: string, perm: typeof PERMS[number]) => {
    setRoles(prev => prev.map(r =>
      r.id === selectedRole
        ? { ...r, modules: { ...r.modules, [module]: { ...r.modules[module], [perm]: !r.modules[module][perm] } } }
        : r
    ));
  };

  const updateLimit = (key: keyof RolePermission["limits"], value: string) => {
    setRoles(prev => prev.map(r =>
      r.id === selectedRole
        ? { ...r, limits: { ...r.limits, [key]: parseInt(value) || 0 } }
        : r
    ));
  };

  const handleSave = () => {
    addAuditLog({ user: profile?.full_name || "Admin", role: "Admin", branch: "Central", action: `RBAC updated: ${currentRole.label}`, module: "Settings", time: "Just now", before: "Previous permissions", after: "Updated permissions" });
    toast({ title: "Permissions Saved", description: `${currentRole.label} permissions updated.` });
  };

  const handleDuplicate = () => {
    const newId = `${selectedRole}_copy_${Date.now()}`;
    const newRole = { ...currentRole, id: newId, name: newId, label: `${currentRole.label} (Copy)`, isCustom: true };
    setRoles(prev => [...prev, newRole]);
    setSelectedRole(newId);
    toast({ title: "Role Duplicated", description: `${newRole.label} created.` });
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    const id = newRoleName.toLowerCase().replace(/\s+/g, "_");
    const newRole: RolePermission = {
      id, name: id, label: newRoleName, isCustom: true,
      modules: defaultModulePerms(false),
      limits: { refundLimit: 0, expenseLimit: 0, discountOverride: 0, stockAdjustLimit: 0 },
    };
    setRoles(prev => [...prev, newRole]);
    setSelectedRole(id);
    setShowCreate(false);
    setNewRoleName("");
    addAuditLog({ user: profile?.full_name || "Admin", role: "Admin", branch: "Central", action: `New role created: ${newRoleName}`, module: "Settings", time: "Just now", before: "—", after: newRoleName });
    toast({ title: "Role Created", description: `${newRoleName} has been created.` });
  };

  const handleDelete = (id: string) => {
    const role = roles.find(r => r.id === id);
    setRoles(prev => prev.filter(r => r.id !== id));
    if (selectedRole === id) setSelectedRole("admin");
    addAuditLog({ user: profile?.full_name || "Admin", role: "Admin", branch: "Central", action: `Role deleted: ${role?.label}`, module: "Settings", time: "Just now", before: role?.label || "", after: "Deleted" });
    toast({ title: "Role Deleted", description: `${role?.label} has been removed.` });
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Role & Permission Manager</h1>
          <p className="text-sm text-muted-foreground">Granular RBAC control at module and action level</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gold-gradient text-primary-foreground gap-2"><Plus className="w-4 h-4" />New Role</Button>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2">
        {roles.map(r => (
          <Button key={r.id} variant={selectedRole === r.id ? "default" : "outline"} size="sm" onClick={() => setSelectedRole(r.id)} className={selectedRole === r.id ? "gold-gradient text-primary-foreground" : ""}>
            {r.label} {r.isCustom && <Badge variant="outline" className="ml-1 text-[8px]">Custom</Badge>}
          </Button>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-serif flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />{currentRole.label} — Permissions</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleDuplicate} className="gap-1"><Copy className="w-3 h-3" />Duplicate</Button>
              {currentRole.isCustom && (
                <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(currentRole.id)} className="gap-1 text-destructive hover:bg-destructive/10"><Trash2 className="w-3 h-3" />Delete</Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[180px]">Module</TableHead>
                  {PERMS.map(p => <TableHead key={p} className="text-center text-xs uppercase">{p}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {MODULES.map(m => (
                  <TableRow key={m} className="border-border">
                    <TableCell className="font-medium text-sm">{m}</TableCell>
                    {PERMS.map(p => (
                      <TableCell key={p} className="text-center">
                        <Checkbox checked={currentRole.modules[m]?.[p] || false} onCheckedChange={() => togglePerm(m, p)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Limits */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader><CardTitle className="text-base font-serif">Approval Limits — {currentRole.label}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">Refund Limit (₹)</Label><Input type="number" value={currentRole.limits.refundLimit} onChange={e => updateLimit("refundLimit", e.target.value)} className="bg-muted border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Expense Limit (₹)</Label><Input type="number" value={currentRole.limits.expenseLimit} onChange={e => updateLimit("expenseLimit", e.target.value)} className="bg-muted border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Discount Override (%)</Label><Input type="number" value={currentRole.limits.discountOverride} onChange={e => updateLimit("discountOverride", e.target.value)} className="bg-muted border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Stock Adjust Limit (g)</Label><Input type="number" value={currentRole.limits.stockAdjustLimit} onChange={e => updateLimit("stockAdjustLimit", e.target.value)} className="bg-muted border-border" /></div>
          </div>
          <Button onClick={handleSave} className="gold-gradient text-primary-foreground shadow-gold mt-6 gap-2"><Save className="w-4 h-4" />Save Permissions</Button>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle className="font-serif">Create New Role</DialogTitle><DialogDescription>Define a custom role with specific permissions</DialogDescription></DialogHeader>
          <div className="space-y-4"><Label className="text-xs">Role Name</Label><Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Senior Cashier" className="bg-muted border-border" /></div>
          <DialogFooter><Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button><Button className="gold-gradient text-primary-foreground" onClick={handleCreateRole}>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle className="font-serif">Delete Role?</DialogTitle><DialogDescription>This action cannot be undone. All permissions will be removed.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button><Button variant="destructive" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RBACEditor;
