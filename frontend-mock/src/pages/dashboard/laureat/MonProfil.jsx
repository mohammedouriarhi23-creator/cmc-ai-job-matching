import { useState } from "react"
import { Save, CheckCircle2 } from "lucide-react"
import Card from "../../../components/ui/Card"
import Input from "../../../components/ui/Input"
import Select from "../../../components/ui/Select"
import Button from "../../../components/ui/Button"
import { useAuth } from "../../../context/auth"
import { filieres, niveaux } from "../../../data/filieres"

export default function MonProfil() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    ville: user?.ville || "",
    filiere: user?.filiere || filieres[0].nom,
    niveau: user?.niveau || niveaux[1],
    annee: user?.annee || "2025",
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour le profil.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mon profil</h1>
      <p className="mb-6 text-sm text-gray-500">
        Gérez vos informations personnelles et votre parcours de formation.
      </p>

      <Card className="max-w-3xl p-7">
        {saved && (
          <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            Profil mis à jour avec succès.
          </div>
        )}
        {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Nom" id="nom" name="nom" value={form.nom} onChange={handleChange} />
          <Input label="Prénom" id="prenom" name="prenom" value={form.prenom} onChange={handleChange} />
          <Input label="Email" id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Téléphone" id="telephone" name="telephone" value={form.telephone} onChange={handleChange} />
          <Input label="Ville" id="ville" name="ville" value={form.ville} onChange={handleChange} />
          <Select label="Filière" id="filiere" name="filiere" value={form.filiere} onChange={handleChange}>
            {filieres.map((f) => (
              <option key={f.id} value={f.nom}>
                {f.nom}
              </option>
            ))}
          </Select>
          <Select label="Niveau" id="niveau" name="niveau" value={form.niveau} onChange={handleChange}>
            {niveaux.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
          <Input
            label="Année d'obtention du diplôme"
            id="annee"
            name="annee"
            value={form.annee}
            onChange={handleChange}
          />

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" disabled={saving}>
              <Save size={16} />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
