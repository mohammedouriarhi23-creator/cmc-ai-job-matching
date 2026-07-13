import { BookOpen, Quote } from "lucide-react"
import Card from "../../../components/ui/Card"
import Badge from "../../../components/ui/Badge"
import { guides, successStoriesLaureats } from "../../../data/ressourcesCarriere"

export default function Ressources() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Ressources carrière</h1>
      <p className="mb-6 text-sm text-gray-500">
        Conseils et guides pour réussir votre insertion professionnelle.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {guides.map((g) => (
          <Card key={g.id} className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-900">
                <BookOpen size={18} />
              </span>
              <Badge color="primary">{g.categorie}</Badge>
            </div>
            <h3 className="mb-2 font-bold text-gray-900">{g.titre}</h3>
            <p className="text-sm text-gray-500">{g.description}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold text-gray-900">
        Success stories d'anciens lauréats
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {successStoriesLaureats.map((s) => (
          <Card key={s.id} className="p-6">
            <Quote className="mb-3 text-accent-500" size={22} />
            <p className="mb-4 text-sm leading-relaxed text-gray-600">« {s.citation} »</p>
            <p className="text-sm font-bold text-gray-900">{s.nom}</p>
            <p className="text-xs text-gray-500">{s.poste}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
