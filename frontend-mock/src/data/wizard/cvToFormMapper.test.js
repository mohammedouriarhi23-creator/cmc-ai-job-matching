import { describe, it, expect } from "vitest"
import {
  normalizeForCompare,
  mergeUniqueList,
  buildReviewModel,
  buildExtractionPatch,
  defaultAcceptedIds,
} from "./cvToFormMapper"

describe("normalizeForCompare", () => {
  it("strips accents and case", () => {
    expect(normalizeForCompare("Développement Web")).toBe("developpement web")
    expect(normalizeForCompare("DÉVELOPPEMENT web")).toBe("developpement web")
  })
})

describe("mergeUniqueList", () => {
  it("adds new items to an empty list", () => {
    const result = mergeUniqueList([], [{ nom: "React" }], ["nom"])
    expect(result).toEqual([{ nom: "React" }])
  })

  it("does not duplicate an item that differs only by case/accents", () => {
    const current = [{ nom: "Développement Web" }]
    const result = mergeUniqueList(current, [{ nom: "developpement web" }], ["nom"])
    expect(result).toHaveLength(1)
  })

  it("keeps distinct items", () => {
    const current = [{ nom: "React" }]
    const result = mergeUniqueList(current, [{ nom: "Vue" }], ["nom"])
    expect(result).toHaveLength(2)
  })
})

describe("buildReviewModel", () => {
  it("skips null/empty extracted values", () => {
    const extraction = {
      identite: {
        nom: { value: null, confidence: "low" },
        prenom: { value: "", confidence: "low" },
        ville: { value: "Nador", confidence: "high" },
      },
    }
    const sections = buildReviewModel(extraction, {})
    const identiteSection = sections.find((s) => s.sourceKey === "identite")
    expect(identiteSection.fields).toHaveLength(1)
    expect(identiteSection.fields[0].field).toBe("ville")
  })

  it("marks an empty form field as defaultAccepted, a filled one as not", () => {
    const extraction = {
      identite: {
        nom: { value: "Amrani", confidence: "high" },
        ville: { value: "Nador", confidence: "high" },
      },
    }
    const formData = { identite: { nom: "DejaSaisi" } }
    const sections = buildReviewModel(extraction, formData)
    const fields = sections.find((s) => s.sourceKey === "identite").fields
    const nomField = fields.find((f) => f.field === "nom")
    const villeField = fields.find((f) => f.field === "ville")

    expect(nomField.alreadyFilled).toBe(true)
    expect(nomField.defaultAccepted).toBe(false)
    expect(villeField.alreadyFilled).toBe(false)
    expect(villeField.defaultAccepted).toBe(true)
  })

  it("flags duplicate list items against the current form state", () => {
    const extraction = {
      competencesTechniques: [
        { nom: "React", niveau: "Avance", confidence: "high" },
        { nom: "python", niveau: "Intermediaire", confidence: "medium" },
      ],
    }
    const formData = { competences: { competencesTechniques: [{ nom: "Python" }] } }
    const sections = buildReviewModel(extraction, formData)
    const fields = sections.find((s) => s.sourceKey === "competencesTechniques").fields

    expect(fields.find((f) => f.item.nom === "React").isDuplicate).toBe(false)
    expect(fields.find((f) => f.item.nom === "python").isDuplicate).toBe(true)
  })
})

describe("defaultAcceptedIds / buildExtractionPatch", () => {
  it("applies only accepted fields into a patch keyed by step id", () => {
    const extraction = {
      identite: {
        nom: { value: "Amrani", confidence: "high" },
        ville: { value: "Nador", confidence: "high" },
      },
      competencesTechniques: [{ nom: "React", niveau: "Avance", confidence: "high" }],
    }
    const formData = { identite: { nom: "DejaSaisi" }, competences: { competencesTechniques: [] } }
    const sections = buildReviewModel(extraction, formData)
    const accepted = defaultAcceptedIds(sections)

    // nom was already filled -> not in the default-accepted set
    expect(accepted.has("identite:nom")).toBe(false)
    expect(accepted.has("identite:ville")).toBe(true)

    const patch = buildExtractionPatch(sections, formData, accepted)
    expect(patch.identite).toEqual({ ville: "Nador" })
    expect(patch.competences.competencesTechniques).toEqual([
      { nom: "React", niveau: "Avance", confidence: "high" },
    ])
  })

  it("never overwrites an already-filled field unless explicitly accepted", () => {
    const extraction = { identite: { nom: { value: "Amrani", confidence: "high" } } }
    const formData = { identite: { nom: "DejaSaisi" } }
    const sections = buildReviewModel(extraction, formData)

    const patchWithoutAcceptance = buildExtractionPatch(sections, formData, new Set())
    expect(patchWithoutAcceptance.identite).toBeUndefined()

    const patchWithExplicitAcceptance = buildExtractionPatch(
      sections,
      formData,
      new Set(["identite:nom"])
    )
    expect(patchWithExplicitAcceptance.identite).toEqual({ nom: "Amrani" })
  })
})
