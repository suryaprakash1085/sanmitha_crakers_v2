import { Eye, Pencil, Trash2, FileDown } from "lucide-react";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  downloadTitle?: string;
}

export const RowActions = ({ onView, onEdit, onDelete, onDownload, downloadTitle = "Download PDF" }: RowActionsProps) => (
  <div className="flex gap-1.5 justify-end">
    {onView && (
      <button onClick={onView} title="View" className="admin-pill-btn !px-2 !py-1.5">
        <Eye className="h-3.5 w-3.5" />
      </button>
    )}
    {onEdit && (
      <button onClick={onEdit} title="Edit" className="admin-pill-btn !px-2 !py-1.5">
        <Pencil className="h-3.5 w-3.5" />
      </button>
    )}
    {onDownload && (
      <button onClick={onDownload} title={downloadTitle} className="admin-pill-btn !px-2 !py-1.5">
        <FileDown className="h-3.5 w-3.5" />
      </button>
    )}
    {onDelete && (
      <button onClick={onDelete} title="Delete" className="admin-pill-btn danger !px-2 !py-1.5">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);
