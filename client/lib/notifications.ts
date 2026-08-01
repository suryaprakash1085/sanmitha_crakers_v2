import { useEffect, useState } from "react";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "order" | "info" | "alert";
  createdAt: number;
  read: boolean;
  meta?: Record<string, any>;
};

const KEY = "admin_notifications";
const EVT = "notifications-change";

function read(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(list: Notification[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

export const notifications = {
  list: read,
  push(n: Omit<Notification, "id" | "createdAt" | "read">) {
    const item: Notification = {
      ...n,
      id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      read: false,
    };
    write([item, ...read()].slice(0, 100));
  },
  markAllRead() {
    write(read().map((n) => ({ ...n, read: true })));
  },
  clear() {
    write([]);
  },
  remove(id: string) {
    write(read().filter((n) => n.id !== id));
  },
};

export function useNotifications() {
  const [list, setList] = useState<Notification[]>(() => read());
  useEffect(() => {
    const on = () => setList(read());
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return { list, unread: list.filter((n) => !n.read).length };
}
