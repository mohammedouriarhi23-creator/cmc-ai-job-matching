import Input from "../../ui/Input"
import Select from "../../ui/Select"
import Textarea from "../../ui/Textarea"
import Checkbox from "../../ui/Checkbox"
import FileUpload from "../../ui/FileUpload"
import ExtractedBadge from "../ExtractedBadge"
import { CENTRES_INTERET, SECTEURS, MODES_TRAVAIL } from "../../../data/wizard/options"

export default function DocumentsProfilStep({
  value,
  onChange,
  errors,
  documentFields,
  consentFields,
  variant,
  extractedFieldNames,
}) {
  function set(name) {
    return (e) => onChange({ [name]: e.target.value })
  }

  function toggleInteret(interet) {
    const current = value.centresInteret || []
    onChange({
      centresInteret: current.includes(interet) ? current.filter((i) => i !== interet) : [...current, interet],
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Documents</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {documentFields.map((doc) => (
            <FileUpload
              key={doc.key}
              id={doc.key}
              label={doc.label}
              required={doc.required}
              value={value[doc.key]}
              onChange={(file, error) => onChange({ [doc.key]: file, [`${doc.key}Error`]: error })}
              error={value[`${doc.key}Error`] || errors[doc.key]}
            />
          ))}
        </div>
      </div>

      {variant === "stagiaire" && (
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-800">Centres d'intérêt</p>
          <div className="flex flex-wrap gap-2.5">
            {CENTRES_INTERET.map((interet) => (
              <Checkbox
                key={interet}
                label={interet}
                id={`interet-${interet}`}
                checked={(value.centresInteret || []).includes(interet)}
                onChange={() => toggleInteret(interet)}
              />
            ))}
          </div>
          <div className="mt-3">
            <Input
              label="Autre"
              id="centresInteretAutre"
              value={value.centresInteretAutre}
              onChange={set("centresInteretAutre")}
            />
          </div>
        </div>
      )}

      {variant === "stagiaire" && (
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-800">Préférences professionnelles</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Secteur" id="secteur" value={value.secteur} onChange={set("secteur")}>
              <option value="">Sélectionner...</option>
              {SECTEURS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Input label="Métier" id="metier" value={value.metier} onChange={set("metier")} />
            <Input
              label="Salaire souhaité"
              id="salaireSouhaite"
              value={value.salaireSouhaite}
              onChange={set("salaireSouhaite")}
            />
            <Select label="Mode de travail" id="modeTravail" value={value.modeTravail} onChange={set("modeTravail")}>
              <option value="">Sélectionner...</option>
              {MODES_TRAVAIL.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div>
        <Textarea
          label={
            <>
              {variant === "stagiaire" ? "Présentation libre" : "Présentation professionnelle *"}
              {extractedFieldNames?.has("presentation") && <ExtractedBadge />}
            </>
          }
          id="presentation"
          rows={5}
          minLength={variant === "stagiaire" ? undefined : 500}
          maxLength={1000}
          showCount
          value={value.presentation}
          onChange={set("presentation")}
          placeholder={variant === "stagiaire" ? "Facultatif — 500 à 1000 caractères si renseigné" : "500 à 1000 caractères"}
        />
        {errors.presentation && <p className="mt-1 text-xs text-[#bc0001]">{errors.presentation}</p>}
      </div>

      {variant === "stagiaire" && (
        <>
          <Textarea
            label="Pourquoi ce stage ?"
            id="pourquoiCeStage"
            rows={3}
            value={value.pourquoiCeStage}
            onChange={set("pourquoiCeStage")}
          />
          <Textarea
            label="Ce qui vous distingue"
            id="ceQuiVousDistingue"
            rows={3}
            value={value.ceQuiVousDistingue}
            onChange={set("ceQuiVousDistingue")}
          />
        </>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Consentements</p>
        <div className="flex flex-col gap-2.5">
          {consentFields.map((consent) => (
            <Checkbox
              key={consent.key}
              label={consent.label}
              id={consent.key}
              checked={value[consent.key] || false}
              onChange={(e) => onChange({ [consent.key]: e.target.checked })}
            />
          ))}
        </div>
        {errors.consentements && <p className="mt-1 text-xs text-[#bc0001]">{errors.consentements}</p>}
      </div>
    </div>
  )
}
