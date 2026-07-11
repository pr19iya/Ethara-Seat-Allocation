"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Bot,
  
  FolderKanban,
  LayoutDashboard,
  MapPinned,
  
  Users,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  
  {
    label: "Allocation",
    href: "/allocation",
    icon: MapPinned,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "AI Assistant",
    href: "/assistant",
    icon: Bot,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col bg-[#111827] text-white">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 font-bold shadow-lg shadow-indigo-950/30">
            E
          </div>

          <div>
            <p className="text-lg font-bold tracking-wide">
              ETHARA
            </p>
            <p className="text-xs text-slate-400">
              Workspace Management
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/20"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon
                size={19}
                strokeWidth={2}
                className={
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                }
              />

              {item.label}

              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
  <div className="rounded-2xl bg-white/5 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
        A
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          Admin User
        </p>

        <p className="truncate text-xs text-slate-400">
          HR Operations
        </p>
      </div>
    </div>
  </div>
</div>
    </aside>
  );
}