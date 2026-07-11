export default function ScoreRing({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-12 w-12 text-xs" : size === "lg" ? "h-28 w-28 text-2xl" : "h-16 w-16 text-sm";
  const tone = score >= 85 ? "border-emerald-500 text-emerald-600" : score >= 70 ? "border-cmc-teal text-cmc-teal-dark" : "border-amber-500 text-amber-600";
  return <div className={`flex ${dim} shrink-0 items-center justify-center rounded-full border-[5px] bg-white font-extrabold ${tone}`}>{score}%</div>;
}
