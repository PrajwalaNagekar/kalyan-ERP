import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, MapPin, Phone, Plus, Pencil, Users, IndianRupee, ToggleLeft, ToggleRight } from "lucide-react";

interface Branch {
  id: string; name: string; code: string; address: string | null; phone: string | null;
  is_active: boolean; city: string;
}

const DUMMY_STATS: Record<string, { staff: number; revenue: string }> = {
  "Jayanagar": { staff: 28, revenue: "₹45L" },
  "Rajajinagar": { staff: 24, revenue: "₹38L" },
  "Marathahalli": { staff: 32, revenue: "₹52L" },
  "Whitefield": { staff: 26, revenue: "₹41L" },
  "Koramangala": { staff: 22, revenue: "₹36L" },
};

const emptyForm = { name: "", code: "", city: "Bangalore", address: "", phone: "" };

const Branches = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmToggle, setConfirmToggle] = useState<Branch | null>(null);

  const fetchBranches = () => {
    supabase.from("branches").select("*").order("name").then(({ data }) => {
      if (data) setBranches(data);
    });
  };

  useEffect(() => { fetchBranches(); }, []);

  const resetForm = () => setForm(emptyForm);

  const handleAdd = async () => {
    if (!form.name || !form.code) {
      toast({ title: "Validation error", description: "Name and code are required.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("branches").insert({
      name: form.name, code: form.code, city: form.city || "Bangalore",
      address: form.address || null, phone: form.phone || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("audit_logs").insert({ user_id: user?.id, action: `Branch "${form.name}" added`, module: "Branches" });
    setShowAdd(false); resetForm(); fetchBranches();
    toast({ title: "Branch added", description: `${form.name} has been created.` });
  };

  const handleEdit = async () => {
    if (!editingBranch || !form.name || !form.code) return;
    const { error } = await supabase.from("branches").update({
      name: form.name, code: form.code, city: form.city,
      address: form.address || null, phone: form.phone || null,
    }).eq("id", editingBranch.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.from("audit_logs").insert({ user_id: user?.id, action: `Branch "${form.name}" updated`, module: "Branches" });
    setEditingBranch(null); resetForm(); fetchBranches();
    toast({ title: "Branch updated", description: "Changes saved successfully." });
  };

  const handleToggleStatus = async () => {
    if (!confirmToggle) return;
    const newStatus = !confirmToggle.is_active;
    await supabase.from("branches").update({ is_active: newStatus }).eq("id", confirmToggle.id);
    await supabase.from("audit_logs").insert({
      user_id: user?.id,
      action: `Branch "${confirmToggle.name}" ${newStatus ? "activated" : "deactivated"}`,
      module: "Branches",
    });
    setConfirmToggle(null); fetchBranches();
    toast({ title: newStatus ? "Branch activated" : "Branch deactivated" });
  };

  const openEdit = (b: Branch) => {
    setForm({ name: b.name, code: b.code, city: b.city, address: b.address || "", phone: b.phone || "" });
    setEditingBranch(b);
  };

  const branchDialog = (isEdit: boolean) => (
    <Dialog open={isEdit ? !!editingBranch : showAdd} onOpenChange={isEdit ? () => { setEditingBranch(null); resetForm(); } : setShowAdd}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? "Edit Branch" : "Add New Branch"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update branch details." : "Enter details for the new branch."}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Branch Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-muted border-border" placeholder="e.g., Indiranagar" />
            </div>
            <div className="space-y-2">
              <Label>Branch Code *</Label>
              <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="bg-muted border-border" placeholder="e.g., KJ-BLR-06" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="bg-muted border-border" placeholder="Bangalore" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="bg-muted border-border" placeholder="Full address" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-muted border-border" placeholder="+91 80 1234 5678" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { isEdit ? setEditingBranch(null) : setShowAdd(false); resetForm(); }}>Cancel</Button>
          <Button onClick={isEdit ? handleEdit : handleAdd} className="gold-gradient text-primary-foreground">{isEdit ? "Save Changes" : "Add Branch"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Branch Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all Malabar Gold & Diamonds branches</p>
        </div>
        <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gold-gradient text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(branch => {
          const stats = DUMMY_STATS[branch.name] || { staff: 0, revenue: "—" };
          return (
            <Card key={branch.id} className="bg-card border-border shadow-card hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-serif">{branch.name}</CardTitle>
                      <p className="text-xs font-mono text-primary">{branch.code}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={branch.is_active ? "bg-success/20 text-success border-success/30 text-[10px]" : "bg-destructive/20 text-destructive text-[10px]"}>
                    {branch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {branch.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                )}
                {branch.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                )}
                {/* Stats row */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{stats.staff} staff</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{stats.revenue}/mo</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => openEdit(branch)}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setConfirmToggle(branch)}>
                    {branch.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {branchDialog(false)}
      {branchDialog(true)}

      {/* Toggle Confirmation */}
      <Dialog open={!!confirmToggle} onOpenChange={() => setConfirmToggle(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {confirmToggle?.is_active ? "Deactivate" : "Activate"} Branch
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmToggle?.is_active ? "deactivate" : "activate"} {confirmToggle?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmToggle(null)}>Cancel</Button>
            <Button onClick={handleToggleStatus} className={confirmToggle?.is_active ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "gold-gradient text-primary-foreground"}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
