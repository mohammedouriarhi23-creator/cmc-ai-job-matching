import { GraduationCap, Trophy } from "lucide-react"
import { Link } from "react-router-dom"
import Logo from "../../components/ui/Logo"

const profils = [
  {
    id: "stagiaire",
    icon: GraduationCap,
    titre: "Stagiaire",
    description: "Je suis en formation et cherche un stage ou PFE",
  },
  {
    id: "laureat",
    icon: Trophy,
    titre: "Lauréat",
    description: "Je suis diplômé et cherche un emploi",
  },
]

export default function EspaceCandidat() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold text-[#333333]">Qui êtes-vous ?</h1>
          <p className="mt-2 text-sm text-gray-500">Choisissez votre profil</p>
        </div>

        <div className="flex flex-col gap-4">
          {profils.map((profil) => (
            <Link
              key={profil.id}
              to={`/inscription/${profil.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 p-5 transition-colors hover:border-[#3dabc4] hover:bg-[#ebfbff]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ebfbff] text-[#3dabc4] transition-colors group-hover:bg-[#3dabc4] group-hover:text-white">
                <profil.icon size={26} />
              </span>
              <div>
                <p className="font-bold text-[#333333]">{profil.titre}</p>
                <p className="text-sm text-gray-500">{profil.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Vous avez déjà un compte ?{" "}
          <Link to="/connexion" className="font-semibold text-[#3dabc4] hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}
