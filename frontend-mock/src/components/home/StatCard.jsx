export default function StatCard({ icon: Icon, value, label, border = true }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 px-6 py-4 text-center ${
        border ? "sm:border-l sm:border-gray-200 first:border-l-0" : ""
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ebfbff] text-[#3dabc4]">
        <Icon size={26} />
      </span>
      <p className="text-3xl font-extrabold text-[#333333]">{value}+</p>
      <p className="text-sm font-semibold text-[#3dabc4]">{label}</p>
    </div>
  )
}
