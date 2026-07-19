import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

import FadeUp from "../../components/ui/FadeUp"
import { companyApi } from "../../lib/api"

export default function Entreprises() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    companyApi
      .list({ page_size: 100 })
      .then((data) => setCompanies(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#ebfbff] py-16">
      <div className="container-page">
        <FadeUp className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#3dabc4] shadow-sm">
            Nos partenaires
          </span>
          <h1 className="text-3xl font-extrabold text-[#333333] sm:text-4xl">Entreprises partenaires</h1>
          <p className="mt-4 text-gray-500">
            {companies.length} entreprise{companies.length > 1 ? "s" : ""} active{companies.length > 1 ? "s" : ""}.
          </p>
        </FadeUp>

        {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? (
          <p className="py-16 text-center text-gray-500">Chargement...</p>
        ) : companies.length === 0 ? (
          <p className="rounded-xl bg-white p-10 text-center text-gray-500">Aucune entreprise active actuellement.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company, index) => (
              <FadeUp key={company.id} delay={index * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3dabc4] text-lg font-bold text-white">
                      {company.name[0]}
                    </span>
                    <div>
                      <p className="font-bold text-[#333333]">{company.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} />{company.city}</p>
                    </div>
                  </div>
                  <span className="mb-3 w-fit rounded-full bg-[#ebfbff] px-3 py-1 text-xs font-semibold text-[#257184]">
                    {company.sector}
                  </span>
                  <p className="mb-4 flex-1 text-sm text-gray-500">{company.description || "Entreprise partenaire CMC."}</p>
                  <p className="text-sm font-semibold text-[#3dabc4]">
                    {company.active_offer_count} offre{company.active_offer_count > 1 ? "s" : ""} active{company.active_offer_count > 1 ? "s" : ""}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
