import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Bell, TrendingUp, FileText, ArrowRightLeft, AlertTriangle, Building2, Check, Eye, X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS, ROLE_BADGE_COLORS, ROLE_SCOPE_LABEL, ROLE_SCOPE_COLORS, type RoleGroup } from "@/config/rbac";
import { getRoleGroup } from "@/config/rbac";
import { format } from "date-fns";

interface Notification {
  id: number;
  icon: any;
  text: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: TrendingUp, text: "Gold rate updated to ₹7,250/g (24K)", time: "15 min ago", read: false, type: "info" },
  { id: 2, icon: FileText, text: "Invoice #INV-2847 generated — ₹3,30,375", time: "2 min ago", read: false, type: "success" },
  { id: 3, icon: ArrowRightLeft, text: "Stock transfer completed to Whitefield", time: "1 hr ago", read: false, type: "info" },
  { id: 4, icon: AlertTriangle, text: "Approval pending: Discount override request", time: "30 min ago", read: false, type: "warning" },
  { id: 5, icon: Building2, text: "Branch T. Nagar EOD report submitted", time: "45 min ago", read: true, type: "success" },
  { id: 6, icon: TrendingUp, text: "Silver rate dropped 2.1% — ₹92/g", time: "2 hr ago", read: true, type: "info" },
];

export function AppLayout() {
  const { profile, roleGroup, role, simulatedRoleGroup, setSimulatedRoleGroup, demoMode, signOut } = useAuth();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [currentTime, setCurrentTime] = useState(new Date());
  const unreadCount = notifications.filter(n => !n.read).length;

  const isRealAdmin = !demoMode && role ? getRoleGroup(role) === "admin" : (demoMode && roleGroup === "admin");
  const isSimulating = simulatedRoleGroup !== null && !demoMode;
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const typeColor = (type: string) =>
    type === "warning" ? "text-warning" : type === "success" ? "text-success" : "text-primary";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Gold shimmer accent line */}
          <div className="h-[2px] gold-shimmer-border" />

          {/* Demo mode banner */}
          {demoMode && (
            <div className="flex items-center justify-center gap-3 px-4 py-2 bg-primary/10 border-b border-primary/20 text-primary">
              <Play className="w-4 h-4" />
              <span className="text-xs font-semibold">DEMO MODE — Viewing as {ROLE_LABELS[roleGroup!]}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${ROLE_SCOPE_COLORS[roleGroup!]}`}>{ROLE_SCOPE_LABEL[roleGroup!]}</span>
              <Button size="sm" variant="outline" className="h-6 text-xs border-primary/30 hover:bg-primary/10" onClick={async () => { await signOut(); navigate("/login"); }}>
                <X className="w-3 h-3 mr-1" />Exit Demo
              </Button>
            </div>
          )}

          {/* Simulation banner (admin preview, non-demo) */}
          {isSimulating && (
            <div className="flex items-center justify-center gap-3 px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-semibold">SIMULATION MODE — Viewing as {ROLE_LABELS[simulatedRoleGroup!]}</span>
              <Button size="sm" variant="outline" className="h-6 text-xs border-amber-300 hover:bg-amber-100" onClick={() => setSimulatedRoleGroup(null)}>
                <X className="w-3 h-3 mr-1" />Exit
              </Button>
            </div>
          )}

          <header className="h-14 flex items-center justify-between border-b border-gray-200 px-4 bg-white/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-gray-400 hover:text-gray-700" />
              <span className="text-sm text-gray-500 hidden sm:inline">
                {getGreeting()}, <span className="text-gray-900 font-medium">{profile?.full_name || "User"}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-700">{format(currentTime, "hh:mm a")}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Role-switch preview (Admin only) */}
              {isRealAdmin && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-gray-500 hover:text-gray-700">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview Role</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-3 bg-white border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Simulate Role View</p>
                    <Select
                      value={simulatedRoleGroup || "none"}
                      onValueChange={v => setSimulatedRoleGroup(v === "none" ? null : v as RoleGroup)}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 text-xs h-8">
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">My Role (Admin)</SelectItem>
                        <SelectItem value="operations">Operations Manager</SelectItem>
                        <SelectItem value="finance">Finance & Ops Controller</SelectItem>
                        <SelectItem value="goldsmith">Karigar / Manufacturer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-gray-400 mt-2">Preview how other roles see the UI. No data changes are made.</p>
                  </PopoverContent>
                </Popover>
              )}

              {roleGroup && (
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_BADGE_COLORS[roleGroup]}`}>
                    {ROLE_LABELS[roleGroup]}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${ROLE_SCOPE_COLORS[roleGroup]}`}>
                    {roleGroup === "operations" || roleGroup === "finance" ? "Jayanagar" : ROLE_SCOPE_LABEL[roleGroup]}
                  </span>
                </div>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-700">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full gold-gradient text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 bg-white border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-serif font-semibold text-gray-900">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${!n.read ? "bg-gray-50" : ""}`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-md bg-gray-100 ${typeColor(n.type)}`}>
                          <n.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs leading-snug ${!n.read ? "text-gray-900 font-medium" : "text-gray-500"}`}>{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full gold-gradient mt-1.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 overflow-auto bg-gray-50/50 light-content-area" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
