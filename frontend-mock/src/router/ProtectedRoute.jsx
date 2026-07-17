import { Navigate } from "react-router-dom"
import { useAuth, dashboardPathFor } from "../context/AuthContext"

export default function ProtectedRoute({ role, profil, children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/espace-candidat" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={dashboardPathFor(user)} replace />
  }

  if (profil && user.profil !== profil) {
    return <Navigate to={dashboardPathFor(user)} replace />
  }

  return children
}
