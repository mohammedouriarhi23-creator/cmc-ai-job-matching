import { useEffect, useState } from "react"

import {
  authApi,
  candidateProfileApi,
  getToken,
  setToken,
  clearToken,
} from "../lib/api"
import { AuthContext } from "./auth"

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
    ville: profile?.city ?? "",
    profileStatus: profile?.profile_status ?? null,
    cvNomFichier: null,
    documents: [],
    profileData: null,
  }
}

function serializeWizardData(value) {
  if (Array.isArray(value)) return value.map(serializeWizardData)
  if (value && typeof value === "object") {
    if (value instanceof File) {
      return { name: value.name, size: value.size, type: value.type }
    }
    if ("file" in value && "name" in value) {
      return { name: value.name, size: value.size ?? null, type: value.type ?? null }
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeWizardData(item)])
    )
  }
  return value
}

function mergeStoredProfile(normalizedUser, storedProfile) {
  const profileData = storedProfile.profile_data || {}
  const identity = profileData.identite || {}
  const formation = profileData.formation || {}
  const documents = storedProfile.documents || []
  const cvDocument = documents.find((item) => item.document_type === "cv")
  return {
    ...normalizedUser,
    ...profileData,
    email: identity.email || normalizedUser.email,
    prenom: identity.prenom || normalizedUser.prenom,
    nom: identity.nom || normalizedUser.nom,
    telephone: identity.telephone || normalizedUser.telephone,
    ville: identity.ville || normalizedUser.ville,
    filiere: formation.filiere || "",
    niveau: formation.niveau || "",
    annee:
      formation.anneeFormation ||
      formation.anneeObtention ||
      formation.anneeObtentionPrevue ||
      "",
    cmc: profileData.cmc || "CMC Nador",
    cvNomFichier: cvDocument?.original_filename || storedProfile.cv_file_name,
    profileStatus: "COMPLETED",
    documents,
    profileData,
  }
}

async function loadCompleteProfile(normalizedUser) {
  try {
    const storedProfile = await candidateProfileApi.get()
    return mergeStoredProfile(normalizedUser, storedProfile)
  } catch (error) {
    if (error.status === 404) return normalizedUser
    throw error
  }
}

function collectDocumentFiles(wizardSections) {
  const files = []
  const documents = wizardSections.documentsProfil || {}
  const documentTypes = {
    cv: "cv",
    lettreMotivation: "lettre_motivation",
    attestationScolarite: "attestation_scolarite",
    releveNotes: "releve_notes",
    portfolioDocument: "portfolio",
    diplomeOfppt: "diplome_ofppt",
    attestationsStage: "attestations_stage",
    certificats: "certificats",
  }
  Object.entries(documentTypes).forEach(([key, documentType]) => {
    const file = documents[key]?.file
    if (file instanceof File) files.push({ documentType, file })
  })
  ;(wizardSections.parcours?.certifications || []).forEach((item, index) => {
    const file = item.fichier?.file
    if (file instanceof File) files.push({ documentType: `certification_${index + 1}`, file })
  })
  const photo = wizardSections.identite?.photo?.file
  if (photo instanceof File) files.push({ documentType: "photo", file: photo })
  return files
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
      .then((apiUser) => loadCompleteProfile(normalizeUser(apiUser)))
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { access_token } = await authApi.login(email, password)
    setToken(access_token)
    const apiUser = await authApi.me()
    const completeUser = await loadCompleteProfile(normalizeUser(apiUser))
    setUser(completeUser)
    return completeUser
  }

  async function register({ profil, identite, ...wizardSections }) {
    const { motDePasse, confirmationMotDePasse: _confirmation, ...identitePublic } = identite
    let connectedUser = user

    if (!connectedUser || connectedUser.email.toLowerCase() !== identite.email.toLowerCase()) {
      await authApi.register({
        email: identite.email,
        password: motDePasse,
        first_name: identite.prenom,
        last_name: identite.nom,
        candidate_type: profil === "laureat" ? "LAUREAT" : "STAGIAIRE",
        phone: identite.telephone || null,
        city: identite.ville || null,
      })
      connectedUser = await login(identite.email, motDePasse)
    }

    const documentFiles = collectDocumentFiles({ identite, ...wizardSections })
    const fullWizardData = serializeWizardData({
      profil,
      identite: identitePublic,
      ...wizardSections,
      cmc: "CMC Nador",
    })
    const cvFileName = wizardSections.documentsProfil?.cv?.name || null
    const savedProfile = await candidateProfileApi.save({
      cv_file_name: cvFileName,
      profile_data: fullWizardData,
    })

    const uploadedDocuments = []
    for (const { documentType, file } of documentFiles) {
      uploadedDocuments.push(await candidateProfileApi.uploadDocument(documentType, file))
    }
    const completeUser = mergeStoredProfile(connectedUser, {
      ...savedProfile,
      documents: uploadedDocuments,
    })
    setUser(completeUser)
    return completeUser
  }

  async function refreshProfile() {
    if (!user) return null
    const apiUser = await authApi.me()
    const completeUser = await loadCompleteProfile(normalizeUser(apiUser))
    setUser(completeUser)
    return completeUser
  }

  async function updateProfile(partial) {
    const payload = {
      email: partial.email,
      first_name: partial.prenom,
      last_name: partial.nom,
      phone: partial.telephone || null,
      city: partial.ville || null,
      program_name: partial.filiere,
      level: partial.niveau,
      cmc: partial.cmc,
    }
    if (user?.profil === "stagiaire") payload.training_year = partial.annee
    else payload.graduation_year = partial.annee
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])
    await candidateProfileApi.updateBasic(payload)
    return refreshProfile()
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}
