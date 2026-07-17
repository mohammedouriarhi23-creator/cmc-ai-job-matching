import { useState } from "react"
import Input from "../../ui/Input"
import Select from "../../ui/Select"
import FileUpload from "../../ui/FileUpload"
import CvUploadZone from "../CvUploadZone"
import CvReviewModal from "../CvReviewModal"
import ExtractedBadge from "../ExtractedBadge"
import { buildReviewModel, buildExtractionPatch } from "../../../data/wizard/cvToFormMapper"

const SEXE_OPTIONS = ["Homme", "Femme", "Autre", "Préfère ne pas dire"]

export default function IdentiteStep({
  value,
  onChange,
  errors,
  variant,
  allData,
  applyExtraction,
  extractedFieldNames,
}) {
  const [review, setReview] = useState(null) // { sections, meta } | null

  function set(name) {
    return (e) => onChange({ [name]: e.target.value })
  }

  function label(text, fieldName) {
    return (
      <>
        {text}
        {extractedFieldNames?.has(fieldName) && <ExtractedBadge />}
      </>
    )
  }

  function handleExtracted(result, file) {
    const sections = buildReviewModel(result.data, allData)
    setReview({ sections, meta: result.meta })
    // Le CV est déjà validé côté serveur : on l'installe directement dans
    // l'étape Documents pour éviter un second dépôt.
    applyExtraction({
      documentsProfil: { cv: { name: file.name, size: file.size, type: file.type, file } },
    })
  }

  function handleConfirmReview(acceptedIds) {
    const patch = buildExtractionPatch(review.sections, allData, acceptedIds)
    applyExtraction(patch)
    setReview(null)
  }

  return (
    <div>
      <CvUploadZone profil={variant} onExtracted={handleExtracted} />

      {review && (
        <CvReviewModal
          reviewSections={review.sections}
          meta={review.meta}
          onConfirm={handleConfirmReview}
          onCancel={() => setReview(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input label={label("Nom *", "nom")} id="nom" value={value.nom} onChange={set("nom")} />
          {errors.nom && <p className="mt-1 text-xs text-[#bc0001]">{errors.nom}</p>}
        </div>
        <div>
          <Input label={label("Prénom *", "prenom")} id="prenom" value={value.prenom} onChange={set("prenom")} />
          {errors.prenom && <p className="mt-1 text-xs text-[#bc0001]">{errors.prenom}</p>}
        </div>

        <div className="sm:col-span-2">
          <FileUpload
            label="Photo"
            id="photo"
            value={value.photo}
            onChange={(file, error) => onChange({ photo: file, photoError: error })}
            accept=".jpg,.jpeg,.png"
            error={value.photoError}
          />
        </div>

        <div>
          <Input
            label={label("Date de naissance *", "dateNaissance")}
            id="dateNaissance"
            type="date"
            value={value.dateNaissance}
            onChange={set("dateNaissance")}
          />
          {errors.dateNaissance && <p className="mt-1 text-xs text-[#bc0001]">{errors.dateNaissance}</p>}
        </div>

        <div>
          <Input
            label={label("Nationalité *", "nationalite")}
            id="nationalite"
            value={value.nationalite}
            onChange={set("nationalite")}
          />
          {errors.nationalite && <p className="mt-1 text-xs text-[#bc0001]">{errors.nationalite}</p>}
        </div>

        {variant === "stagiaire" && (
          <Select label="Sexe" id="sexe" value={value.sexe} onChange={set("sexe")}>
            <option value="">Non précisé</option>
            {SEXE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}

        <div>
          <Input
            label={label(variant === "stagiaire" ? "Ville de résidence *" : "Ville *", "ville")}
            id="ville"
            value={value.ville}
            onChange={set("ville")}
          />
          {errors.ville && <p className="mt-1 text-xs text-[#bc0001]">{errors.ville}</p>}
        </div>

        <Input label={label("Adresse", "adresse")} id="adresse" value={value.adresse} onChange={set("adresse")} />

        <div>
          <Input
            label={label("Téléphone *", "telephone")}
            id="telephone"
            value={value.telephone}
            onChange={set("telephone")}
            placeholder="06 XX XX XX XX"
          />
          {errors.telephone && <p className="mt-1 text-xs text-[#bc0001]">{errors.telephone}</p>}
        </div>
        <div>
          <Input
            label={label("E-mail *", "email")}
            id="email"
            type="email"
            value={value.email}
            onChange={set("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-[#bc0001]">{errors.email}</p>}
        </div>

        <Input
          label={label("LinkedIn", "linkedin")}
          id="linkedin"
          value={value.linkedin}
          onChange={set("linkedin")}
          placeholder="https://linkedin.com/in/..."
        />
        <Input
          label={label("Portfolio / GitHub / site web", "portfolio")}
          id="portfolio"
          value={value.portfolio}
          onChange={set("portfolio")}
          placeholder="https://..."
        />

        <div>
          <Input
            label="Mot de passe *"
            id="motDePasse"
            type="password"
            value={value.motDePasse}
            onChange={set("motDePasse")}
            placeholder="8 caractères minimum"
          />
          {errors.motDePasse && <p className="mt-1 text-xs text-[#bc0001]">{errors.motDePasse}</p>}
        </div>
        <div>
          <Input
            label="Confirmation du mot de passe *"
            id="confirmationMotDePasse"
            type="password"
            value={value.confirmationMotDePasse}
            onChange={set("confirmationMotDePasse")}
          />
          {errors.confirmationMotDePasse && (
            <p className="mt-1 text-xs text-[#bc0001]">{errors.confirmationMotDePasse}</p>
          )}
        </div>
      </div>
    </div>
  )
}
