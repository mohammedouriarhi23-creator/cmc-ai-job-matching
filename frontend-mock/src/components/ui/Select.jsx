export default function Select({ label, id, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-[#333333] focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
