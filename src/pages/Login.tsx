import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import loginBg from "@/assets/login-jewellery-bg.jpg";
import malabarLogo from "@/assets/malabar-logo.png";
import { DEFAULT_LANDING } from "@/config/rbac";
import type { RoleGroup } from "@/config/rbac";
import { useAuth } from "@/contexts/AuthContext";

const ROLE_MAP: Record<string, RoleGroup> = {
  admin: "admin",
  operations: "operations",
  finance: "finance",
  karigar: "goldsmith",
};

const ROLES_WITH_2FA: string[] = ["admin", "finance"];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"role" | "password" | "otp">("role");
  const [otpValue, setOtpValue] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { enterDemoMode } = useAuth();

  const needs2FA = ROLES_WITH_2FA.includes(selectedRole);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setPassword("");
    setOtpValue("");
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast({ title: "Invalid password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (needs2FA) {
      setStep("otp");
      toast({ title: "OTP Sent", description: "A 6-digit code has been sent to your registered device." });
    } else {
      completeLogin();
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit code.", variant: "destructive" });
      return;
    }
    completeLogin();
  };

  const completeLogin = () => {
    setLoading(true);
    const roleGroup = ROLE_MAP[selectedRole];
    if (!roleGroup) return;

    // Simulate audit log entry
    console.log("[AUDIT] Login attempt:", {
      role: selectedRole,
      roleGroup,
      time: new Date().toISOString(),
      ip: "192.168.1.101",
      device: navigator.userAgent,
      status: "success",
      twoFA: needs2FA,
    });

    enterDemoMode(roleGroup);
    toast({
      title: `Welcome — ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`,
      description: `Signed in successfully${needs2FA ? " (2FA verified)" : ""}.`,
    });
    setTimeout(() => {
      navigate(DEFAULT_LANDING[roleGroup]);
      setLoading(false);
    }, 300);
  };

  const handleChangeRole = () => {
    setSelectedRole("");
    setPassword("");
    setOtpValue("");
    setStep("role");
  };

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      operations: "Operations Manager",
      finance: "Finance & Ops Controller",
      karigar: "Karigar / Manufacturer",
    };
    return labels[role] || role;
  };

  return (
    <div className="min-h-screen grid grid-rows-[220px_1fr] lg:grid-rows-1 lg:grid-cols-2">
      {/* Left — Branded Image Panel */}
      <div className="relative overflow-hidden">
        <img src={loginBg} alt="Luxury jewellery collection" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
        <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient" />
        <div className="absolute top-0 bottom-0 right-0 w-[2px] gold-gradient hidden lg:block" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary/15 hidden lg:block" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border border-primary/20 hidden lg:block" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
         <div className="inline-flex items-center justify-center w-48 h-48 lg:w-64 lg:h-64 rounded-2xl mb-4 lg:mb-6">
  <img
    src={malabarLogo}
    alt="Malabar Gold & Diamonds"
    className="w-full h-full object-contain drop-shadow-lg"
  />
</div>
          <h1 className="text-3xl lg:text-5xl font-serif font-bold text-white drop-shadow-lg">Malabar Gold & Diamonds</h1>
          <div className="w-24 h-[2px] gold-gradient mx-auto my-3 lg:my-4" />
          <p className="text-primary text-base lg:text-xl tracking-[0.35em] uppercase font-semibold drop-shadow-lg" style={{ textShadow: '0 0 20px hsla(43,56%,52%,0.5)' }}>Celebrate the Beauty of Life</p>
          <div className="hidden lg:flex items-center gap-6 mt-10 text-white/50 text-xs tracking-wider">
            <span>Since 1993</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>400+ Showrooms</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>BIS Hallmarked</span>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm mx-6 lg:mx-12 py-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your ERP dashboard</p>

          {/* Step 1: Role Selection */}
          {step === "role" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Select Your Role</Label>
                <Select value={selectedRole} onValueChange={handleRoleSelect}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/30 h-11 text-gray-900">
                    <SelectValue placeholder="Choose role to continue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operations">Operations Manager</SelectItem>
                    <SelectItem value="finance">Finance & Ops Controller</SelectItem>
                    <SelectItem value="karigar">Karigar / Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[11px] text-gray-400 text-center">Select your role to proceed to authentication</p>
            </div>
          )}

          {/* Step 2: Password */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Lock className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Signing in as</p>
                  <p className="text-sm font-semibold text-gray-900">{roleLabel(selectedRole)}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-xs text-primary h-7" onClick={handleChangeRole}>
                  Change
                </Button>
              </div>

              {needs2FA && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>2FA verification required for this role</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-gray-500 uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoFocus
                    className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/30 pr-10 h-11 text-gray-900"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold" disabled={loading}>
                {needs2FA ? "Continue to OTP" : (loading ? "Please wait..." : "Sign In")}
              </Button>
            </form>
          )}

          {/* Step 3: OTP (2FA) */}
          {step === "otp" && (
            <form onSubmit={handleOTPSubmit} className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Two-Factor Authentication</p>
                  <p className="text-sm font-semibold text-gray-900">{roleLabel(selectedRole)}</p>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">Enter the 6-digit code sent to your device</p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-[10px] text-gray-400">For this prototype, enter any 6 digits</p>
              </div>

              <Button type="submit" className="w-full h-11 gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Sign In"}
              </Button>

              <Button type="button" variant="ghost" className="w-full text-xs text-gray-500" onClick={() => { setStep("password"); setOtpValue(""); }}>
                ← Back to password
              </Button>
            </form>
          )}

          <p className="text-center text-[10px] text-gray-400 mt-8">© 2026 Malabar Gold & Diamonds ERP — Bangalore</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
