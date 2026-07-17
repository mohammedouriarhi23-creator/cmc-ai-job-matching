export default function Textarea({
  label,
  id,
  className = "",
  rows = 4,
  showCount = false,
  maxLength,
  value = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`w-full resize-y rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-[#333333] placeholder:text-gray-400 focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20 ${className}`}
        {...props}
      />
      {showCount && (
        <p className="text-right text-xs text-gray-400">
          {value.length}
          {maxLength ? ` / ${maxLength}` : ""}
        </p>
      )}
    </div>
  )
}
