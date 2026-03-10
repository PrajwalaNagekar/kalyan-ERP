import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Download, UserPlus, Pencil, UserX, ChevronLeft, ChevronRight } from "lucide-react";

const ROLES = ["super_admin", "central_admin", "branch_manager", "cashier", "sales_executive", "goldsmith", "accountant", "inventory_manager"] as const;
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", central_admin: "Central Admin", branch_manager: "Branch Manager",
  cashier: "Cashier", sales_executive: "Sales Executive", goldsmith: "Goldsmith",
  accountant: "Accountant", inventory_manager: "Inventory Manager",
};
const BRANCH_NAMES = ["Jayanagar", "Rajajinagar", "Marathahalli", "Whitefield", "Koramangala"];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["Dashboard", "Inventory", "POS", "Reports", "Staff", "Settings", "Branches"],
  central_admin: ["Dashboard", "Inventory", "Reports", "Staff", "Settings", "Branches"],
  branch_manager: ["Dashboard", "Inventory", "POS", "Reports", "Staff"],
  cashier: ["POS"],
  sales_executive: ["POS", "Inventory"],
  goldsmith: ["Inventory"],
  accountant: ["Reports", "Dashboard"],
  inventory_manager: ["Inventory", "Dashboard"],
};

interface StaffMember {
  id: string; name: string; email: string; role: string; branch: string; phone: string; status: "Active" | "Inactive";
}

const initialStaff: StaffMember[] = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@kalyan.com", role: "branch_manager", branch: "Jayanagar", phone: "+91 98451 23456", status: "Active" },
  { id: "2", name: "Priya Sharma", email: "priya@kalyan.com", role: "sales_executive", branch: "Marathahalli", phone: "+91 98452 34567", status: "Active" },
  { id: "3", name: "Suresh Reddy", email: "suresh@kalyan.com", role: "cashier", branch: "Rajajinagar", phone: "+91 98453 45678", status: "Active" },
  { id: "4", name: "Anita Patel", email: "anita@kalyan.com", role: "accountant", branch: "Whitefield", phone: "+91 98454 56789", status: "Active" },
  { id: "5", name: "Vikram Singh", email: "vikram@kalyan.com", role: "goldsmith", branch: "Koramangala", phone: "+91 98455 67890", status: "Active" },
  { id: "6", name: "Meena Devi", email: "meena@kalyan.com", role: "inventory_manager", branch: "Jayanagar", phone: "+91 98456 78901", status: "Active" },
  { id: "7", name: "Arjun Nair", email: "arjun@kalyan.com", role: "sales_executive", branch: "Whitefield", phone: "+91 98457 89012", status: "Inactive" },
  { id: "8", name: "Lakshmi Iyer", email: "lakshmi@kalyan.com", role: "branch_manager", branch: "Koramangala", phone: "+91 98458 90123", status: "Active" },
  { id: "9", name: "Deepak Joshi", email: "deepak@kalyan.com", role: "cashier", branch: "Marathahalli", phone: "+91 98459 01234", status: "Active" },
  { id: "10", name: "Kavitha Rao", email: "kavitha@kalyan.com", role: "central_admin", branch: "Jayanagar", phone: "+91 98460 12345", status: "Active" },
];

const PAGE_SIZE = 5;

const Staff = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "", branch: "", phone: "" });

  const filtered = useMemo(() => {
    return staff.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || s.role === roleFilter;
      const matchBranch = branchFilter === "all" || s.branch === branchFilter;
      return matchSearch && matchRole && matchBranch;
    });
  }, [staff, search, roleFilter, branchFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => setForm({ name: "", email: "", role: "", branch: "", phone: "" });

  const handleAdd = () => {
    if (!form.name || !form.email || !form.role || !form.branch) {
      toast({ title: "Validation error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    const newStaff: StaffMember = { id: Date.now().toString(), ...form, status: "Active" };
    setStaff(prev => [...prev, newStaff]);
    setShowAdd(false);
    resetForm();
    toast({ title: "Staff added", description: `${form.name} has been added successfully.` });
  };

  const handleEdit = () => {
    if (!editingStaff) return;
    setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...form } : s));
    setEditingStaff(null);
    resetForm();
    toast({ title: "Staff updated", description: "Staff member details updated." });
  };

  const toggleStatus = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
  };

  const openEdit = (s: StaffMember) => {
    setForm({ name: s.name, email: s.email, role: s.role, branch: s.branch, phone: s.phone });
    setEditingStaff(s);
  };

  const exportCSV = () => {
    const header = "Name,Email,Role,Branch,Phone,Status\n";
    const rows = filtered.map(s => `${s.name},${s.email},${ROLE_LABELS[s.role]},${s.branch},${s.phone},${s.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "staff_list.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const staffDialog = (isEdit: boolean) => (
    <Dialog open={isEdit ? !!editingStaff : showAdd} onOpenChange={isEdit ? () => { setEditingStaff(null); resetForm(); } : setShowAdd}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update staff member details." : "Enter details for the new staff member."}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-muted border-border" placeholder="e.g., Rajesh Kumar" />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-muted border-border" placeholder="e.g., rajesh@kalyan.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select value={form.branch} onValueChange={v => setForm(f => ({ ...f, branch: v }))}>
                <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>{BRANCH_NAMES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-muted border-border" placeholder="+91 98451 23456" />
          </div>
          {form.role && (
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1.5">Module Access for {ROLE_LABELS[form.role]}:</p>
              <div className="flex flex-wrap gap-1.5">
                {(ROLE_PERMISSIONS[form.role] || []).map(mod => (
                  <Badge key={mod} variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">{mod}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { isEdit ? setEditingStaff(null) : setShowAdd(false); resetForm(); }}>Cancel</Button>
          <Button onClick={isEdit ? handleEdit : handleAdd} className="gold-gradient text-primary-foreground">{isEdit ? "Save Changes" : "Add Staff"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage employees and role assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1" /> Export</Button>
          <Button onClick={() => { resetForm(); setShowAdd(true); }} className="gold-gradient text-primary-foreground"><UserPlus className="w-4 h-4 mr-2" /> Add Staff</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="pl-9 bg-muted border-border" />
            </div>
            <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-muted border-border"><SelectValue placeholder="Filter by role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={v => { setBranchFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-muted border-border"><SelectValue placeholder="Filter by branch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {BRANCH_NAMES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">{ROLE_LABELS[s.role]}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.branch}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={s.status === "Active" ? "bg-success/20 text-success border-success/30 text-[10px]" : "bg-destructive/20 text-destructive border-destructive/30 text-[10px]"}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(s.id)}>
                        <UserX className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No staff found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-xs text-muted-foreground px-2">Page {page} of {totalPages}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {staffDialog(false)}
      {staffDialog(true)}
    </div>
  );
};

export default Staff;
