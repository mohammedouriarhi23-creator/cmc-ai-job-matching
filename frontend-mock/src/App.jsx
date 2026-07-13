import { BrowserRouter, Routes, Route } from "react-router-dom"
import {
  User,
  FileText,
  Search,
  ClipboardList,
  Bell,
  BookOpen,
} from "lucide-react"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./router/ProtectedRoute"

import PublicLayout from "./components/layout/PublicLayout"
import DashboardLayout from "./components/layout/DashboardLayout"

import Home from "./pages/public/Home"
import Offres from "./pages/public/Offres"
import OffreDetail from "./pages/public/OffreDetail"
import Entreprises from "./pages/public/Entreprises"
import About from "./pages/public/About"
import Contact from "./pages/public/Contact"
import Faq from "./pages/public/Faq"

import EspaceCandidat from "./pages/auth/EspaceCandidat"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import CompteEnAttente from "./pages/auth/CompteEnAttente"

import StagiaireProfil from "./pages/dashboard/stagiaire/MonProfil"
import StagiaireCV from "./pages/dashboard/stagiaire/MonCV"
import StagiaireRechercher from "./pages/dashboard/stagiaire/Rechercher"
import StagiaireCandidatures from "./pages/dashboard/stagiaire/MesCandidatures"
import StagiaireNotifications from "./pages/dashboard/stagiaire/Notifications"

import LaureatProfil from "./pages/dashboard/laureat/MonProfil"
import LaureatCV from "./pages/dashboard/laureat/MonCV"
import LaureatRechercher from "./pages/dashboard/laureat/Rechercher"
import LaureatCandidatures from "./pages/dashboard/laureat/MesCandidatures"
import LaureatNotifications from "./pages/dashboard/laureat/Notifications"
import LaureatRessources from "./pages/dashboard/laureat/Ressources"

const stagiaireNavItems = [
  { to: "/dashboard/stagiaire", label: "Mon profil", icon: User, end: true },
  { to: "/dashboard/stagiaire/cv", label: "Mon CV", icon: FileText },
  { to: "/dashboard/stagiaire/rechercher", label: "Rechercher un stage/PFE", icon: Search },
  { to: "/dashboard/stagiaire/candidatures", label: "Mes candidatures", icon: ClipboardList },
  { to: "/dashboard/stagiaire/notifications", label: "Notifications", icon: Bell },
]

const laureatNavItems = [
  { to: "/dashboard/laureat", label: "Mon profil", icon: User, end: true },
  { to: "/dashboard/laureat/cv", label: "Mon CV", icon: FileText },
  { to: "/dashboard/laureat/rechercher", label: "Rechercher un emploi", icon: Search },
  { to: "/dashboard/laureat/candidatures", label: "Mes candidatures", icon: ClipboardList },
  { to: "/dashboard/laureat/ressources", label: "Ressources carrière", icon: BookOpen },
  { to: "/dashboard/laureat/notifications", label: "Notifications", icon: Bell },
]

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/offres" element={<Offres />} />
            <Route path="/offres/:id" element={<OffreDetail />} />
            <Route path="/entreprises" element={<Entreprises />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription/:profil" element={<Register />} />
          </Route>

          <Route path="/espace-candidat" element={<EspaceCandidat />} />
          <Route path="/compte-en-attente" element={<CompteEnAttente />} />

          <Route
            path="/dashboard/stagiaire"
            element={
              <ProtectedRoute profil="stagiaire">
                <DashboardLayout navItems={stagiaireNavItems} title="Espace stagiaire" />
              </ProtectedRoute>
            }
          >
            <Route index element={<StagiaireProfil />} />
            <Route path="cv" element={<StagiaireCV />} />
            <Route path="rechercher" element={<StagiaireRechercher />} />
            <Route path="candidatures" element={<StagiaireCandidatures />} />
            <Route path="notifications" element={<StagiaireNotifications />} />
          </Route>

          <Route
            path="/dashboard/laureat"
            element={
              <ProtectedRoute profil="laureat">
                <DashboardLayout navItems={laureatNavItems} title="Espace lauréat" />
              </ProtectedRoute>
            }
          >
            <Route index element={<LaureatProfil />} />
            <Route path="cv" element={<LaureatCV />} />
            <Route path="rechercher" element={<LaureatRechercher />} />
            <Route path="candidatures" element={<LaureatCandidatures />} />
            <Route path="ressources" element={<LaureatRessources />} />
            <Route path="notifications" element={<LaureatNotifications />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
