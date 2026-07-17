import Input from "../../ui/Input"
import Select from "../../ui/Select"
import Checkbox from "../../ui/Checkbox"
import RepeatableSection from "../RepeatableSection"
import { SKILL_LEVELS, CECRL_LEVELS } from "../../../data/wizard/options"

let uid = 0
function nextId() {
  uid += 1
  return `item-${Date.now()}-${uid}`
}

export default function CompetencesStep({ value, onChange, errors, softSkillsOptions, skillCategoryOptions }) {
  function toggleSoftSkill(skill) {
    const current = value.softSkills || []
    onChange({ softSkills: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill] })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Compétences techniques</p>
        <RepeatableSection
          items={value.competencesTechniques || []}
          onChange={(items) => onChange({ competencesTechniques: items })}
          emptyItem={() => ({ id: nextId(), nom: "", niveau: "", categorie: "" })}
          addLabel="Ajouter une compétence"
          renderItem={(item, index, update) => (
            <>
              <Input
                label="Compétence"
                value={item.nom}
                onChange={(e) => update({ nom: e.target.value })}
                placeholder="Ex : React"
              />
              <Select label="Niveau" value={item.niveau} onChange={(e) => update({ niveau: e.target.value })}>
                <option value="">Sélectionner...</option>
                {SKILL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
              {skillCategoryOptions && (
                <div className="sm:col-span-2">
                  <Select
                    label="Catégorie"
                    value={item.categorie}
                    onChange={(e) => update({ categorie: e.target.value })}
                  >
                    <option value="">Sélectionner...</option>
                    {skillCategoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </>
          )}
        />
        {errors.competencesTechniques && (
          <p className="mt-2 text-xs text-[#bc0001]">{errors.competencesTechniques}</p>
        )}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Langues</p>
        <RepeatableSection
          items={value.langues || []}
          onChange={(items) => onChange({ langues: items })}
          emptyItem={() => ({ id: nextId(), langue: "", niveau: "" })}
          addLabel="Ajouter une langue"
          renderItem={(item, index, update) => (
            <>
              <Input
                label="Langue"
                value={item.langue}
                onChange={(e) => update({ langue: e.target.value })}
                placeholder="Ex : Français"
              />
              <Select label="Niveau CECRL" value={item.niveau} onChange={(e) => update({ niveau: e.target.value })}>
                <option value="">Sélectionner...</option>
                {CECRL_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </>
          )}
        />
        {errors.langues && <p className="mt-2 text-xs text-[#bc0001]">{errors.langues}</p>}
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Soft skills</p>
        <div className="flex flex-wrap gap-2.5">
          {softSkillsOptions.map((skill) => (
            <Checkbox
              key={skill}
              label={skill}
              id={`softskill-${skill}`}
              checked={(value.softSkills || []).includes(skill)}
              onChange={() => toggleSoftSkill(skill)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
