import Input from "../../ui/Input"
import Select from "../../ui/Select"
import ExtractedBadge from "../ExtractedBadge"
import {
  NIVEAUX_STAGIAIRE,
  NIVEAUX_LAUREAT,
  ANNEES_FORMATION,
  ANNEES_OBTENTION,
  ANNEES_OBTENTION_PREVUE,
} from "../../../data/wizard/options"

export default function FormationStep({ value, onChange, errors, variant, extractedFieldNames }) {
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

  const niveaux = variant === "stagiaire" ? NIVEAUX_STAGIAIRE : NIVEAUX_LAUREAT

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input label="Établissement" id="etablissement" value="CMC Nador" disabled />
      </div>

      <div>
        <Input
          label={label("Filière / Diplôme *", "filiere")}
          id="filiere"
          value={value.filiere}
          onChange={set("filiere")}
          placeholder="Ex : Développement Digital"
        />
        {errors.filiere && <p className="mt-1 text-xs text-[#bc0001]">{errors.filiere}</p>}
      </div>

      <div>
        <Select label={label("Niveau *", "niveau")} id="niveau" value={value.niveau} onChange={set("niveau")}>
          <option value="">Sélectionner...</option>
          {niveaux.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </Select>
        {errors.niveau && <p className="mt-1 text-xs text-[#bc0001]">{errors.niveau}</p>}
      </div>

      {variant === "stagiaire" ? (
        <>
          <div>
            <Select
              label="Année de formation *"
              id="anneeFormation"
              value={value.anneeFormation}
              onChange={set("anneeFormation")}
            >
              <option value="">Sélectionner...</option>
              {ANNEES_FORMATION.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            {errors.anneeFormation && <p className="mt-1 text-xs text-[#bc0001]">{errors.anneeFormation}</p>}
          </div>
          <div>
            <Select
              label="Année prévue d'obtention du diplôme *"
              id="anneeObtentionPrevue"
              value={value.anneeObtentionPrevue}
              onChange={set("anneeObtentionPrevue")}
            >
              <option value="">Sélectionner...</option>
              {ANNEES_OBTENTION_PREVUE.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            {errors.anneeObtentionPrevue && (
              <p className="mt-1 text-xs text-[#bc0001]">{errors.anneeObtentionPrevue}</p>
            )}
          </div>
          <Input
            label="Moyenne générale"
            id="moyenneGenerale"
            value={value.moyenneGenerale}
            onChange={set("moyenneGenerale")}
            placeholder="Ex : 14.5/20"
          />
          <Input label="Classement" id="classement" value={value.classement} onChange={set("classement")} />
        </>
      ) : (
        <>
          <div>
            <Select label="Année d'obtention *" id="anneeObtention" value={value.anneeObtention} onChange={set("anneeObtention")}>
              <option value="">Sélectionner...</option>
              {ANNEES_OBTENTION.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            {errors.anneeObtention && <p className="mt-1 text-xs text-[#bc0001]">{errors.anneeObtention}</p>}
          </div>
          <Input label="Mention" id="mention" value={value.mention} onChange={set("mention")} />
        </>
      )}
    </div>
  )
}
