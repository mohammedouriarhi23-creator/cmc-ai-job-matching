import { Sparkles } from "lucide-react"

export default function ExtractedBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-[#ebfbff] px-2 py-0.5 text-[10px] font-semibold text-[#3dabc4]">
      <Sparkles size={10} />
      extrait du CV
    </span>
  )
}
