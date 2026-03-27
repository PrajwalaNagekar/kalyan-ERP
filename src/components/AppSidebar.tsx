import { useState } from "react";
import {
  LogOut, ChevronDown,
} from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.jpg";
import malabarLogo from "@/assets/malabar-white-logo.jpeg";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canSeeNavItem } from "@/config/rbac";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { navigationItems, type NavItem } from "@/components/sidebar/navigationItems";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role, roleGroup, signOut } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isPathActive = (url: string) => location.pathname === url;
  const isParentActive = (item: NavItem) => {
    if (item.url) return isPathActive(item.url);
    return item.subItems?.some(sub => location.pathname === sub.url) ?? false;
  };

  const toggleMenu = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleParentClick = (item: NavItem) => {
    if (item.url) {
      navigate(item.url);
    } else if (item.subItems) {
      toggleMenu(item.title);
      if (!isParentActive(item) && item.subItems[0]) {
        navigate(item.subItems[0].url);
      }
    }
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "KJ";
  const roleLabel = role ? role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "User";

  // Filter nav items by role
  const filteredItems = navigationItems.filter(item =>
    roleGroup ? canSeeNavItem(item.title, roleGroup) : true
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-2" />

      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative rounded-lg overflow-hidden border border-primary/20 shadow-gold" style={{ backgroundColor: '#ffffff' }}>
            <img src={malabarLogo} alt="Malabar Gold & Diamonds" className="w-full h-[100px] object-contain p-2" />
          </div>
        </div>
      )}

      <Separator className="bg-sidebar-border" />

      <SidebarContent className="py-2 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = isParentActive(item);
                const isOpen = openMenus.includes(item.title) || isActive;

                if (!item.subItems) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url!}
                          end={item.url === "/"}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                          activeClassName="bg-sidebar-accent text-primary font-semibold"
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                          {!collapsed && <span className="text-sm">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                if (collapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => handleParentClick(item)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all w-full ${
                            isActive
                              ? "bg-sidebar-accent text-primary font-semibold"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                        >
                          <item.icon className="w-4 h-4 shrink-0" />
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.title)}>
                      <CollapsibleTrigger asChild>
                        <button
                          onClick={() => handleParentClick(item)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? "bg-sidebar-accent text-foreground font-semibold"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-5 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                        {item.subItems.map((sub) => (
                          <NavLink
                            key={sub.url}
                            to={sub.url}
                            className="block py-1.5 px-2 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all"
                            activeClassName="text-primary font-bold bg-muted/50"
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator className="bg-sidebar-border" />

      <SidebarFooter className="p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 shrink-0 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url || defaultAvatar} alt={profile?.full_name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
              <p className="text-[10px] text-primary truncate">{roleLabel}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
