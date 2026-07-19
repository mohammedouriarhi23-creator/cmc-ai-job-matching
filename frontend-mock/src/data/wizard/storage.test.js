import { describe, expect, it } from "vitest"

import { sanitizeWizardForStorage } from "./storage"

describe("sanitizeWizardForStorage", () => {
  it("ne persiste jamais les mots de passe", () => {
    const result = sanitizeWizardForStorage({
      identite: {
        email: "candidate@example.com",
        motDePasse: "secret-password",
        confirmationMotDePasse: "secret-password",
      },
    })
    expect(result.identite.email).toBe("candidate@example.com")
    expect(result.identite).not.toHaveProperty("motDePasse")
    expect(result.identite).not.toHaveProperty("confirmationMotDePasse")
  })

  it("conserve uniquement les métadonnées des fichiers", () => {
    const result = sanitizeWizardForStorage({
      cv: { name: "cv.pdf", size: 100, type: "application/pdf", file: { binary: true } },
    })
    expect(result.cv).toEqual({
      name: "cv.pdf",
      size: 100,
      type: "application/pdf",
      stale: true,
    })
  })
})
