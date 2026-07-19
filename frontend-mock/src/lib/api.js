const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
const TOKEN_KEY = "cmc_access_token"

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function parseErrorDetail(response) {
  try {
    const data = await response.json()
    if (typeof data.detail === "string") return data.detail
    if (Array.isArray(data.detail)) return data.detail.map((item) => item.msg).join(", ")
  } catch {
    // Le corps n'est pas du JSON.
  }
  return response.statusText || "Une erreur est survenue."
}

function withQuery(path, params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value)
  })
  const suffix = query.toString()
  return suffix ? `${path}?${suffix}` : path
}

async function request(
  path,
  { method = "GET", json, form, formData, auth = true, signal } = {}
) {
  const headers = {}
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let body
  if (json !== undefined) {
    headers["Content-Type"] = "application/json"
    body = JSON.stringify(json)
  } else if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    body = new URLSearchParams(form)
  } else if (formData) {
    body = formData
  }

  const response = await fetch(`${API_URL}${path}`, { method, headers, body, signal })
  if (!response.ok) throw new ApiError(await parseErrorDetail(response), response.status)
  if (response.status === 204) return null
  return response.json()
}

async function download(path) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}${path}`, { headers })
  if (!response.ok) throw new ApiError(await parseErrorDetail(response), response.status)
  return response.blob()
}

export function saveDownloadedFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const cvApi = {
  parse(file, profil, signal) {
    const formData = new FormData()
    formData.append("profil", profil)
    formData.append("file", file)
    return request("/cv/parse", { method: "POST", formData, auth: false, signal })
  },
}

export const authApi = {
  register(payload) {
    return request("/auth/register", { method: "POST", json: payload, auth: false })
  },
  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      form: { username: email, password },
      auth: false,
    })
  },
  me() {
    return request("/auth/me")
  },
}

export const candidateProfileApi = {
  save(payload) {
    return request("/candidate/profile", { method: "PUT", json: payload })
  },
  get() {
    return request("/candidate/profile")
  },
  updateBasic(payload) {
    return request("/candidate/profile/basic", { method: "PATCH", json: payload })
  },
  listDocuments() {
    return request("/candidate/profile/documents")
  },
  uploadDocument(documentType, file) {
    const formData = new FormData()
    formData.append("file", file)
    return request(`/candidate/profile/documents/${documentType}`, {
      method: "POST",
      formData,
    })
  },
  deleteDocument(documentId) {
    return request(`/candidate/profile/documents/${documentId}`, { method: "DELETE" })
  },
  downloadDocument(documentId) {
    return download(`/candidate/profile/documents/${documentId}/download`)
  },
}

export const companyApi = {
  list(params = {}) {
    return request(withQuery("/companies", params), { auth: false })
  },
  adminList(params = {}) {
    return request(withQuery("/companies/admin/all", params))
  },
  create(payload) {
    return request("/companies", { method: "POST", json: payload })
  },
  update(id, payload) {
    return request(`/companies/${id}`, { method: "PUT", json: payload })
  },
  remove(id) {
    return request(`/companies/${id}`, { method: "DELETE" })
  },
}

export const jobOfferApi = {
  list(params = {}) {
    return request(withQuery("/job-offers", params), { auth: Boolean(getToken()) })
  },
  get(id) {
    return request(`/job-offers/${id}`, { auth: Boolean(getToken()) })
  },
  adminList(params = {}) {
    return request(withQuery("/job-offers/admin", params))
  },
  create(payload) {
    return request("/job-offers", { method: "POST", json: payload })
  },
  update(id, payload) {
    return request(`/job-offers/${id}`, { method: "PUT", json: payload })
  },
  publish(id) {
    return request(`/job-offers/${id}/publish`, { method: "PATCH" })
  },
  archive(id) {
    return request(`/job-offers/${id}/archive`, { method: "PATCH" })
  },
  remove(id) {
    return request(`/job-offers/${id}`, { method: "DELETE" })
  },
}

export const applicationApi = {
  apply(jobOfferId, coverLetter = null) {
    return request("/applications", {
      method: "POST",
      json: { job_offer_id: jobOfferId, cover_letter: coverLetter || null },
    })
  },
  mine(params = {}) {
    return request(withQuery("/applications/me", params))
  },
  withdraw(id) {
    return request(`/applications/me/${id}/withdraw`, { method: "PATCH" })
  },
  adminList(params = {}) {
    return request(withQuery("/applications/admin/all", params))
  },
  downloadCv(id) {
    return download(`/applications/admin/${id}/cv`)
  },
  updateStatus(id, status, adminNote = null) {
    return request(`/applications/admin/${id}/status`, {
      method: "PATCH",
      json: { status, admin_note: adminNote || null },
    })
  },
}

const OFFER_TYPE_LABELS = {
  INTERNSHIP: "Stage",
  PFE: "PFE",
  EMPLOYMENT: "Emploi",
}

export function mapOffer(offer) {
  const publishedAt = offer.published_at || offer.created_at
  return {
    ...offer,
    poste: offer.title,
    entreprise: offer.company_name,
    entrepriseInitiale: offer.company_name?.[0] || "?",
    entrepriseCouleur: "#3dabc4",
    ville: offer.location || offer.company?.city || "Non précisée",
    type: OFFER_TYPE_LABELS[offer.offer_type] || offer.offer_type,
    secteur: offer.sector || offer.company?.sector || "Autre",
    programme: offer.education_level || "Tous profils",
    postes: offer.number_of_positions || 1,
    datePublication: publishedAt,
    dateLimite: offer.application_deadline,
    profilRecherche: offer.requirements || "Consultez la description de l'offre.",
    competences: offer.required_skills || [],
    competencesSouhaitees: offer.preferred_skills || [],
    hasApplied: offer.has_applied,
  }
}
