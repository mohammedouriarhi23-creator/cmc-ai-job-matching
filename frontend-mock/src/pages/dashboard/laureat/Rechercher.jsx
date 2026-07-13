import { useMemo, useState } from "react"
import { SearchX } from "lucide-react"
import OffreCard from "../../../components/offres/OffreCard"
import OffreFilters from "../../../components/offres/OffreFilters"
import { offres } from "../../../data/offres"

export default function Rechercher() {
  const [filters, setFilters] = useState({ q: "", type: "", ville: "", secteur: "" })

  const offresEmploi = useMemo(() => offres.filter((o) => o.type === "Emploi"), [])

  const filtered = useMemo(() => {
    return offresEmploi.filter((o) => {
      const matchQ =
        !filters.q ||
        o.poste.toLowerCase().includes(filters.q.toLowerCase()) ||
        o.entreprise.toLowerCase().includes(filters.q.toLowerCase())
      const matchVille = !filters.ville || o.ville === filters.ville
      const matchSecteur = !filters.secteur || o.secteur === filters.secteur
      return matchQ && matchVille && matchSecteur
    })
  }, [filters, offresEmploi])

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Rechercher un emploi</h1>
      <p className="mb-6 text-sm text-gray-500">
        {filtered.length} offre{filtered.length > 1 ? "s" : ""} d'emploi disponible
        {filtered.length > 1 ? "s" : ""}.
      </p>

      <div className="mb-6">
        <OffreFilters filters={filters} onChange={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <SearchX size={32} className="text-gray-400" />
          <p className="font-semibold text-gray-700">Aucune offre ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offre) => (
            <OffreCard key={offre.id} offre={offre} />
          ))}
        </div>
      )}
    </div>
  )
}
