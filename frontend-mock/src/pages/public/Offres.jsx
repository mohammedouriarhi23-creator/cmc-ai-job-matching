import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react"

import OffreCard from "../../components/offres/OffreCard"
import OffreFilters from "../../components/offres/OffreFilters"
import { jobOfferApi, mapOffer } from "../../lib/api"

const PAGE_SIZE = 6
const INITIAL_FILTERS = { q: "", type: "", ville: "", secteur: "" }

export default function Offres() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ items: [], total: 0, total_pages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    const timer = setTimeout(() => {
      jobOfferApi
        .list({
          search: filters.q,
          offer_type: filters.type,
          city: filters.ville,
          sector: filters.secteur,
          page,
          page_size: PAGE_SIZE,
        })
        .then((data) => active && setResult({ ...data, items: data.items.map(mapOffer) }))
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false))
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [filters, page])

  function handleFiltersChange(next) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#333333]">Toutes les offres</h1>
        <p className="mt-2 text-gray-500">
          {result.total} offre{result.total > 1 ? "s" : ""} publiée{result.total > 1 ? "s" : ""}.
        </p>
      </div>
      <div className="mb-8">
        <OffreFilters filters={filters} onChange={handleFiltersChange} />
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="py-16 text-center text-gray-500">Chargement des offres...</p>
      ) : result.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <SearchX size={36} className="text-gray-400" />
          <p className="font-semibold text-gray-700">Aucune offre ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((offre) => <OffreCard key={offre.id} offre={offre} />)}
        </div>
      )}

      {result.total_pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40"
          ><ChevronLeft size={16} /></button>
          <span className="text-sm text-gray-600">Page {page} sur {result.total_pages}</span>
          <button
            onClick={() => setPage((value) => Math.min(result.total_pages, value + 1))}
            disabled={page === result.total_pages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 disabled:opacity-40"
          ><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  )
}
