import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAccessControl, getPagePerms, ADMIN_PAGES } from "@/hooks/useAccessControl";
import { Search, ShieldX } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAdminAuth();
  const { roles, assignments } = useAccessControl();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // ── Page-level GET access check ──────────────────────────────────────────
  // Match current path to a known admin page key
  const currentPage = ADMIN_PAGES.find((p) => {
    if (p.key === "dashboard") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return (
      location.pathname === p.path ||
      location.pathname.startsWith(p.path + "/")
    );
  });

  const hasGetAccess = (() => {
    if (!currentPage) return true; // unknown route → don't block
    const perms = getPagePerms(roles, assignments, user.email, currentPage.key);
    return perms.get;
  })();

  return (
    <SidebarProvider>
      <div
        className="admin-shell min-h-screen flex w-full bg-slate-50 text-slate-900"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-20 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-8 sticky top-0 z-10">
            <div>
              <h2 className="font-bold text-slate-900 tracking-tight text-lg">
                Admin Console
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, {user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="bg-slate-100 border border-slate-200 rounded-full px-5 py-2 w-64 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all placeholder:text-slate-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
              </div>
              <button className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <NotificationBell />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
                {user.email[0]?.toUpperCase()}
              </div>
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-10 overflow-auto">
            {hasGetAccess ? (
              <div className="admin-content">{children}</div>
            ) : (
              <AccessDenied pageName={currentPage?.label ?? "this page"} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

function AccessDenied({ pageName }: { pageName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-5">
      <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <ShieldX className="w-10 h-10 text-red-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 mt-2 max-w-sm">
          You don't have permission to view <span className="font-medium text-slate-700">{pageName}</span>.
          Contact your administrator to request access.
        </p>
      </div>
      <div className="px-4 py-2 rounded-full bg-slate-100 text-xs text-slate-500 font-mono">
        Missing permission: GET&nbsp;/{pageName.toLowerCase().replace(/\s+/g, "-")}
      </div>
    </div>
  );
}
