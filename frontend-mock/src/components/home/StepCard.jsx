export default function StepCard({ icon: Icon, number, title, description }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ebfbff] text-[#3dabc4]">
          <Icon size={30} />
        </div>
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#bc0001] text-sm font-bold text-white shadow-md">
          {number}
        </span>
      </div>
      <h3 className="mb-2 font-bold text-[#333333]">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  )
}
