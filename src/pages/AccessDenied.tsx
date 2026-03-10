import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_LANDING } from "@/config/rbac";
import { ShieldX, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  const { roleGroup } = useAuth();
  const navigate = useNavigate();
  const landing = roleGroup ? DEFAULT_LANDING[roleGroup] : "/login";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <ShieldX className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500">
            You do not have sufficient permissions to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => navigate(landing)} className="gold-gradient text-primary-foreground font-semibold gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-600 gap-2">
            <Mail className="w-4 h-4" />
            Contact Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
