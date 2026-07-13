import { MapPin } from "lucide-react"
import FadeUp from "../../components/ui/FadeUp"
import { entreprises } from "../../data/entreprises"
import { offres } from "../../data/offres"

export default function Entreprises() {
  return (
    <div className="bg-[#ebfbff] py-16">
      <div className="container-page">
        <FadeUp className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#3dabc4] shadow-sm">
            Nos partenaires
          </span>
          <h1 className="text-3xl font-extrabold text-[#333333] sm:text-4xl">
            Entreprises Partenaires
          </h1>
          <p className="mt-4 text-gray-500">
            {entreprises.length} entreprises qui recrutent nos stagiaires et lauréats.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entreprises.map((e, i) => {
            const nbOffres = offres.filter((o) => o.entreprise === e.nom).length
            return (
              <FadeUp key={e.id} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                      style={{ backgroundColor: e.couleur }}
                    >
                      {e.nom[0]}
                    </span>
                    <div>
                      <p className="font-bold text-[#333333]">{e.nom}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        {e.ville}
                      </p>
                    </div>
                  </div>
                  <span className="mb-3 inline-block w-fit rounded-full bg-[#ebfbff] px-3 py-1 text-xs font-semibold text-[#257184]">
                    {e.secteur}
                  </span>
                  <p className="mb-4 flex-1 text-sm text-gray-500">{e.description}</p>
                  <p className="text-sm font-semibold text-[#3dabc4]">
                    {nbOffres} offre{nbOffres > 1 ? "s" : ""} active{nbOffres > 1 ? "s" : ""}
                  </p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </div>
  )
}
