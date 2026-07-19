import { useNavigate } from "react-router-dom"
import { Hourglass, CheckCircle2 } from "lucide-react"
import { useAuth } from "../../context/auth"
import Logo from "../../components/ui/Logo"

export default function CompteEnAttente() {
  const { user, validateAccount, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate("/espace-candidat")
    return null
  }

  function handleSimulerValidation() {
    validateAccount()
    navigate(user.profil === "laureat" ? "/dashboard/laureat" : "/dashboard/stagiaire")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ebfbff] text-[#3dabc4]">
          <Hourglass size={28} />
        </div>

        <h1 className="mb-2 text-xl font-bold text-[#333333]">Compte créé avec succès</h1>
        <p className="mb-1 text-sm text-gray-500">
          Votre compte {user.profil === "laureat" ? "lauréat" : "stagiaire"} est
        </p>
        <p className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-[#fdecee] px-4 py-1.5 text-sm font-semibold text-[#bc0001]">
          en attente de validation par l'administration du CMC
        </p>

        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Votre code d'établissement <span className="font-semibold text-[#333333]">{user.codeEtablissement}</span>{" "}
          est en cours de vérification. Vous recevrez un email de confirmation dès que votre compte
          sera validé.
        </p>

        <button
          onClick={handleSimulerValidation}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3dabc4] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f8ea3]"
        >
          <CheckCircle2 size={17} />
          Simuler la validation et accéder à mon espace
        </button>
        <button
          onClick={() => {
            logout()
            navigate("/")
          }}
          className="w-full rounded-lg px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-[#333333]"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
