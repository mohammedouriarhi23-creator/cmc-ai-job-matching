export default function Input({ label, id, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-[#333333] placeholder:text-gray-400 focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20 ${className}`}
        {...props}
      />
    </div>
  )
}
