import { createContext, useContext, useEffect, useState } from "react"

import {
  authApi,
  candidateProfileApi,
  getToken,
  setToken,
  clearToken,
} from "../lib/api"

const AuthContext = createContext(null)

function normalizeUser(apiUser) {
  const profile = apiUser.candidate_profile
  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    profil: profile?.candidate_type === "LAUREAT" ? "laureat" : "stagiaire",
    prenom: profile?.first_name ?? "",
    nom: profile?.last_name ?? "",
    telephone: profile?.phone ?? "",
    profileStatus: profile?.profile_status ?? null,
    cvNomFichier: null,
  }
}

function serializeWizardData(value) {
  if (Array.isArray(value)) {
    return value.map(serializeWizardData)
  }

  if (
    value &&
    typeof value === "object"
  ) {
    if (value instanceof File) {
      return {
        name: value.name,
        size: value.size,
        type: value.type,
      }
    }

    if (
      "file" in value &&
      "name" in value
    ) {
      return {
        name: value.name,
        size: value.size ?? null,
        type: value.type ?? null,
      }
    }

    return Object.fromEntries(
      Object.entries(value).map(
        ([key, item]) => [
          key,
          serializeWizardData(item),
        ]
      )
    )
  }

  return value
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!getToken()) {
    setLoading(false)
    return
  }

  authApi
    .me()
    .then(async (apiUser) => {
      const normalized =
        normalizeUser(apiUser)

      const completeUser =
        await loadCompleteProfile(
          normalized
        )

      setUser(completeUser)
    })
    .catch(() => {
      clearToken()
      setUser(null)
    })
    .finally(() => {
      setLoading(false)
    })
}, [])

async function login(email, password) {
  const { access_token } =
    await authApi.login(email, password)

  setToken(access_token)

  const apiUser = await authApi.me()
  const normalized =
    normalizeUser(apiUser)

  const completeUser =
    await loadCompleteProfile(
      normalized
    )

  setUser(completeUser)

  return completeUser
}

  // `payload` = { profil, identite, ...autresEtapesDuWizard }. Seuls les champs
  // email/mot de passe/nom/prénom/téléphone sont connus du backend aujourd'hui ;
  // tout le reste (formation, compétences, documents...) est fusionné côté client
  // via updateProfile en attendant les modèles backend de l'Étape 16.
  async function register({
  profil,
  identite,
  ...wizardSections
}) {
  const {
    motDePasse,
    confirmationMotDePasse,
    ...identitePublic
  } = identite

  await authApi.register({
    email: identite.email,
    password: motDePasse,
    first_name: identite.prenom,
    last_name: identite.nom,
    candidate_type:
      profil === "laureat"
        ? "LAUREAT"
        : "STAGIAIRE",
    phone: identite.telephone || null,
    city: identite.ville || null,
  })

  const connectedUser = await login(
    identite.email,
    motDePasse
  )

  const fullWizardData = serializeWizardData({
    profil,
    identite: identitePublic,
    ...wizardSections,
    cmc: "CMC Nador",
  })

  const documents =
    wizardSections.documentsProfil || {}

  const cvFileName =
    documents.cv?.name ||
    documents.cv?.file?.name ||
    null

  const savedProfile =
    await candidateProfileApi.save({
      cv_file_name: cvFileName,
      profile_data: fullWizardData,
    })

  setUser((previousUser) => ({
    ...previousUser,
    ...fullWizardData,
    cvNomFichier:
      savedProfile.cv_file_name,
    profileStatus: "COMPLETED",
  }))

  return connectedUser
}

  function logout() {
    clearToken()
    setUser(null)
  }

  // Champs non gérés par le backend pour l'instant (filière, CMC, matricule...).
  // Fusionnés côté client seulement, en attendant les modèles de l'Étape 16.
  function updateProfile(partial) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider")
  return ctx
}

export function dashboardPathFor(user) {
  if (!user) return "/espace-candidat"
  if (user.role === "ADMIN") return "/admin"
  return user.profil === "laureat" ? "/dashboard/laureat" : "/dashboard/stagiaire"
}


async function loadCompleteProfile(
  normalizedUser
) {
  try {
    const storedProfile =
      await candidateProfileApi.get()

    return {
      ...normalizedUser,
      ...storedProfile.profile_data,
      cvNomFichier:
        storedProfile.cv_file_name,
      profileStatus: "COMPLETED",
    }
  } catch (error) {
    if (error.status === 404) {
      return normalizedUser
    }

    throw error
  }
}