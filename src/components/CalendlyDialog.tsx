"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface CalendlyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalendlyDialog = ({ open, onOpenChange }: CalendlyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Book a Demo</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-full">
          {/* Custom Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 border border-border-subtle hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Calendly iframe */}
          <iframe
            src="https://calendly.com/ishaan/30min?hide_event_type_details=1&hide_gdpr_banner=1"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ borderRadius: "0" }}
            title="Book a Demo - Calendly"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
