import { useEffect, useState } from "react"
import { SearchX } from "lucide-react"

import OffreCard from "./OffreCard"
import OffreFilters from "./OffreFilters"
import { jobOfferApi, mapOffer } from "../../lib/api"

export default function CandidateOfferSearch({ variant }) {
  const [filters, setFilters] = useState({ q: "", type: "", ville: "", secteur: "" })
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = setTimeout(() => {
      jobOfferApi
        .list({
          search: filters.q,
          offer_type: variant === "laureat" ? "EMPLOYMENT" : filters.type,
          city: filters.ville,
          sector: filters.secteur,
          target_audience: variant === "laureat" ? "LAUREAT" : "STAGIAIRE",
          page_size: 100,
        })
        .then((data) => {
          if (!active) return
          const items = data.items
            .filter((item) => variant === "laureat" || item.offer_type !== "EMPLOYMENT")
            .map(mapOffer)
          setOffers(items)
          setError("")
        })
        .catch((err) => active && setError(err.message))
        .finally(() => active && setLoading(false))
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [filters, variant])

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">
        {variant === "laureat" ? "Rechercher un emploi" : "Rechercher un stage / PFE"}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {offers.length} opportunité{offers.length > 1 ? "s" : ""} disponible{offers.length > 1 ? "s" : ""}.
      </p>
      <div className="mb-6">
        <OffreFilters filters={filters} onChange={setFilters} />
      </div>
      {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="py-12 text-center text-gray-500">Chargement...</p>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <SearchX size={32} className="text-gray-400" />
          <p className="font-semibold text-gray-700">Aucune offre ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => <OffreCard key={offer.id} offre={offer} />)}
        </div>
      )}
    </div>
  )
}
