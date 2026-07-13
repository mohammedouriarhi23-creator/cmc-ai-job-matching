import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login({ email, profil }) {
    const prenom = email.split("@")[0].split(".")[0] || "Utilisateur"
    setUser({
      email,
      profil: profil || "stagiaire",
      statut: "valide",
      prenom: prenom.charAt(0).toUpperCase() + prenom.slice(1),
      nom: "Bennani",
      telephone: "06 12 34 56 78",
      codeEtablissement: "CMC-ORIENTAL-0452",
      matricule: "T-20458",
      numeroDiplome: "L-20231190",
      filiere: "Développement Digital",
      specialite: "Développement Digital - Full Stack",
      cmc: "CMC Oujda",
      annee: profil === "laureat" ? "2025" : "2ème année",
      niveau: "Technicien Spécialisé",
      cvNomFichier: null,
    })
  }

  function register(data) {
    setUser({ ...data, statut: "en_attente" })
  }

  function validateAccount() {
    setUser((prev) => (prev ? { ...prev, statut: "valide" } : prev))
  }

  function updateProfile(partial) {
    setUser((prev) => ({ ...prev, ...partial }))
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile, validateAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider")
  return ctx
}
