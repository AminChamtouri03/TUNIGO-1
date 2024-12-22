import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

interface AuthMessageProps {
  open: boolean;
  onClose: () => void;
}

export function AuthMessage({ open, onClose }: AuthMessageProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[280px] bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-6 text-center">
        <AlertDialogCancel className="absolute right-2 top-2 h-8 w-8 rounded-full p-0">
          <X className="h-4 w-4" />
        </AlertDialogCancel>
        <AlertDialogTitle className="text-lg font-semibold mb-2">
          Authentication Required
        </AlertDialogTitle>
        <AlertDialogDescription className="mb-4">
          Please sign in to perform this action.
        </AlertDialogDescription>
        <AlertDialogAction
          onClick={onClose}
          className="bg-[#00A9FF] text-white hover:bg-[#00A9FF]/90 w-full"
        >
          Sign In
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
