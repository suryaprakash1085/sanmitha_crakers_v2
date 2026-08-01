import { useState } from "react";

type Mode = "view" | "edit" | "create" | null;

export function useCrudModal<T>() {
  const [mode, setMode] = useState<Mode>(null);
  const [item, setItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  return {
    mode,
    item,
    isOpen: mode !== null,
    deleteItem,
    isDeleteOpen: deleteItem !== null,
    openView: (i: T) => { setItem(i); setMode("view"); },
    openEdit: (i: T) => { setItem(i); setMode("edit"); },
    openCreate: () => { setItem(null); setMode("create"); },
    openDelete: (i: T) => setDeleteItem(i),
    close: () => { setMode(null); setItem(null); },
    closeDelete: () => setDeleteItem(null),
    setOpen: (open: boolean) => { if (!open) { setMode(null); setItem(null); } },
    setDeleteOpen: (open: boolean) => { if (!open) setDeleteItem(null); },
  };
}
