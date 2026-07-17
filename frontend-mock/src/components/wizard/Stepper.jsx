import { Check } from "lucide-react"

export default function Stepper({ steps, currentIndex, completedSteps, onStepClick }) {
  return (
    <ol className="mb-8 flex items-start">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index)
        const isCurrent = index === currentIndex
        const isClickable = isCompleted || index < currentIndex
        const isLast = index === steps.length - 1

        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isCurrent
                    ? "bg-[#3dabc4] text-white ring-4 ring-[#3dabc4]/20"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? <Check size={16} /> : index + 1}
              </button>
              <span
                className={`hidden text-center text-xs font-medium sm:block ${
                  isCurrent ? "text-[#3dabc4]" : isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-1.5 h-0.5 flex-1 sm:mb-5 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
