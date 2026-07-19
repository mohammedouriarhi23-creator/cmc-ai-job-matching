import { createContext, useContext } from "react"

export const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider")
  return context
}

export function dashboardPathFor(user) {
  if (!user) return "/espace-candidat"
  if (user.role === "ADMIN") return "/admin"
  return user.profil === "laureat" ? "/dashboard/laureat" : "/dashboard/stagiaire"
}
