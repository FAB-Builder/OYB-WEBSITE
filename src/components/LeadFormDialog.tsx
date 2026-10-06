"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/LeadForm";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadFormDialog = ({ open, onOpenChange }: LeadFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Get in touch</DialogTitle>
          <DialogDescription>Tell us about your organizational needs and we'll be in touch soon.</DialogDescription>
        </DialogHeader>
        <LeadForm
          onSuccess={() => {
            setTimeout(() => onOpenChange(false), 1500);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
