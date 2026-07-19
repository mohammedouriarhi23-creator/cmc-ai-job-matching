import { describe, expect, it } from "vitest"

import { mapOffer } from "./api"

describe("mapOffer", () => {
  it("adapte une offre API au format des composants", () => {
    const offer = mapOffer({
      id: 4,
      title: "Développeur",
      company_name: "CMC Tech",
      offer_type: "PFE",
      location: "Oujda",
      sector: "Digital",
      education_level: "Technicien Spécialisé",
      number_of_positions: 2,
      published_at: "2026-07-19T00:00:00Z",
      application_deadline: "2026-08-30",
      requirements: "Profil motivé",
      required_skills: ["Python"],
      preferred_skills: ["React"],
    })
    expect(offer.poste).toBe("Développeur")
    expect(offer.entreprise).toBe("CMC Tech")
    expect(offer.type).toBe("PFE")
    expect(offer.postes).toBe(2)
    expect(offer.competences).toEqual(["Python"])
  })
})
