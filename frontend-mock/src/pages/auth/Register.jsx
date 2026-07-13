import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserPlus, ShieldCheck } from "lucide-react"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import Button from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"
import { filieres, cmcList, niveaux } from "../../data/filieres"

const anneesFormation = ["1ère année", "2ème année"]
const anneesObtention = ["2023", "2024", "2025", "2026"]
const CODE_ETABLISSEMENT_REGEX = /^CMC-ORIENTAL-\d{4}$/

export default function Register() {
  const { profil: profilParam } = useParams()
  const profil = profilParam === "laureat" ? "laureat" : "stagiaire"
  const navigate = useNavigate()
  const { register } = useAuth()
  const [erreurCode, setErreurCode] = useState("")

  const [form, setForm] = useState({
    codeEtablissement: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    matricule: "",
    numeroDiplome: "",
    filiere: filieres[0].id,
    specialite: filieres[0].specialites[0],
    cmc: cmcList[0],
    annee: profil === "laureat" ? anneesObtention[anneesObtention.length - 1] : anneesFormation[0],
    niveau: niveaux[1],
  })

  const filiereActuelle = filieres.find((f) => f.id === form.filiere) || filieres[0]

  function handleChange(e) {
    const { name, value } = e.target
    if (name === "filiere") {
      const nouvelleFiliere = filieres.find((f) => f.id === value)
      setForm((prev) => ({
        ...prev,
        filiere: value,
        specialite: nouvelleFiliere?.specialites[0] || "",
      }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!CODE_ETABLISSEMENT_REGEX.test(form.codeEtablissement.trim())) {
      setErreurCode("Format attendu : CMC-ORIENTAL-XXXX (4 chiffres)")
      return
    }
    setErreurCode("")

    register({
      ...form,
      profil,
      filiere: filiereActuelle.nom,
      cvNomFichier: null,
    })
    navigate("/compte-en-attente")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#bc0001] text-white">
            <UserPlus size={22} />
          </div>
          <h1 className="text-xl font-bold text-[#333333]">
            Créer un compte {profil === "laureat" ? "lauréat" : "stagiaire"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Renseignez vos informations pour accéder à votre espace personnel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Code d'établissement"
              id="codeEtablissement"
              name="codeEtablissement"
              required
              value={form.codeEtablissement}
              onChange={handleChange}
              placeholder="CMC-ORIENTAL-0452"
            />
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={13} />
              Fourni par votre CMC. Format : CMC-ORIENTAL-XXXX
            </p>
            {erreurCode && <p className="mt-1 text-xs font-medium text-[#bc0001]">{erreurCode}</p>}
          </div>

          <Input
            label="Nom"
            id="nom"
            name="nom"
            required
            value={form.nom}
            onChange={handleChange}
          />
          <Input
            label="Prénom"
            id="prenom"
            name="prenom"
            required
            value={form.prenom}
            onChange={handleChange}
          />
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Téléphone"
            id="telephone"
            name="telephone"
            required
            value={form.telephone}
            onChange={handleChange}
            placeholder="06 XX XX XX XX"
          />

          {profil === "stagiaire" ? (
            <Input
              label="Matricule / CNE"
              id="matricule"
              name="matricule"
              required
              value={form.matricule}
              onChange={handleChange}
              placeholder="Ex: T-20458"
            />
          ) : (
            <Input
              label="Numéro de diplôme"
              id="numeroDiplome"
              name="numeroDiplome"
              required
              value={form.numeroDiplome}
              onChange={handleChange}
              placeholder="Ex: L-20231190"
            />
          )}

          <Select label="Filière" id="filiere" name="filiere" value={form.filiere} onChange={handleChange}>
            {filieres.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </Select>

          <Select
            label="Spécialité"
            id="specialite"
            name="specialite"
            value={form.specialite}
            onChange={handleChange}
          >
            {filiereActuelle.specialites.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          {profil === "stagiaire" ? (
            <>
              <Select
                label="Année de formation"
                id="annee"
                name="annee"
                value={form.annee}
                onChange={handleChange}
              >
                {anneesFormation.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
              <Select label="CMC de rattachement" id="cmc" name="cmc" value={form.cmc} onChange={handleChange}>
                {cmcList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <>
              <Select
                label="Année d'obtention du diplôme"
                id="annee"
                name="annee"
                value={form.annee}
                onChange={handleChange}
              >
                {anneesObtention.map((a) => (
                  <option key={a} value={a}>
                    {a}
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
            </>
          )}

          <div className="sm:col-span-2">
            <Input
              label="Mot de passe"
              id="motDePasse"
              name="motDePasse"
              type="password"
              required
              placeholder="••••••••"
              onChange={() => {}}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" variant="accent" className="w-full">
              Créer mon compte
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà inscrit ?{" "}
          <Link to={`/connexion?profil=${profil}`} className="font-semibold text-[#3dabc4] hover:underline">
            Connectez-vous
          </Link>
        </p>
      </Card>
    </div>
  )
}
