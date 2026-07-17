import { Plus, Trash2 } from "lucide-react"

export default function RepeatableSection({ items, onChange, emptyItem, addLabel, renderItem, minItems = 0 }) {
  function updateItem(index, patch) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function addItem() {
    onChange([...items, emptyItem()])
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={item.id} className="relative rounded-xl border border-gray-200 p-4">
          {items.length > minItems && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2">
            {renderItem(item, index, (patch) => updateItem(index, patch))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#3dabc4] px-4 py-2.5 text-sm font-semibold text-[#3dabc4] hover:bg-[#ebfbff]"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  )
}
