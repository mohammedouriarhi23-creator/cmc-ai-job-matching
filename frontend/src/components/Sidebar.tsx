"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Bell, BriefcaseBusiness, Building2, FileText, LayoutDashboard,
  LogOut, PlusCircle, Settings2, UserCircle, Users, ClipboardList,
} from "lucide-react";
import Logo from "./Logo";

type Role = "candidate" | "admin";
type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const nav: Record<Role, NavItem[]> = {
  candidate: [
    { href: "/candidat", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/candidat/profil", label: "Mon profil & CV", icon: UserCircle },
    { href: "/candidat/offres", label: "Opportunités pour moi", icon: BriefcaseBusiness },
    { href: "/candidat/candidatures", label: "Mes candidatures", icon: ClipboardList },
    { href: "/candidat/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/candidats", label: "Stagiaires & lauréats", icon: Users },
    { href: "/admin/offres", label: "Offres CMC", icon: BriefcaseBusiness },
    { href: "/admin/offres/nouvelle", label: "Nouvelle offre", icon: PlusCircle },
    { href: "/admin/entreprises", label: "Entreprises partenaires", icon: Building2 },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/parametres-matching", label: "Paramètres matching", icon: Settings2 },
  ],
};

export default function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-cmc-navy px-5 py-6 text-white lg:flex">
      <Logo light />
      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cmc-teal text-sm font-bold">{role === "admin" ? "AD" : "MS"}</span>
          <div><p className="text-sm font-bold">{role === "admin" ? "Administration CMC" : "Mohammed Saidi"}</p><p className="text-xs text-white/50">{role === "admin" ? "Espace pilotage" : "Stagiaire · Digital"}</p></div>
        </div>
      </div>
      <nav className="mt-6 flex-1 space-y-1">
        {nav[role].map((item) => {
          const active = item.href === pathname || (item.href !== `/${role === "admin" ? "admin" : "candidat"}` && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={clsx("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition", active ? "bg-cmc-teal text-white" : "text-white/65 hover:bg-white/5 hover:text-white")}>
              <Icon size={18} />{item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white"><LogOut size={18} />Déconnexion</Link>
    </aside>
  );
}
