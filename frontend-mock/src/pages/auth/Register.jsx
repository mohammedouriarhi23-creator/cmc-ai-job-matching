import { useNavigate, useParams } from "react-router-dom"
import WizardLayout from "../../components/wizard/WizardLayout"
import FormWizard from "../../components/wizard/FormWizard"
import { stagiaireSteps } from "../../data/wizard/stagiaireSteps"
import { laureatSteps } from "../../data/wizard/laureatSteps"
import { useAuth, dashboardPathFor } from "../../context/auth"
import { ApiError } from "../../lib/api"

export default function Register() {
  const { profil: profilParam } = useParams()
  const profil = profilParam === "laureat" ? "laureat" : "stagiaire"
  const navigate = useNavigate()
  const { register } = useAuth()

  const steps = profil === "laureat" ? laureatSteps : stagiaireSteps

  async function handleSubmit(data) {
    try {
      const user = await register({ profil, ...data })
      navigate(dashboardPathFor(user))
    } catch (err) {
      throw new Error(
        err instanceof ApiError && err.status === 409
          ? "Un compte existe déjà avec cet email."
          : "Impossible de créer le compte pour le moment. Réessayez."
      )
    }
  }

  return (
    <WizardLayout>
      <FormWizard
        steps={steps}
        storageKey={`cmc-inscription-${profil}`}
        title={`Créer un compte ${profil === "laureat" ? "lauréat" : "stagiaire"}`}
        onSubmit={handleSubmit}
      />
    </WizardLayout>
  )
}
