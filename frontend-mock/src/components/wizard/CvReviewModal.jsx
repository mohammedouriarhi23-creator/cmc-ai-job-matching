import { useState } from "react"
import { X, CheckCheck, XCircle, AlertTriangle } from "lucide-react"
import Button from "../ui/Button"
import { defaultAcceptedIds, allFieldIds } from "../../data/wizard/cvToFormMapper"

const FIELD_LABELS = {
  nom: "Nom",
  prenom: "Prénom",
  dateNaissance: "Date de naissance",
  nationalite: "Nationalité",
  ville: "Ville",
  adresse: "Adresse",
  telephone: "Téléphone",
  email: "E-mail",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  filiere: "Filière / Diplôme",
  niveau: "Niveau",
  anneeFormation: "Année de formation",
  anneeObtentionPrevue: "Année prévue d'obtention",
  anneeObtention: "Année d'obtention",
  mention: "Mention",
  moyenneGenerale: "Moyenne générale",
  classement: "Classement",
  presentation: "Présentation",
}

const SECTION_LABELS = {
  identite: "Identité",
  formation: "Formation",
  competencesTechniques: "Compétences techniques",
  langues: "Langues",
  softSkills: "Soft skills",
  experiences: "Expériences",
  projets: "Projets",
  certifications: "Certifications",
  documentsProfil: "Profil",
}

const CONFIDENCE_STYLES = {
  high: "bg-green-50 text-green-700 border-green-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-[#fdecee] text-[#bc0001] border-red-200",
}

function fieldId(f) {
  return f.type === "scalar" ? `${f.stepId}:${f.field}` : `${f.stepId}:${f.field}:${f.index}`
}

function fieldSummary(f) {
  if (f.type === "scalar") return String(f.value)
  switch (f.field) {
    case "competencesTechniques":
      return `${f.item.nom}${f.item.niveau ? ` — ${f.item.niveau}` : ""}`
    case "langues":
      return `${f.item.langue}${f.item.niveau ? ` — ${f.item.niveau}` : ""}`
    case "softSkills":
      return f.item.value
    case "experiences":
      return `${f.item.titre}${f.item.organisme ? ` chez ${f.item.organisme}` : ""}`
    case "projets":
      return f.item.nom
    case "certifications":
      return `${f.item.nom}${f.item.organisme ? ` — ${f.item.organisme}` : ""}`
    default:
      return JSON.stringify(f.item)
  }
}

export default function CvReviewModal({ reviewSections, meta, onConfirm, onCancel }) {
  const [acceptedIds, setAcceptedIds] = useState(() => defaultAcceptedIds(reviewSections))

  function toggle(id) {
    setAcceptedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const missingFields = meta?.champsNonExtraits || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-[#333333]">Informations détectées dans votre CV</h2>
          <button onClick={onCancel} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-100 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setAcceptedIds(allFieldIds(reviewSections))}
          >
            <CheckCheck size={14} />
            Tout accepter
          </Button>
          <Button variant="ghost" size="sm" type="button" onClick={() => setAcceptedIds(new Set())}>
            <XCircle size={14} />
            Tout ignorer
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {reviewSections.map((section) => (
            <div key={`${section.stepId}-${section.sourceKey}`} className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                {SECTION_LABELS[section.sourceKey] || section.sourceKey}
              </p>
              <div className="flex flex-col gap-1.5">
                {section.fields.map((f) => {
                  const id = fieldId(f)
                  const label = f.type === "scalar" ? FIELD_LABELS[f.field] || f.field : null
                  return (
                    <label
                      key={id}
                      className="flex items-start gap-2.5 rounded-lg border border-gray-100 p-2.5 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#3dabc4]"
                        checked={acceptedIds.has(id)}
                        onChange={() => toggle(id)}
                      />
                      <span className="min-w-0 flex-1">
                        {label && <span className="mr-1.5 text-xs text-gray-400">{label} :</span>}
                        <span className="text-sm text-[#333333]">{fieldSummary(f)}</span>
                        {f.type === "list" && f.isDuplicate && (
                          <span className="ml-1.5 text-xs text-gray-400">(déjà dans votre liste)</span>
                        )}
                        {f.alreadyFilled && (
                          <span className="ml-1.5 text-xs text-amber-600">
                            (remplace une valeur déjà saisie)
                          </span>
                        )}
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${CONFIDENCE_STYLES[f.confidence] || CONFIDENCE_STYLES.medium}`}
                      >
                        {f.confidence}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}

          {missingFields.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                <AlertTriangle size={13} />
                Non détecté dans le CV — à remplir manuellement
              </p>
              <p className="text-xs text-amber-700">
                {missingFields.map((f) => SECTION_LABELS[f] || FIELD_LABELS[f] || f).join(", ")}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-5">
          <button type="button" onClick={onCancel} className="text-sm font-medium text-gray-500 hover:text-[#333333]">
            Annuler
          </button>
          <Button type="button" variant="primary" onClick={() => onConfirm(acceptedIds)}>
            Appliquer les champs cochés
          </Button>
        </div>
      </div>
    </div>
  )
}
