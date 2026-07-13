import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3dabc4] text-white">
        <GraduationCap size={20} />
      </span>
      <span className={`flex flex-col leading-tight ${light ? "text-white" : "text-[#333333]"}`}>
        <span className="text-sm font-bold">CMC Connect</span>
        <span className={`text-xs font-medium ${light ? "text-white/70" : "text-gray-500"}`}>
          Cité des Métiers et Compétences
        </span>
      </span>
    </Link>
  )
}
