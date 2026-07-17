import Input from "../../ui/Input"
import Select from "../../ui/Select"
import Textarea from "../../ui/Textarea"
import FileUpload from "../../ui/FileUpload"
import RepeatableSection from "../RepeatableSection"

let uid = 0
function nextId() {
  uid += 1
  return `item-${Date.now()}-${uid}`
}

export default function ParcoursStep({ value, onChange, experienceTypeOptions, titreLabel, organismeLabel, showLienDemo }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Expériences</p>
        <RepeatableSection
          items={value.experiences || []}
          onChange={(items) => onChange({ experiences: items })}
          emptyItem={() => ({
            id: nextId(),
            titre: "",
            organisme: "",
            type: "",
            dateDebut: "",
            dateFin: "",
            description: "",
            competencesAcquises: "",
          })}
          addLabel="Ajouter une expérience"
          renderItem={(item, index, update) => (
            <>
              <Input label={titreLabel} value={item.titre} onChange={(e) => update({ titre: e.target.value })} />
              <Input
                label={organismeLabel}
                value={item.organisme}
                onChange={(e) => update({ organisme: e.target.value })}
              />
              <Select label="Type" value={item.type} onChange={(e) => update({ type: e.target.value })}>
                <option value="">Sélectionner...</option>
                {experienceTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date début"
                  type="date"
                  value={item.dateDebut}
                  onChange={(e) => update({ dateDebut: e.target.value })}
                />
                <Input
                  label="Date fin"
                  type="date"
                  value={item.dateFin}
                  onChange={(e) => update({ dateFin: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  rows={2}
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Compétences acquises"
                  value={item.competencesAcquises}
                  onChange={(e) => update({ competencesAcquises: e.target.value })}
                  placeholder="Séparées par des virgules"
                />
              </div>
            </>
          )}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Projets</p>
        <RepeatableSection
          items={value.projets || []}
          onChange={(items) => onChange({ projets: items })}
          emptyItem={() => ({ id: nextId(), nom: "", description: "", technologies: "", lienGithub: "", lienDemo: "" })}
          addLabel="Ajouter un projet"
          renderItem={(item, index, update) => (
            <>
              <Input label="Nom du projet" value={item.nom} onChange={(e) => update({ nom: e.target.value })} />
              <Input
                label="Technologies"
                value={item.technologies}
                onChange={(e) => update({ technologies: e.target.value })}
                placeholder="Ex : React, Node.js"
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  rows={2}
                  value={item.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </div>
              <Input
                label={showLienDemo ? "Lien GitHub" : "Lien GitHub / Portfolio"}
                value={item.lienGithub}
                onChange={(e) => update({ lienGithub: e.target.value })}
                placeholder="https://github.com/..."
              />
              {showLienDemo && (
                <Input
                  label="Lien démo"
                  value={item.lienDemo}
                  onChange={(e) => update({ lienDemo: e.target.value })}
                  placeholder="https://..."
                />
              )}
            </>
          )}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-gray-800">Certifications</p>
        <RepeatableSection
          items={value.certifications || []}
          onChange={(items) => onChange({ certifications: items })}
          emptyItem={() => ({ id: nextId(), nom: "", organisme: "", date: "", fichier: null })}
          addLabel="Ajouter une certification"
          renderItem={(item, index, update) => (
            <>
              <Input label="Nom" value={item.nom} onChange={(e) => update({ nom: e.target.value })} />
              <Input
                label="Organisme"
                value={item.organisme}
                onChange={(e) => update({ organisme: e.target.value })}
              />
              <Input label="Date" type="date" value={item.date} onChange={(e) => update({ date: e.target.value })} />
              <FileUpload
                id={`cert-${item.id}`}
                value={item.fichier}
                onChange={(file) => update({ fichier: file })}
                accept=".pdf"
              />
            </>
          )}
        />
      </div>
    </div>
  )
}
