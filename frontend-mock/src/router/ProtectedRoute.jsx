import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ profil, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/espace-candidat" replace />
  }

  if (user.statut === "en_attente") {
    return <Navigate to="/compte-en-attente" replace />
  }

  if (profil && user.profil !== profil) {
    return (
      <Navigate
        to={user.profil === "laureat" ? "/dashboard/laureat" : "/dashboard/stagiaire"}
        replace
      />
    )
  }

  return children
}
