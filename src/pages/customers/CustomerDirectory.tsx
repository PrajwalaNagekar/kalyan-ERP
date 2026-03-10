import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone } from "lucide-react";
import { useState } from "react";

const CUSTOMERS = [
  { id: "CUST-001", name: "Priya Sharma", phone: "+91 9876543210", appStatus: "Active", scheme: "11-Month Gold Plan", totalPurchases: 250000 },
  { id: "CUST-002", name: "Rahul Verma", phone: "+91 9123456789", appStatus: "Inactive", scheme: "None", totalPurchases: 45000 },
  { id: "CUST-003", name: "Anita Desai", phone: "+91 9988776655", appStatus: "Active", scheme: "11-Month Gold Plan", totalPurchases: 850000 },
  { id: "CUST-004", name: "Vikram Singh", phone: "+91 9888777666", appStatus: "Active", scheme: "11-Month Gold Plan", totalPurchases: 12000 },
  { id: "CUST-005", name: "Ravi Teja", phone: "+91 9876512345", appStatus: "Active", scheme: "None", totalPurchases: 420000 },
  { id: "CUST-006", name: "Sneha Reddy", phone: "+91 9123498765", appStatus: "Active", scheme: "None", totalPurchases: 185000 },
  { id: "CUST-007", name: "Deepa Menon", phone: "+91 9445566778", appStatus: "Active", scheme: "11-Month Gold Plan", totalPurchases: 1250000 },
  { id: "CUST-008", name: "Karthik S", phone: "+91 9334455667", appStatus: "Active", scheme: "None", totalPurchases: 380000 },
  { id: "CUST-009", name: "Lakshmi V", phone: "+91 9556677889", appStatus: "Inactive", scheme: "None", totalPurchases: 92000 },
  { id: "CUST-010", name: "Suresh Kumar", phone: "+91 9667788990", appStatus: "Active", scheme: "11-Month Gold Plan", totalPurchases: 560000 },
];

const CustomerDirectory = () => {
  const [search, setSearch] = useState("");
  const filtered = CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Customer Directory</h1>
        <p className="text-sm text-muted-foreground">Searchable customer database — <span className="text-primary font-semibold">{CUSTOMERS.length}</span> registered customers</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>
      <Card className="bg-card border-border shadow-card">
        <Table>
          <TableHeader><TableRow className="border-border"><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>App</TableHead><TableHead>Scheme</TableHead><TableHead className="text-right">Purchases</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="border-border table-row-gold cursor-pointer">
                <TableCell className="font-mono text-xs text-primary">{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3" />{c.phone}</TableCell>
                <TableCell><Badge className={c.appStatus === "Active" ? "bg-success/20 text-success border-success/30" : ""}>{c.appStatus}</Badge></TableCell>
                <TableCell className="text-xs">{c.scheme}</TableCell>
                <TableCell className="text-right font-semibold">₹{c.totalPurchases.toLocaleString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CustomerDirectory;
