import {
  LayoutDashboard,
  Users,
  Wrench,
  FolderTree,
  Package,
  ShoppingCart,
  Building2,
  Palette,
  FileText,
  LogOut,
  Zap,
  Mail,
  BarChart3,
  Shield,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminAuth } from "@/hooks/useAdminAuth";
import { useAccessControl, getPagePerms, type AdminPageKey } from "@/hooks/useAccessControl";

const items: { title: string; url: string; icon: React.ElementType; end?: boolean; pageKey: AdminPageKey }[] = [
  { title: "Dashboard",      url: "/admin",                icon: LayoutDashboard, end: true, pageKey: "dashboard"      },
  { title: "Reports",        url: "/admin/report",         icon: BarChart3,                  pageKey: "report"         },
  { title: "Orders",         url: "/admin/orders",         icon: ShoppingCart,               pageKey: "orders"         },
  { title: "Products",       url: "/admin/products",       icon: Package,                    pageKey: "products"       },
  { title: "Categories",     url: "/admin/categories",     icon: FolderTree,                 pageKey: "categories"     },
  { title: "Services",       url: "/admin/services",       icon: Wrench,                     pageKey: "services"       },
  { title: "Users",          url: "/admin/users",          icon: Users,                      pageKey: "users"          },
  { title: "Company",        url: "/admin/company",        icon: Building2,                  pageKey: "company"        },
  { title: "Customization",  url: "/admin/customization",  icon: Palette,                    pageKey: "customization"  },
  { title: "PDF Template",   url: "/admin/pdf-template",   icon: FileText,                   pageKey: "pdf-template"   },
  { title: "Email Settings", url: "/admin/email-settings", icon: Mail,                       pageKey: "email-settings" },
  { title: "Access Control", url: "/admin/access-control", icon: Shield,                     pageKey: "access-control" },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const { roles, assignments } = useAccessControl();
  const currentUser = adminAuth.current();
  const userEmail = currentUser?.email;
  const userRole = currentUser?.role; // JWT role field e.g. "admin", "editor"

  // Only show items where the current user has GET permission for their role
  const visibleItems = items.filter((item) => {
    const perms = getPagePerms(roles, assignments, userEmail, item.pageKey, userRole);
    return perms.get;
  });

  const handleLogout = () => {
    adminAuth.signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 [&>div]:bg-white"
    >
      <SidebarContent className="bg-white text-slate-600">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-slate-900">
              NEXUS<span className="text-violet-500">.</span>
            </span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-5">
                Management
              </div>
            )}
            <SidebarMenu className="gap-1.5 px-3">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-transparent">
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-violet-50 text-violet-600 border border-violet-200 font-medium"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            {!collapsed && (
              <div className="mx-4 mb-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                  Stock Health
                </p>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-3/4 shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">75% Inventory optimized</p>
              </div>
            )}
            <SidebarMenu className="px-3 pb-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl px-3 py-2.5"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
