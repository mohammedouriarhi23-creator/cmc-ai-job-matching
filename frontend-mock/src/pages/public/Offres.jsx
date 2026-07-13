import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react"
import OffreCard from "../../components/offres/OffreCard"
import OffreFilters from "../../components/offres/OffreFilters"
import Select from "../../components/ui/Select"
import { offres } from "../../data/offres"

const PAGE_SIZE = 6

export default function Offres() {
  const [filters, setFilters] = useState({ q: "", type: "", ville: "", secteur: "" })
  const [tri, setTri] = useState("recent")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return offres
      .filter((o) => {
        const matchQ =
          !filters.q ||
          o.poste.toLowerCase().includes(filters.q.toLowerCase()) ||
          o.entreprise.toLowerCase().includes(filters.q.toLowerCase())
        const matchType = !filters.type || o.type === filters.type
        const matchVille = !filters.ville || o.ville === filters.ville
        const matchSecteur = !filters.secteur || o.secteur === filters.secteur
        return matchQ && matchType && matchVille && matchSecteur
      })
      .sort((a, b) => {
        if (tri === "ancien") return new Date(a.datePublication) - new Date(b.datePublication)
        if (tri === "deadline") return new Date(a.dateLimite) - new Date(b.dateLimite)
        return new Date(b.datePublication) - new Date(a.datePublication)
      })
  }, [filters, tri])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFiltersChange(next) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#333333]">Toutes les offres</h1>
          <p className="mt-2 text-gray-500">
            {filtered.length} offre{filtered.length > 1 ? "s" : ""} de stage, PFE et emploi
            disponibles.
          </p>
        </div>
        <Select value={tri} onChange={(e) => setTri(e.target.value)} className="w-auto">
          <option value="recent">Plus récentes</option>
          <option value="ancien">Plus anciennes</option>
          <option value="deadline">Date limite proche</option>
        </Select>
      </div>

      <div className="mb-8">
        <OffreFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <SearchX size={36} className="text-gray-400" />
          <p className="font-semibold text-gray-700">Aucune offre ne correspond à votre recherche</p>
          <p className="text-sm text-gray-500">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((offre) => (
            <OffreCard key={offre.id} offre={offre} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                n === currentPage
                  ? "bg-[#3dabc4] text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
