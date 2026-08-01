import { Bell, Check, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications, notifications } from "@/lib/notifications";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationBell = () => {
  const { list, unread } = useNotifications();

  const timeAgo = (t: number) => {
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-tr from-orange-600 to-yellow-400 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_10px_rgba(249,115,22,0.4)]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0 bg-white border-slate-200 text-slate-900">
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          <div>
            <p className="font-semibold text-sm">Notifications</p>
            <p className="text-xs text-slate-500">{unread} unread</p>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-900" onClick={() => notifications.markAllRead()}>
              <Check className="w-3.5 h-3.5 mr-1" /> Read
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-slate-900" onClick={() => notifications.clear()}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-96">
          {list.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-10">No notifications yet</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {list.map((n) => (
                <div key={n.id} className={`p-3 hover:bg-slate-50 transition ${!n.read ? "bg-orange-50" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${!n.read ? "bg-orange-500" : "bg-slate-300"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
