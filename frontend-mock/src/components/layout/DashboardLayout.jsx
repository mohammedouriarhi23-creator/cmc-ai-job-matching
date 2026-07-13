import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Menu, LogOut } from "lucide-react"
import Sidebar from "./Sidebar"
import Logo from "../ui/Logo"
import { useAuth } from "../../context/AuthContext"

export default function DashboardLayout({ navItems, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-gray-600 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
          <Logo />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.prenom} {user?.nom}
            </p>
            <p className="text-xs text-gray-500">{title}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">
            {user?.prenom?.[0]}
            {user?.nom?.[0]}
          </div>
          <button
            onClick={handleLogout}
            className="hidden items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 sm:flex"
          >
            <LogOut size={15} />
            Quitter
          </button>
        </div>
      </header>

      <div className="flex">
        <Sidebar items={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
