import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { LogIn } from "lucide-react"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"

export default function Login() {
  const [searchParams] = useSearchParams()
  const profil = searchParams.get("profil") === "laureat" ? "laureat" : "stagiaire"
  const [form, setForm] = useState({ email: "", motDePasse: "" })
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    login({ email: form.email || "utilisateur@exemple.com", profil })
    navigate(profil === "laureat" ? "/dashboard/laureat" : "/dashboard/stagiaire")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3dabc4] text-white">
            <LogIn size={22} />
          </div>
          <h1 className="text-xl font-bold text-[#333333]">Connexion</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connectez-vous à votre espace {profil === "laureat" ? "lauréat" : "stagiaire"}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="vous@exemple.com"
          />
          <Input
            label="Mot de passe"
            id="motDePasse"
            name="motDePasse"
            type="password"
            required
            value={form.motDePasse}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary" className="mt-2 w-full">
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link to={`/inscription/${profil}`} className="font-semibold text-[#3dabc4] hover:underline">
            Créer un compte {profil === "laureat" ? "lauréat" : "stagiaire"}
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-400">
          Ceci est une démonstration : toute connexion est simulée, aucune vérification réelle
          n'est effectuée.
        </p>
      </Card>
    </div>
  )
}
