import Accordion from "../../components/ui/Accordion"
import Button from "../../components/ui/Button"
import { faq } from "../../data/faq"

export default function Faq() {
  return (
    <div className="container-page py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Questions fréquentes</h1>
        <p className="mt-2 text-gray-500">
          Retrouvez les réponses aux questions les plus posées sur CMC Connect Oriental.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion items={faq} />

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="mb-4 text-sm text-gray-600">
            Vous n'avez pas trouvé la réponse à votre question ?
          </p>
          <Button to="/contact" variant="outline">
            Contactez-nous
          </Button>
        </div>
      </div>
    </div>
  )
}
