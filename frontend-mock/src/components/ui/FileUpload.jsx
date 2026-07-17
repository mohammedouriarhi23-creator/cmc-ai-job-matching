import { UploadCloud, FileText, Trash2, AlertCircle } from "lucide-react"

const MAX_SIZE = 5 * 1024 * 1024
const DEFAULT_ACCEPT = ".pdf,.jpg,.jpeg,.png"

export default function FileUpload({
  label,
  id,
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  required = false,
  error,
}) {
  function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (file.size > MAX_SIZE) {
      onChange(null, "Fichier trop volumineux (5 Mo maximum).")
      return
    }
    onChange({ name: file.name, size: file.size, type: file.type, file, stale: false }, null)
  }

  function handleRemove() {
    onChange(null, null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-[#bc0001]"> *</span>}
        </label>
      )}

      {value ? (
        <div
          className={`flex items-center justify-between rounded-lg border p-3 ${
            value.stale ? "border-amber-300 bg-amber-50" : "border-gray-200"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
              <FileText size={17} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{value.name}</p>
              <p className="text-xs text-gray-500">
                {value.stale
                  ? "Fichier à resélectionner après rechargement de la page"
                  : `${(value.size / 1024).toFixed(0)} Ko`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Supprimer le fichier"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 border-dashed border-gray-300 px-4 py-4 text-center hover:border-primary-400"
        >
          <UploadCloud size={20} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Choisir un fichier (PDF, JPG, PNG — 5 Mo max)</span>
          <input id={id} type="file" accept={accept} className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-[#bc0001]">
          <AlertCircle size={13} />
          {error}
        </p>
      )}
    </div>
  )
}
