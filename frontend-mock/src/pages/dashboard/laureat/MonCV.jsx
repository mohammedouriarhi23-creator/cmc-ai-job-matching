import { useState } from "react"
import { UploadCloud, FileText, CheckCircle2, Trash2 } from "lucide-react"
import Card from "../../../components/ui/Card"
import { useAuth } from "../../../context/AuthContext"

export default function MonCV() {
  const { user, updateProfile } = useAuth()
  const [uploaded, setUploaded] = useState(false)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    updateProfile({ cvNomFichier: file.name })
    setUploaded(true)
    setTimeout(() => setUploaded(false), 2500)
  }

  function handleRemove() {
    updateProfile({ cvNomFichier: null })
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mon CV</h1>
      <p className="mb-6 text-sm text-gray-500">
        Un CV à jour augmente vos chances d'être contacté par les entreprises partenaires.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-7">
          {uploaded && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 size={18} />
              CV téléversé avec succès.
            </div>
          )}

          {user?.cvNomFichier ? (
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                  <FileText size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.cvNomFichier}</p>
                  <p className="text-xs text-gray-500">Déposé récemment</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Supprimer le CV"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="cv-upload"
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-10 text-center hover:border-primary-400"
            >
              <UploadCloud size={32} className="text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">
                Cliquez pour déposer votre CV (PDF)
              </p>
              <p className="text-xs text-gray-400">Format PDF, taille maximale 5 Mo</p>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}

          <label
            htmlFor="cv-upload-2"
            className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary-900 px-5 py-2.5 text-sm font-semibold text-primary-900 hover:bg-primary-50"
          >
            {user?.cvNomFichier ? "Remplacer le CV" : "Choisir un fichier"}
            <input
              id="cv-upload-2"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </Card>

        <Card className="p-7">
          <h2 className="mb-4 font-bold text-gray-900">Aperçu des informations</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Nom complet</dt>
              <dd className="font-medium text-gray-900">
                {user?.prenom} {user?.nom}
              </dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Filière</dt>
              <dd className="font-medium text-gray-900">{user?.filiere}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Spécialité</dt>
              <dd className="font-medium text-gray-900">{user?.specialite}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Niveau</dt>
              <dd className="font-medium text-gray-900">{user?.niveau}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Année d'obtention</dt>
              <dd className="font-medium text-gray-900">{user?.annee}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
