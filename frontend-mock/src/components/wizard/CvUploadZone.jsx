import { useRef, useState } from "react"
import { Sparkles, UploadCloud, X, Loader2 } from "lucide-react"
import Checkbox from "../ui/Checkbox"
import { cvApi, ApiError } from "../../lib/api"

const ACCEPT = ".pdf,.jpg,.jpeg,.png"
const MAX_SIZE = 5 * 1024 * 1024

export default function CvUploadZone({ profil, onExtracted }) {
  const [consent, setConsent] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState("idle") // idle | loading | error
  const [error, setError] = useState("")
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  function pickFile() {
    if (!consent) return
    inputRef.current?.click()
  }

  async function handleFile(file) {
    if (!file || !consent) return
    if (file.size > MAX_SIZE) {
      setError("Fichier trop volumineux (5 Mo maximum).")
      setStatus("error")
      return
    }

    setStatus("loading")
    setError("")
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const result = await cvApi.parse(file, profil, controller.signal)
      setStatus("idle")
      onExtracted(result, file)
    } catch (err) {
      if (err.name === "AbortError") {
        setStatus("idle")
        return
      }
      setStatus("error")
      setError(
        err instanceof ApiError
          ? err.message
          : "Extraction impossible, merci de remplir manuellement."
      )
    } finally {
      abortRef.current = null
    }
  }

  function handleCancel() {
    abortRef.current?.abort()
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="mb-6 rounded-xl border border-[#3dabc4]/30 bg-[#ebfbff] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#333333]">
        <Sparkles size={16} className="text-[#3dabc4]" />
        Déposez votre CV, on remplit le formulaire pour vous (optionnel)
      </div>

      <Checkbox
        id="cv-rgpd-consent"
        className="mb-3 bg-white"
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        label="Votre CV est analysé automatiquement pour pré-remplir le formulaire. Il n'est pas conservé à cette étape."
      />

      {status === "loading" ? (
        <div className="flex items-center justify-between rounded-lg border border-[#3dabc4]/40 bg-white p-4">
          <div className="flex items-center gap-2.5 text-sm font-medium text-[#333333]">
            <Loader2 size={18} className="animate-spin text-[#3dabc4]" />
            Analyse de votre CV en cours... vous pouvez continuer à remplir le formulaire pendant ce temps.
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
          >
            <X size={14} />
            Annuler
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (consent) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={pickFile}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
            !consent
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : dragOver
                ? "border-[#3dabc4] bg-white"
                : "border-[#3dabc4]/50 bg-white hover:border-[#3dabc4]"
          }`}
        >
          <UploadCloud size={20} className={consent ? "text-[#3dabc4]" : "text-gray-300"} />
          <span className="text-sm font-medium">
            {consent
              ? "Glissez-déposez votre CV ici, ou cliquez pour choisir un fichier (PDF, JPG, PNG — 5 Mo max)"
              : "Cochez la case ci-dessus pour activer le dépôt de CV"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            disabled={!consent}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {error && <p className="mt-2 text-xs font-medium text-[#bc0001]">{error}</p>}
    </div>
  )
}
