import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const INITIAL_BRANCHES = [
  { id: 1, name: "Indiranagar", state: "Karnataka", city: "Bengaluru", status: "Active", todaySales: 1250000, reportStatus: "Pending", staffCount: 12, posSync: "Healthy" },
  { id: 2, name: "Koramangala", state: "Karnataka", city: "Bengaluru", status: "Active", todaySales: 980000, reportStatus: "Completed", staffCount: 8, posSync: "Healthy" },
  { id: 3, name: "Jayanagar", state: "Karnataka", city: "Bengaluru", status: "Active", todaySales: 1450000, reportStatus: "Completed", staffCount: 15, posSync: "Healthy" },
  { id: 4, name: "Malleshwaram", state: "Karnataka", city: "Bengaluru", status: "Active", todaySales: 670000, reportStatus: "Completed", staffCount: 6, posSync: "Delayed" },
  { id: 5, name: "Whitefield", state: "Karnataka", city: "Bengaluru", status: "Active", todaySales: 1120000, reportStatus: "Completed", staffCount: 10, posSync: "Healthy" },
  { id: 6, name: "T. Nagar", state: "Tamil Nadu", city: "Chennai", status: "Active", todaySales: 2150000, reportStatus: "Completed", staffCount: 18, posSync: "Healthy" },
  { id: 7, name: "Anna Nagar", state: "Tamil Nadu", city: "Chennai", status: "Active", todaySales: 890000, reportStatus: "Pending", staffCount: 9, posSync: "Healthy" },
  { id: 8, name: "Andheri West", state: "Maharashtra", city: "Mumbai", status: "Active", todaySales: 3450000, reportStatus: "Completed", staffCount: 22, posSync: "Healthy" },
  { id: 9, name: "Banjara Hills", state: "Telangana", city: "Hyderabad", status: "Active", todaySales: 1850000, reportStatus: "Completed", staffCount: 14, posSync: "Healthy" },
  { id: 10, name: "MG Road", state: "Maharashtra", city: "Pune", status: "Active", todaySales: 720000, reportStatus: "Pending", staffCount: 7, posSync: "Delayed" },
];

const BranchSetup = () => {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", state: "" });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!form.name || !form.city || !form.state) { toast({ title: "Missing Fields", description: "Name, city, and state are required.", variant: "destructive" }); return; }
    setBranches(prev => [...prev, { id: prev.length + 1, name: form.name, state: form.state, city: form.city, status: "Active", todaySales: 0, reportStatus: "Pending", staffCount: 0, posSync: "Healthy" }]);
    toast({ title: "Branch Added", description: `${form.name}, ${form.city} added successfully.` });
    setForm({ name: "", city: "", state: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Branch Setup & Configuration</h1>
          <p className="text-sm text-muted-foreground">Manage all branch locations, POS sync, and operational status</p>
        </div>
        <Button className="gold-gradient text-primary-foreground" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Branch</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map(b => (
          <Card key={b.id} className="bg-card border-border shadow-card hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg purple-gradient flex items-center justify-center text-foreground text-xs font-bold">{b.name.charAt(0)}</div>
                  <div>
                    <p className="font-serif font-semibold text-sm">{b.name}</p>
                    <p className="text-[10px] text-muted-foreground">{b.city}, {b.state}</p>
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30 text-[10px]">{b.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[10px] text-muted-foreground">Today's Sales</p><p className="text-sm font-bold text-primary">₹{(b.todaySales / 100000).toFixed(2)}L</p></div>
                <div><p className="text-[10px] text-muted-foreground">Staff</p><p className="text-sm font-bold flex items-center gap-1"><Users className="w-3 h-3" />{b.staffCount}</p></div>
                <div><p className="text-[10px] text-muted-foreground">EOD Report</p><Badge variant={b.reportStatus === "Completed" ? "default" : "secondary"} className={`text-[10px] ${b.reportStatus === "Completed" ? "bg-success/20 text-success border-success/30" : ""}`}>{b.reportStatus}</Badge></div>
                <div><p className="text-[10px] text-muted-foreground">POS Sync</p><p className="text-xs flex items-center gap-1">{b.posSync === "Healthy" ? <CheckCircle className="w-3 h-3 text-success" /> : <AlertCircle className="w-3 h-3 text-warning" />}{b.posSync}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add New Branch</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Branch Name</Label><Input placeholder="e.g. MG Road" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input placeholder="e.g. Bengaluru" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
              <div className="space-y-2"><Label>State</Label><Input placeholder="e.g. Karnataka" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button className="gold-gradient text-primary-foreground" onClick={handleAdd}>Add Branch</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchSetup;
