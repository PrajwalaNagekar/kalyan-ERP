import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function ApprovalModal({ open, onOpenChange, title, description }: ApprovalModalProps) {
  const { toast } = useToast();

  const handleRequest = () => {
    toast({ title: "Approval Requested", description: "Your request has been sent to the Admin/Operations Manager for approval." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <DialogTitle className="font-serif">{title || "Approval Required"}</DialogTitle>
          </div>
          <DialogDescription>
            {description || "This action requires approval from an Admin or Operations Manager before it can be processed."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleRequest} className="bg-orange-500 hover:bg-orange-600 text-white">
            Request Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
