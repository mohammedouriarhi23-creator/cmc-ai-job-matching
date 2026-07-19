import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, MapPin, Briefcase, Heart, ArrowRight } from "lucide-react"

const typeStyles = {
  Stage: { border: "border-t-[#3dabc4]", badge: "bg-[#ebfbff] text-[#257184]" },
  PFE: { border: "border-t-[#d7435b]", badge: "bg-[#fdecee] text-[#bc0001]" },
  Emploi: { border: "border-t-emerald-500", badge: "bg-emerald-50 text-emerald-600" },
}

export default function OffreCard({ offre }) {
  const [favori, setFavori] = useState(false)
  const style = typeStyles[offre.type] || typeStyles.Stage
  const jours = offre.dateLimite ? joursRestants(offre.dateLimite) : null

  return (
    <div
      className={`flex flex-col rounded-2xl border-t-4 border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${style.border}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}>
          {offre.type}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <Clock size={13} />
          {jours === null
            ? "Sans date limite"
            : `${jours} jour${jours !== 1 ? "s" : ""} restant${jours !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
          style={{ backgroundColor: offre.entrepriseCouleur }}
        >
          {offre.entrepriseInitiale}
        </span>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[#333333]">
          <Briefcase size={13} className="text-gray-400" />
          {offre.entreprise}
        </p>
      </div>

      <h3 className="mb-3 text-lg font-bold leading-snug text-[#333333]">{offre.poste}</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {offre.secteur}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          <MapPin size={12} />
          {offre.ville}
        </span>
      </div>

      <div className="mb-5 rounded-lg bg-[#ebfbff] px-3.5 py-2.5 text-sm font-medium text-[#1a4a54]">
        💼 {offre.postes} poste{offre.postes > 1 ? "s" : ""} disponible{offre.postes > 1 ? "s" : ""}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Link
          to={`/offres/${offre.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3dabc4] hover:text-[#2f8ea3]"
        >
          Voir l'offre
          <ArrowRight size={15} />
        </Link>
        <button
          onClick={() => setFavori((f) => !f)}
          aria-label="Ajouter aux favoris"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            favori ? "bg-[#fdecee] text-[#bc0001]" : "bg-gray-100 text-gray-400 hover:text-[#bc0001]"
          }`}
        >
          <Heart size={16} fill={favori ? "#bc0001" : "none"} />
        </button>
      </div>
    </div>
  )
}

function joursRestants(dateLimite) {
  const diff = new Date(dateLimite).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
