import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  readOnly?: boolean;
}

export const FormModal = ({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  submitText = "Save",
  readOnly,
}: FormModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-2">{children}</div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {readOnly ? "Close" : "Cancel"}
        </Button>
        {!readOnly && onSubmit && <Button onClick={onSubmit}>{submitText}</Button>}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
