import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const PageHeader = ({ title, description, action, icon }: PageHeaderProps) => (
  <div className="admin-page-header flex justify-between items-center gap-4">
    <div className="relative flex items-center gap-4">
      {icon ? (
        <div className="icon-badge w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30 text-violet-300">
          {icon}
        </div>
      ) : (
        <span className="accent-dot" />
      )}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-violet-300/80 font-bold">Admin</span>
          <span className="h-px w-6 bg-violet-400/40" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h1>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
    </div>
    {action && <div className="relative">{action}</div>}
  </div>
);
