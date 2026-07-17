import { useEffect, useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react"
import Logo from "../ui/Logo"
import Button from "../ui/Button"
import { useAuth, dashboardPathFor } from "../../context/AuthContext"

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/offres", label: "Offres" },
  { to: "/entreprises", label: "Entreprises" },
  { to: "/a-propos", label: "À propos" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState("FR")
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === "/"
  const transparent = isHome && !scrolled

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleLogout() {
    logout()
    setOpen(false)
    navigate("/")
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        transparent ? "bg-transparent" : "bg-white/95 backdrop-blur shadow-sm"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Logo light={transparent} />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  transparent
                    ? isActive
                      ? "text-white bg-white/15"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                    : isActive
                      ? "text-[#3dabc4] bg-[#ebfbff]"
                      : "text-gray-600 hover:text-[#3dabc4] hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setLang((l) => (l === "FR" ? "AR" : "FR"))}
            className={`flex items-center rounded-full border p-0.5 text-xs font-bold ${
              transparent ? "border-white/40" : "border-gray-300"
            }`}
            aria-label="Changer de langue"
          >
            <span
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === "FR"
                  ? "bg-[#3dabc4] text-white"
                  : transparent
                    ? "text-white/70"
                    : "text-gray-500"
              }`}
            >
              FR
            </span>
            <span
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === "AR"
                  ? "bg-[#3dabc4] text-white"
                  : transparent
                    ? "text-white/70"
                    : "text-gray-500"
              }`}
            >
              AR
            </span>
          </button>

          {user ? (
            <>
              <Button
                to={dashboardPathFor(user)}
                variant={transparent ? "outline-white" : "outline"}
                size="sm"
              >
                <LayoutDashboard size={16} />
                Mon espace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={transparent ? "text-white hover:bg-white/10" : ""}
              >
                <LogOut size={16} />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button to="/connexion" variant={transparent ? "outline-white" : "outline"} size="sm">
                Se connecter
              </Button>
              <Button to="/espace-candidat" variant="accent" size="sm">
                Espace Candidat
              </Button>
            </>
          )}
        </div>

        <button
          className={`p-2 lg:hidden ${transparent ? "text-white" : "text-gray-700"}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3.5 py-2.5 text-sm font-medium ${
                    isActive ? "text-[#3dabc4] bg-[#ebfbff]" : "text-gray-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Button
                  to={dashboardPathFor(user)}
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Mon espace
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button to="/connexion" variant="outline" onClick={() => setOpen(false)}>
                  Se connecter
                </Button>
                <Button to="/espace-candidat" variant="accent" onClick={() => setOpen(false)}>
                  Espace Candidat
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
