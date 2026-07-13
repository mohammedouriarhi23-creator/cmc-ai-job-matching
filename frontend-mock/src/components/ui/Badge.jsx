const colors = {
  primary: "bg-[#ebfbff] text-[#1a4a54]",
  accent: "bg-[#fdecee] text-[#bc0001]",
  teal: "bg-[#ebfbff] text-[#257184]",
  coral: "bg-[#fdecee] text-[#d7435b]",
  emerald: "bg-emerald-50 text-emerald-600",
  gray: "bg-gray-100 text-gray-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
}

export default function Badge({ children, color = "gray", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors[color]} ${className}`}
    >
      {children}
    </span>
  )
}
