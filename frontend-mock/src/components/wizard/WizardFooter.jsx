import { ArrowLeft, ArrowRight } from "lucide-react"
import Button from "../ui/Button"

export default function WizardFooter({ isFirst, isLast, submitting, onPrevious }) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
      {isFirst ? (
        <span />
      ) : (
        <button
          type="button"
          onClick={onPrevious}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#333333]"
        >
          <ArrowLeft size={16} />
          Précédent
        </button>
      )}

      <Button type="submit" variant="primary" disabled={submitting}>
        {isLast ? (
          submitting ? (
            "Création du compte..."
          ) : (
            "Créer mon compte"
          )
        ) : (
          <>
            Continuer
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </div>
  )
}
