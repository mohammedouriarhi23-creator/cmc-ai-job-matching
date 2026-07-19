const SENSITIVE_FIELDS = new Set(["motDePasse", "confirmationMotDePasse", "password"])

export function sanitizeWizardForStorage(value) {
  if (Array.isArray(value)) return value.map(sanitizeWizardForStorage)
  if (value && typeof value === "object") {
    if ("file" in value && "name" in value && "size" in value) {
      const { file: _file, ...metadata } = value
      return { ...metadata, stale: true }
    }
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !SENSITIVE_FIELDS.has(key))
        .map(([key, item]) => [key, sanitizeWizardForStorage(item)])
    )
  }
  return value
}
