const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[0-9+()\s-]{8,20}$/

export function required(value, message = "Champ obligatoire.") {
  if (typeof value === "string" && value.trim() === "") return message
  if (value === null || value === undefined) return message
  return null
}

export function requiredArray(value, message = "Sélectionnez au moins une option.") {
  if (!Array.isArray(value) || value.length === 0) return message
  return null
}

export function minLength(value, min, message) {
  if (!value || value.trim().length < min) return message || `${min} caractères minimum.`
  return null
}

export function emailValid(value, message = "Adresse e-mail invalide.") {
  if (!value || !EMAIL_REGEX.test(value)) return message
  return null
}

export function phoneValid(value, message = "Numéro de téléphone invalide.") {
  if (!value || !PHONE_REGEX.test(value)) return message
  return null
}

export function passwordsMatch(password, confirmation, message = "Les mots de passe ne correspondent pas.") {
  if (password !== confirmation) return message
  return null
}

export function collect(...checks) {
  const errors = {}
  for (const [field, message] of checks) {
    if (message) errors[field] = message
  }
  return errors
}
