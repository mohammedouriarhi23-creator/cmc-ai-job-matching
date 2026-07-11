import type { LucideIcon } from "lucide-react";

export default function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string | number; hint?: string; icon: LucideIcon }) {
  return (
    <div className="card flex items-start justify-between">
      <div><p className="text-sm font-semibold text-gray-500">{label}</p><p className="mt-2 text-3xl font-extrabold text-cmc-navy">{value}</p>{hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}</div>
      <span className="rounded-xl bg-cmc-sky p-3 text-cmc-teal-dark"><Icon size={22} /></span>
    </div>
  );
}
