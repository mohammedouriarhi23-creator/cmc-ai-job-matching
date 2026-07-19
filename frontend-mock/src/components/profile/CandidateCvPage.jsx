import { useState } from "react"
import { UploadCloud, FileText, CheckCircle2, Download, Trash2 } from "lucide-react"

import Card from "../ui/Card"
import { useAuth } from "../../context/auth"
import { candidateProfileApi, saveDownloadedFile } from "../../lib/api"

export default function CandidateCvPage({ variant }) {
  const { user, refreshProfile } = useAuth()
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const cvDocument = user?.documents?.find((item) => item.document_type === "cv")

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    setBusy(true)
    setError("")
    try {
      await candidateProfileApi.uploadDocument("cv", file)
      await refreshProfile()
      setSuccess("CV téléversé et enregistré avec succès.")
    } catch (err) {
      setError(err.message || "Impossible de téléverser le CV.")
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove() {
    if (!cvDocument) return
    setBusy(true)
    setError("")
    try {
      await candidateProfileApi.deleteDocument(cvDocument.id)
      await refreshProfile()
      setSuccess("CV supprimé.")
    } catch (err) {
      setError(err.message || "Impossible de supprimer le CV.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDownload() {
    if (!cvDocument) return
    setBusy(true)
    setError("")
    try {
      const blob = await candidateProfileApi.downloadDocument(cvDocument.id)
      saveDownloadedFile(blob, cvDocument.original_filename)
    } catch (err) {
      setError(err.message || "Impossible de télécharger le CV.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mon CV</h1>
      <p className="mb-6 text-sm text-gray-500">
        Votre CV est conservé de manière sécurisée et joint à vos candidatures.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-7">
          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}
          {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          {cvDocument ? (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                  <FileText size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cvDocument.original_filename}</p>
                  <p className="text-xs text-gray-500">{Math.ceil(cvDocument.file_size / 1024)} Ko</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={busy}
                  className="rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-900 disabled:opacity-50"
                  aria-label="Télécharger le CV"
                >
                  <Download size={17} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={busy}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                  aria-label="Supprimer le CV"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Aucun CV enregistré.
            </p>
          )}

          <label className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary-900 px-5 py-2.5 text-sm font-semibold text-primary-900 hover:bg-primary-50">
            <UploadCloud size={17} />
            {busy ? "Traitement..." : cvDocument ? "Remplacer le CV" : "Choisir un CV"}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={busy}
              onChange={handleFileChange}
            />
          </label>
        </Card>

        <Card className="p-7">
          <h2 className="mb-4 font-bold text-gray-900">Aperçu du profil</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <Row label="Nom complet" value={`${user?.prenom || ""} ${user?.nom || ""}`} />
            <Row label="Filière" value={user?.filiere || "Non renseignée"} />
            <Row label="Niveau" value={user?.niveau || "Non renseigné"} />
            <Row label="CMC" value={user?.cmc || "CMC Nador"} />
            <Row
              label={variant === "laureat" ? "Année d'obtention" : "Année de formation"}
              value={user?.annee || "Non renseignée"}
            />
          </dl>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  )
}
