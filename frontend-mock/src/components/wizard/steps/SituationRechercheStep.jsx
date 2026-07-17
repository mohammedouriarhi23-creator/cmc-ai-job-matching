import Input from "../../ui/Input"
import Select from "../../ui/Select"
import Checkbox from "../../ui/Checkbox"
import {
  SITUATIONS_ACTUELLES,
  NIVEAUX_ETUDES_POURSUITE,
  TYPES_OPPORTUNITE,
  DISPONIBILITES,
} from "../../../data/wizard/options"

export default function SituationRechercheStep({ value, onChange, errors }) {
  function set(name) {
    return (e) => onChange({ [name]: e.target.value })
  }

  function toggleOpportunite(type) {
    const current = value.typesOpportunite || []
    onChange({
      typesOpportunite: current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    })
  }

  const poursuiteEtudes = value.situationActuelle === "Poursuite d'études"

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Select
            label="Situation actuelle *"
            id="situationActuelle"
            value={value.situationActuelle}
            onChange={set("situationActuelle")}
          >
            <option value="">Sélectionner...</option>
            {SITUATIONS_ACTUELLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          {errors.situationActuelle && <p className="mt-1 text-xs text-[#bc0001]">{errors.situationActuelle}</p>}
        </div>

        {poursuiteEtudes && (
          <>
            <div>
              <Input
                label="Université / École *"
                id="universiteEcole"
                value={value.universiteEcole}
                onChange={set("universiteEcole")}
              />
              {errors.universiteEcole && <p className="mt-1 text-xs text-[#bc0001]">{errors.universiteEcole}</p>}
            </div>
            <div>
              <Input
                label="Formation actuelle *"
                id="formationActuelle"
                value={value.formationActuelle}
                onChange={set("formationActuelle")}
              />
              {errors.formationActuelle && <p className="mt-1 text-xs text-[#bc0001]">{errors.formationActuelle}</p>}
            </div>
            <div>
              <Select
                label="Niveau *"
                id="niveauEtudesPoursuite"
                value={value.niveauEtudesPoursuite}
                onChange={set("niveauEtudesPoursuite")}
              >
                <option value="">Sélectionner...</option>
                {NIVEAUX_ETUDES_POURSUITE.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
              {errors.niveauEtudesPoursuite && (
                <p className="mt-1 text-xs text-[#bc0001]">{errors.niveauEtudesPoursuite}</p>
              )}
            </div>
            <div>
              <Input label="Année d'étude *" id="anneeEtude" value={value.anneeEtude} onChange={set("anneeEtude")} />
              {errors.anneeEtude && <p className="mt-1 text-xs text-[#bc0001]">{errors.anneeEtude}</p>}
            </div>
          </>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Type d'opportunité recherchée</p>
        <div className="flex flex-wrap gap-2.5">
          {TYPES_OPPORTUNITE.map((type) => (
            <Checkbox
              key={type}
              label={type}
              id={`opportunite-${type}`}
              checked={(value.typesOpportunite || []).includes(type)}
              onChange={() => toggleOpportunite(type)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Select label="Disponibilité" id="disponibilite" value={value.disponibilite} onChange={set("disponibilite")}>
            <option value="">Sélectionner...</option>
            {DISPONIBILITES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>
        {value.disponibilite === "Date précise" && (
          <Input
            label="Date précise"
            id="dateDisponibilitePrecise"
            type="date"
            value={value.dateDisponibilitePrecise}
            onChange={set("dateDisponibilitePrecise")}
          />
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Mobilité</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Ville souhaitée"
            id="villeSouhaitee"
            value={value.villeSouhaitee}
            onChange={set("villeSouhaitee")}
          />
          <Input
            label="Régions acceptées"
            id="regionsAcceptees"
            value={value.regionsAcceptees}
            onChange={set("regionsAcceptees")}
          />
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Checkbox
              label="Mobilité nationale"
              id="mobiliteNationale"
              checked={value.mobiliteNationale}
              onChange={(e) => onChange({ mobiliteNationale: e.target.checked })}
            />
            <Checkbox
              label="Mobilité internationale"
              id="mobiliteInternationale"
              checked={value.mobiliteInternationale}
              onChange={(e) => onChange({ mobiliteInternationale: e.target.checked })}
            />
            <Checkbox
              label="Permis B"
              id="permisB"
              checked={value.permisB}
              onChange={(e) => onChange({ permisB: e.target.checked })}
            />
            <Checkbox
              label="Véhicule personnel"
              id="vehiculePersonnel"
              checked={value.vehiculePersonnel}
              onChange={(e) => onChange({ vehiculePersonnel: e.target.checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
