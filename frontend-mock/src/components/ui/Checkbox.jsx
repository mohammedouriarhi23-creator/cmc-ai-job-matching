export default function Checkbox({ label, id, className = "", ...props }) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-[#333333] transition-colors hover:border-[#3dabc4]/40 has-[:checked]:border-[#3dabc4] has-[:checked]:bg-[#ebfbff] ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#3dabc4] focus:ring-2 focus:ring-[#3dabc4]/20"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
