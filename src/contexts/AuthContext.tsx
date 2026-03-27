import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getRoleGroup, type RoleGroup, ROLE_LABELS } from "@/config/rbac";

type AppRole = Database["public"]["Enums"]["app_role"];

const DEMO_PROFILES: Record<RoleGroup, { full_name: string; avatar_url: string | null }> = {
  admin: { full_name: "Rajesh Kumar (Admin)", avatar_url: null },
  operations: { full_name: "Priya Sharma (Ops Manager)", avatar_url: null },
  finance: { full_name: "Anand Reddy (Finance)", avatar_url: null },
  goldsmith: { full_name: "Ravi Shetty (Karigar)", avatar_url: null },
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  roleGroup: RoleGroup | null;
  profile: { full_name: string; avatar_url: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
  simulatedRoleGroup: RoleGroup | null;
  setSimulatedRoleGroup: (rg: RoleGroup | null) => void;
  effectiveRoleGroup: RoleGroup | null;
  demoMode: boolean;
  enterDemoMode: (roleGroup: RoleGroup) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  roleGroup: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  simulatedRoleGroup: null,
  setSimulatedRoleGroup: () => {},
  effectiveRoleGroup: null,
  demoMode: false,
  enterDemoMode: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedRoleGroup, setSimulatedRoleGroup] = useState<RoleGroup | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const initialized = useRef(false);

  const realRoleGroup = role ? getRoleGroup(role) : null;
  const effectiveRoleGroup = simulatedRoleGroup || realRoleGroup;

  const fetchUserData = async (userId: string) => {
    const [roleRes, profileRes] = await Promise.all([
      supabase.rpc("get_user_role", { _user_id: userId }),
      supabase.from("profiles").select("full_name, avatar_url").eq("user_id", userId).single(),
    ]);
    setRole((roleRes.data as AppRole) || "cashier");
    if (profileRes.data) setProfile(profileRes.data);
  };

  const enterDemoMode = (roleGroup: RoleGroup) => {
    setDemoMode(true);
    setSimulatedRoleGroup(roleGroup);
    setProfile(DEMO_PROFILES[roleGroup]);
    // Create a fake session marker so ProtectedRoute allows through
    setSession({ user: { id: "demo-user" } } as any);
    setUser({ id: "demo-user", email: "demo@malabargold.com" } as any);
    setLoading(false);
  };

  useEffect(() => {
    if (demoMode) return; // skip auth listeners in demo mode

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (initialized.current && event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "TOKEN_REFRESHED") {
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setRole(null);
        setProfile(null);
        setSimulatedRoleGroup(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialized.current) {
        initialized.current = true;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserData(session.user.id);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [demoMode]);

  const signOut = async () => {
    if (demoMode) {
      setDemoMode(false);
      setSimulatedRoleGroup(null);
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole(null);
      return;
    }
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null);
    setSimulatedRoleGroup(null);
  };

  return (
    <AuthContext.Provider value={{
      session, user, role,
      roleGroup: effectiveRoleGroup,
      profile, loading, signOut,
      simulatedRoleGroup, setSimulatedRoleGroup,
      effectiveRoleGroup,
      demoMode, enterDemoMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
