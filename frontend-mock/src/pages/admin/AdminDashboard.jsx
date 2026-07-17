import { useNavigate } from "react-router-dom"
import { LogOut, ShieldCheck } from "lucide-react"
import Logo from "../../components/ui/Logo"
import { useAuth } from "../../context/AuthContext"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
        <Logo />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ebfbff] text-[#3dabc4]">
          <ShieldCheck size={28} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-[#333333]">Espace administration</h1>
        <p className="text-sm text-gray-500">
          Connecté en tant que {user?.email}. La gestion des candidats, des offres et des
          entreprises partenaires sera ajoutée dans une étape ultérieure.
        </p>
      </main>
    </div>
  )
}
