import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cable, CheckCircle, AlertCircle } from "lucide-react";

const INTEGRATIONS = [
  { name: "Tally ERP", status: "Connected", lastSync: "2 mins ago", records: "1,245 invoices synced" },
  { name: "Salesforce CRM", status: "Connected", lastSync: "15 mins ago", records: "892 customers synced" },
  { name: "Shopify Storefront", status: "Disconnected", lastSync: "N/A", records: "Setup pending" },
  { name: "WhatsApp Business", status: "Connected", lastSync: "5 mins ago", records: "324 notifications sent" },
  { name: "Google Pay / UPI", status: "Connected", lastSync: "Real-time", records: "Active" },
];

const IntegrationModules = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground">Integration Modules</h1>
      <p className="text-sm text-muted-foreground">Third-party sync status and configuration</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {INTEGRATIONS.map(int => (
        <Card key={int.name} className="bg-card border-border shadow-card hover:border-primary/30 transition-colors">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cable className="w-4 h-4 text-primary" />
                <span className="font-serif font-semibold text-sm">{int.name}</span>
              </div>
              <Badge variant={int.status === "Connected" ? "default" : "destructive"} className={int.status === "Connected" ? "bg-success/20 text-success border-success/30" : ""}>
                {int.status === "Connected" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {int.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Sync: <span className="text-foreground">{int.lastSync}</span></p>
              <p className="text-xs text-muted-foreground">{int.records}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default IntegrationModules;
