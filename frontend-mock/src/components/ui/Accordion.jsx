import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-gray-900">{item.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-[#3dabc4] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                {item.reponse}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
