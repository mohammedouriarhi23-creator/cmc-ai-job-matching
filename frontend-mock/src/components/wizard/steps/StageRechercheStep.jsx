import Input from "../../ui/Input"
import Select from "../../ui/Select"
import Checkbox from "../../ui/Checkbox"
import { TYPES_STAGE } from "../../../data/wizard/options"

export default function StageRechercheStep({ value, onChange, errors }) {
  function set(name) {
    return (e) => onChange({ [name]: e.target.value })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Select label="Type de stage *" id="typeStage" value={value.typeStage} onChange={set("typeStage")}>
          <option value="">Sélectionner...</option>
          {TYPES_STAGE.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        {errors.typeStage && <p className="mt-1 text-xs text-[#bc0001]">{errors.typeStage}</p>}
      </div>

      <div>
        <Input
          label="Domaine recherché *"
          id="domaineRecherche"
          value={value.domaineRecherche}
          onChange={set("domaineRecherche")}
          placeholder="Ex : Développement web"
        />
        {errors.domaineRecherche && <p className="mt-1 text-xs text-[#bc0001]">{errors.domaineRecherche}</p>}
      </div>

      <div>
        <Input
          label="Date de disponibilité *"
          id="dateDisponibilite"
          type="date"
          value={value.dateDisponibilite}
          onChange={set("dateDisponibilite")}
        />
        {errors.dateDisponibilite && <p className="mt-1 text-xs text-[#bc0001]">{errors.dateDisponibilite}</p>}
      </div>

      <div>
        <Input
          label="Durée souhaitée *"
          id="dureeSouhaitee"
          value={value.dureeSouhaitee}
          onChange={set("dureeSouhaitee")}
          placeholder="Ex : 3 mois"
        />
        {errors.dureeSouhaitee && <p className="mt-1 text-xs text-[#bc0001]">{errors.dureeSouhaitee}</p>}
      </div>

      <Input
        label="Disponibilité géographique"
        id="disponibiliteGeographique"
        value={value.disponibiliteGeographique}
        onChange={set("disponibiliteGeographique")}
        placeholder="Ex : Oujda et environs"
      />

      <Select label="Mobilité" id="mobilite" value={value.mobilite} onChange={set("mobilite")}>
        <option value="">Non précisé</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </Select>

      <div className="sm:col-span-2 flex flex-wrap gap-3">
        <Checkbox
          label="Permis de conduire"
          id="permisConduire"
          checked={value.permisConduire}
          onChange={(e) => onChange({ permisConduire: e.target.checked })}
        />
        <Checkbox
          label="Véhicule personnel"
          id="vehiculePersonnel"
          checked={value.vehiculePersonnel}
          onChange={(e) => onChange({ vehiculePersonnel: e.target.checked })}
        />
      </div>
    </div>
  )
}
