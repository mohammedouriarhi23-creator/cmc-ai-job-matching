const SCALAR_SECTIONS = [
  { key: "identite", stepId: "identite" },
  { key: "formation", stepId: "formation" },
]

const LIST_SECTIONS = [
  { key: "competencesTechniques", stepId: "competences", keyFields: ["nom"] },
  { key: "langues", stepId: "competences", keyFields: ["langue"] },
  { key: "softSkills", stepId: "competences", keyFields: ["value"] },
  { key: "experiences", stepId: "parcours", keyFields: ["titre", "organisme"] },
  { key: "projets", stepId: "parcours", keyFields: ["nom"] },
  { key: "certifications", stepId: "parcours", keyFields: ["nom"] },
]

const DIACRITICS_REGEX = /\p{Diacritic}/gu

export function normalizeForCompare(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .trim()
    .toLowerCase()
}

function isEmptyValue(value) {
  return value === null || value === undefined || value === ""
}

function itemSignature(item, keyFields) {
  return keyFields.map((f) => normalizeForCompare(item[f])).join("|")
}

// Merges `newItems` into `currentItems`, skipping any item whose signature
// (case/accent-insensitive) already exists in `currentItems`.
export function mergeUniqueList(currentItems, newItems, keyFields) {
  const existingSignatures = new Set(
    (currentItems || []).map((item) => itemSignature(item, keyFields))
  )
  const merged = [...(currentItems || [])]
  for (const item of newItems || []) {
    const signature = itemSignature(item, keyFields)
    if (existingSignatures.has(signature)) continue
    existingSignatures.add(signature)
    merged.push(item)
  }
  return merged
}

// Flattens the extraction result into review rows the CvReviewModal can render.
// Fields with a null/empty extracted value are dropped (nothing to review).
export function buildReviewModel(extraction, formData) {
  const sections = []

  for (const { key, stepId } of SCALAR_SECTIONS) {
    const extracted = extraction?.[key] || {}
    const current = formData?.[stepId] || {}
    const fields = Object.entries(extracted)
      .filter(([, entry]) => entry && !isEmptyValue(entry.value))
      .map(([field, entry]) => {
        const alreadyFilled = !isEmptyValue(current[field])
        return {
          type: "scalar",
          stepId,
          field,
          value: entry.value,
          confidence: entry.confidence || "medium",
          alreadyFilled,
          defaultAccepted: !alreadyFilled,
        }
      })
    if (fields.length > 0) sections.push({ stepId, sourceKey: key, fields })
  }

  if (extraction?.presentation && !isEmptyValue(extraction.presentation.value)) {
    const alreadyFilled = !isEmptyValue(formData?.documentsProfil?.presentation)
    sections.push({
      stepId: "documentsProfil",
      sourceKey: "presentation",
      fields: [
        {
          type: "scalar",
          stepId: "documentsProfil",
          field: "presentation",
          value: extraction.presentation.value,
          confidence: extraction.presentation.confidence || "medium",
          alreadyFilled,
          defaultAccepted: !alreadyFilled,
        },
      ],
    })
  }

  for (const { key, stepId, keyFields } of LIST_SECTIONS) {
    const items = extraction?.[key]
    if (!Array.isArray(items) || items.length === 0) continue
    const current = formData?.[stepId]?.[key] || []
    const existingSignatures = new Set(current.map((item) => itemSignature(item, keyFields)))
    const fields = items.map((item, index) => ({
      type: "list",
      stepId,
      field: key,
      keyFields,
      index,
      item,
      confidence: item.confidence || "medium",
      isDuplicate: existingSignatures.has(itemSignature(item, keyFields)),
      defaultAccepted: !existingSignatures.has(itemSignature(item, keyFields)),
    }))
    sections.push({ stepId, sourceKey: key, fields })
  }

  return sections
}

// Builds the { stepId: partialData } patch to feed into FormWizard's
// applyExtraction, from the review model and the set of accepted field ids.
// `acceptedIds` is a Set of "stepId:field" (scalar) or "stepId:field:index" (list).
export function buildExtractionPatch(reviewSections, formData, acceptedIds) {
  const patch = {}

  function fieldId(f) {
    return f.type === "scalar" ? `${f.stepId}:${f.field}` : `${f.stepId}:${f.field}:${f.index}`
  }

  for (const section of reviewSections) {
    for (const f of section.fields) {
      if (!acceptedIds.has(fieldId(f))) continue

      if (f.type === "scalar") {
        patch[f.stepId] = { ...(patch[f.stepId] || {}), [f.field]: f.value }
        continue
      }

      const currentList = patch[f.stepId]?.[f.field] ?? formData?.[f.stepId]?.[f.field] ?? []
      const merged = mergeUniqueList(currentList, [f.item], f.keyFields)
      patch[f.stepId] = { ...(patch[f.stepId] || {}), [f.field]: merged }
    }
  }

  return patch
}

// Returns the "stepId:field" ids of every accepted-by-default field, for
// pre-checking the review UI ("Tout accepter" starting state).
export function defaultAcceptedIds(reviewSections) {
  const ids = new Set()
  for (const section of reviewSections) {
    for (const f of section.fields) {
      if (!f.defaultAccepted) continue
      ids.add(f.type === "scalar" ? `${f.stepId}:${f.field}` : `${f.stepId}:${f.field}:${f.index}`)
    }
  }
  return ids
}

export function allFieldIds(reviewSections) {
  const ids = new Set()
  for (const section of reviewSections) {
    for (const f of section.fields) {
      ids.add(f.type === "scalar" ? `${f.stepId}:${f.field}` : `${f.stepId}:${f.field}:${f.index}`)
    }
  }
  return ids
}
