import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cmc-teal font-extrabold text-white shadow-lg shadow-cmc-teal/20">CMC</span>
      <span>
        <span className={`block text-lg font-extrabold leading-none ${light ? "text-white" : "text-cmc-navy"}`}>CMC Connect</span>
        <span className={`mt-1 block text-[11px] font-medium ${light ? "text-white/60" : "text-gray-400"}`}>Opportunités & matching intelligent</span>
      </span>
    </Link>
  );
}
