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
    if (Array.isArray(data.detail)) {
      return data.detail.map((e) => e.msg).join(", ")
    }
  } catch {
    // response body wasn't JSON, fall back to statusText below
  }
  return response.statusText || "Une erreur est survenue."
}

async function request(path, { method = "GET", json, form, auth = true } = {}) {
  const headers = {}
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let body
  if (json) {
    headers["Content-Type"] = "application/json"
    body = JSON.stringify(json)
  } else if (form) {
    body = new URLSearchParams(form)
  }

  const response = await fetch(`${API_URL}${path}`, { method, headers, body })

  if (!response.ok) {
    throw new ApiError(await parseErrorDetail(response), response.status)
  }
  if (response.status === 204) return null
  return response.json()
}

export const cvApi = {
  async parse(file, profil, signal) {
    const token = getToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const formData = new FormData()
    formData.append("profil", profil)
    formData.append("file", file)

    const response = await fetch(`${API_URL}/cv/parse`, {
      method: "POST",
      headers,
      body: formData,
      signal,
    })

    if (!response.ok) {
      throw new ApiError(await parseErrorDetail(response), response.status)
    }
    return response.json()
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
    return request("/candidate/profile", {
      method: "PUT",
      json: payload,
    })
  },

  get() {
    return request("/candidate/profile")
  },
}