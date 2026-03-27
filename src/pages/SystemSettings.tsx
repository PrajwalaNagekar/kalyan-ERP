import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Settings, Shield, Database, Bell, Save, ToggleLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore, type ToggleState } from "@/stores/appStore";
import { useAuth } from "@/contexts/AuthContext";

const TOGGLE_META: { key: keyof ToggleState; label: string; desc: string }[] = [
  { key: "enableExchange", label: "Enable Exchange", desc: "Allow old gold exchange in POS" },
  { key: "enableBuyback", label: "Enable Buyback", desc: "Allow gold/jewellery buyback from customers" },
  { key: "enableCustomOrders", label: "Enable Custom Orders", desc: "Allow Karigar custom order creation" },
  { key: "enableInvestmentScheme", label: "Enable Investment Scheme", desc: "Customer gold investment schemes" },
  { key: "enableInterBranchTransfer", label: "Enable Inter-Branch Transfer", desc: "Stock transfers between branches" },
  { key: "enableDiscountOverride", label: "Enable Discount Override", desc: "Allow manual discount overrides in POS" },
  { key: "enableRefundApprovalWorkflow", label: "Enable Refund Approval Workflow", desc: "Require approval for refunds above thresholds" },
  { key: "enableSMSNotifications", label: "Enable SMS Notifications", desc: "Send SMS to customers for orders and promotions" },
  { key: "enableAutoGoldRateSync", label: "Enable Auto Gold Rate Sync", desc: "Auto-sync gold rates from market feeds" },
  { key: "enableAuditTracking", label: "Enable Audit Tracking", desc: "Log all system actions to audit trail" },
  { key: "enableTicketManagement", label: "Enable Ticket Management", desc: "Enable ticket management system for issues" },
];

const SystemSettings = () => {
  const { toast } = useToast();
  const { profile, roleGroup } = useAuth();
  const { toggles, setToggle, addAuditLog } = useAppStore();
  const [confirmToggle, setConfirmToggle] = useState<{ key: keyof ToggleState; newValue: boolean } | null>(null);

  const [general, setGeneral] = useState({
    companyName: "Malabar Gold & Diamonds Pvt. Ltd.",
    headquarters: "Bangalore, Karnataka",
    gstNumber: "29AABCK1234F1ZN",
    currency: "INR",
    financialYearStart: "April",
    defaultTaxRate: "3",
  });

  const [security, setSecurity] = useState({
    minPasswordLength: "8",
    sessionTimeout: "30",
    twoFactorAuth: true,
    ipWhitelisting: false,
    requireUppercase: true,
    requireNumber: true,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    dailyReports: true,
    lowStockAlerts: true,
    priceChangeAlerts: true,
    loginAlerts: false,
  });

  const handleSave = (section: string) => {
    addAuditLog({ user: profile?.full_name || "Admin", role: "Admin", branch: "Central", action: `${section} settings updated`, module: "Settings", time: "Just now", before: "—", after: "Updated" });
    toast({ title: "Settings Saved", description: `${section} settings updated successfully.` });
  };

  const handleToggleConfirm = () => {
    if (!confirmToggle) return;
    const { key, newValue } = confirmToggle;
    const meta = TOGGLE_META.find(t => t.key === key);
    setToggle(key, newValue);
    addAuditLog({
      user: profile?.full_name || "Admin",
      role: "Admin",
      branch: "Central",
      action: `Toggle: ${meta?.label || key} ${newValue ? "enabled" : "disabled"}`,
      module: "Settings",
      time: "Just now",
      before: newValue ? "OFF" : "ON",
      after: newValue ? "ON" : "OFF",
    });
    toast({ title: `${meta?.label}`, description: `Feature has been ${newValue ? "enabled" : "disabled"}.` });
    setConfirmToggle(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground">ERP configuration and system administration</p>
      </div>
      <Tabs defaultValue="toggles" className="space-y-4">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="toggles">Feature Toggles</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Toggle Center */}
        <TabsContent value="toggles">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <ToggleLeft className="w-4 h-4 text-primary" />Feature Toggle Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TOGGLE_META.map(t => (
                <div key={t.key} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={toggles[t.key] ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-muted text-muted-foreground"}>
                      {toggles[t.key] ? "ON" : "OFF"}
                    </Badge>
                    <Switch
                      checked={toggles[t.key]}
                      onCheckedChange={(v) => setConfirmToggle({ key: t.key, newValue: v })}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Company Name</Label>
                  <Input value={general.companyName} onChange={e => setGeneral(p => ({ ...p, companyName: e.target.value }))} className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Headquarters</Label>
                  <Input value={general.headquarters} onChange={e => setGeneral(p => ({ ...p, headquarters: e.target.value }))} className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">GST Number</Label>
                  <Input value={general.gstNumber} onChange={e => setGeneral(p => ({ ...p, gstNumber: e.target.value }))} className="bg-muted/50 border-border font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Currency</Label>
                  <Select value={general.currency} onValueChange={v => setGeneral(p => ({ ...p, currency: v }))}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                      <SelectItem value="AED">د.إ AED - UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Financial Year Start</Label>
                  <Select value={general.financialYearStart} onValueChange={v => setGeneral(p => ({ ...p, financialYearStart: v }))}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Default Tax Rate (%)</Label>
                  <Input type="number" value={general.defaultTaxRate} onChange={e => setGeneral(p => ({ ...p, defaultTaxRate: e.target.value }))} className="bg-muted/50 border-border" />
                </div>
              </div>
              <Button onClick={() => handleSave("General")} className="gold-gradient text-primary-foreground shadow-gold">
                <Save className="w-4 h-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Min Password Length</Label>
                  <Input type="number" value={security.minPasswordLength} onChange={e => setSecurity(p => ({ ...p, minPasswordLength: e.target.value }))} className="bg-muted/50 border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Session Timeout (minutes)</Label>
                  <Input type="number" value={security.sessionTimeout} onChange={e => setSecurity(p => ({ ...p, sessionTimeout: e.target.value }))} className="bg-muted/50 border-border" />
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { key: "twoFactorAuth", label: "Two-Factor Authentication" },
                  { key: "ipWhitelisting", label: "IP Whitelisting" },
                  { key: "requireUppercase", label: "Require Uppercase in Password" },
                  { key: "requireNumber", label: "Require Number in Password" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label className="text-sm">{item.label}</Label>
                    <Switch checked={security[item.key as keyof typeof security] as boolean} onCheckedChange={v => setSecurity(p => ({ ...p, [item.key]: v }))} />
                  </div>
                ))}
              </div>
              <Button onClick={() => handleSave("Security")} className="gold-gradient text-primary-foreground shadow-gold">
                <Save className="w-4 h-4 mr-2" />Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailAlerts", label: "Email Alerts", desc: "Receive important alerts via email" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                { key: "dailyReports", label: "Daily Summary Reports", desc: "End-of-day sales and inventory reports" },
                { key: "lowStockAlerts", label: "Low Stock Alerts", desc: "Notify when inventory falls below threshold" },
                { key: "priceChangeAlerts", label: "Gold/Silver Price Alerts", desc: "Notify on significant rate changes" },
                { key: "loginAlerts", label: "Login Alerts", desc: "Notify on new device logins" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <Label className="text-sm font-medium">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch checked={notifications[item.key as keyof typeof notifications]} onCheckedChange={v => setNotifications(p => ({ ...p, [item.key]: v }))} />
                </div>
              ))}
              <Button onClick={() => handleSave("Notification")} className="gold-gradient text-primary-foreground shadow-gold">
                <Save className="w-4 h-4 mr-2" />Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toggle Confirmation Dialog */}
      <Dialog open={!!confirmToggle} onOpenChange={() => setConfirmToggle(null)}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <DialogTitle className="font-serif">Confirm Toggle Change</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to {confirmToggle?.newValue ? "enable" : "disable"}{" "}
              <strong>{TOGGLE_META.find(t => t.key === confirmToggle?.key)?.label}</strong>?
              This change will be logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmToggle(null)}>Cancel</Button>
            <Button onClick={handleToggleConfirm} className="gold-gradient text-primary-foreground">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemSettings;
