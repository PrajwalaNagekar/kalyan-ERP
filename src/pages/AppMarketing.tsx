import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CAMPAIGNS = [
  { id: "CAMP-1", title: "Akshaya Tritiya Pre-book", discount: "Flat 5% Off Making", status: "Active", clicks: 1240, impressions: 12400 },
  { id: "CAMP-2", title: "Wedding Season Special", discount: "Zero Wastage on Diamonds", status: "Scheduled", clicks: 0, impressions: 0 },
  { id: "CAMP-3", title: "Silver Making Discount", discount: "Extra 2% Off Silver Making", status: "Active", clicks: 890, impressions: 2400 },
  { id: "CAMP-4", title: "Diwali Gold Bonanza", discount: "₹500 Off per 10g", status: "Active", clicks: 2100, impressions: 18500 },
  { id: "CAMP-5", title: "Valentine's Diamond Week", discount: "Free BIS Hallmark", status: "Completed", clicks: 3200, impressions: 22000 },
  { id: "CAMP-6", title: "New Year Loyalty Reward", discount: "Double Gold Points", status: "Completed", clicks: 1800, impressions: 9500 },
];

const WEEKLY_ENGAGEMENT = [
  { day: "Mon", opens: 1200, clicks: 340 },
  { day: "Tue", opens: 1450, clicks: 420 },
  { day: "Wed", opens: 980, clicks: 280 },
  { day: "Thu", opens: 1680, clicks: 510 },
  { day: "Fri", opens: 2100, clicks: 680 },
  { day: "Sat", opens: 2800, clicks: 890 },
  { day: "Sun", opens: 1900, clicks: 520 },
];

const AppMarketing = () => (
  <div className="space-y-6 animate-fade-in">
    <div><h1 className="text-2xl font-serif font-bold text-foreground">App Marketing</h1><p className="text-sm text-muted-foreground">Campaign management, customer engagement, and weekly analytics</p></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 flex items-center gap-3"><Eye className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Total Impressions</p><p className="text-xl font-bold">64,800</p></div></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5 flex items-center gap-3"><MousePointer className="w-5 h-5 text-primary" /><div><p className="text-xs text-muted-foreground">Total Clicks</p><p className="text-xl font-bold">9,230</p></div></CardContent></Card>
      <Card className="bg-card border-border shadow-card card-premium"><CardContent className="p-5"><p className="text-xs text-muted-foreground">Avg Conversion Rate</p><p className="text-xl font-bold text-primary">14.2%</p></CardContent></Card>
    </div>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif">Weekly Engagement</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={WEEKLY_ENGAGEMENT} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(260, 20%, 18%)" />
            <XAxis dataKey="day" tick={{ fill: "hsl(260, 15%, 55%)", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "hsl(260, 15%, 55%)", fontSize: 11 }} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(260, 30%, 11%)", border: "1px solid hsl(260, 20%, 18%)", borderRadius: 8, color: "hsl(45, 20%, 92%)" }} />
            <Bar dataKey="opens" fill="hsl(43, 56%, 52%)" radius={[4, 4, 0, 0]} name="Opens" />
            <Bar dataKey="clicks" fill="hsl(270, 40%, 30%)" radius={[4, 4, 0, 0]} name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card className="bg-card border-border shadow-card">
      <CardHeader><CardTitle className="text-base font-serif flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" />Campaigns</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Title</TableHead><TableHead>Discount</TableHead><TableHead>Impressions</TableHead><TableHead>Clicks</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {CAMPAIGNS.map(c => (
              <TableRow key={c.id} className="border-border table-row-gold">
                <TableCell className="font-mono text-xs text-primary">{c.id}</TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-xs">{c.discount}</TableCell>
                <TableCell>{c.impressions.toLocaleString()}</TableCell>
                <TableCell>{c.clicks.toLocaleString()}</TableCell>
                <TableCell><Badge className={c.status === "Active" ? "bg-success/20 text-success border-success/30" : c.status === "Completed" ? "" : "bg-warning/20 text-warning border-warning/30"}>{c.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AppMarketing;
