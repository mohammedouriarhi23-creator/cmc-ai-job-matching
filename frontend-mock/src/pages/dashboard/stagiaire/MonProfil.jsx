import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import Card from "../../../components/ui/Card"
import Input from "../../../components/ui/Input"
import Select from "../../../components/ui/Select"
import Button from "../../../components/ui/Button"
import { useAuth } from "../../../context/AuthContext"
import { filieres, cmcList } from "../../../data/filieres"

export default function MonProfil() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    filiere: user?.filiere || filieres[0].nom,
    specialite: user?.specialite || "",
    cmc: user?.cmc || cmcList[0],
    annee: user?.annee || "2ème année",
  })
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mon profil</h1>
      <p className="mb-6 text-sm text-gray-500">
        Gérez vos informations personnelles et votre formation.
      </p>

      <Card className="max-w-3xl p-7">
        {saved && (
          <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            Profil mis à jour avec succès.
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Nom" id="nom" name="nom" value={form.nom} onChange={handleChange} />
          <Input label="Prénom" id="prenom" name="prenom" value={form.prenom} onChange={handleChange} />
          <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Téléphone" id="telephone" name="telephone" value={form.telephone} onChange={handleChange} />
          <Select label="Filière" id="filiere" name="filiere" value={form.filiere} onChange={handleChange}>
            {filieres.map((f) => (
              <option key={f.id} value={f.nom}>
                {f.nom}
              </option>
            ))}
          </Select>
          <Input
            label="Spécialité"
            id="specialite"
            name="specialite"
            value={form.specialite}
            onChange={handleChange}
          />
          <Select label="CMC de rattachement" id="cmc" name="cmc" value={form.cmc} onChange={handleChange}>
            {cmcList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input label="Année de formation" id="annee" name="annee" value={form.annee} onChange={handleChange} />

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">
              <Save size={16} />
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
