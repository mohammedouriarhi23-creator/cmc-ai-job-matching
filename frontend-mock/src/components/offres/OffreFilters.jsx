import { Search } from "lucide-react"
import Select from "../ui/Select"
import { typesOffre, secteurs, villes } from "../../data/offres"

export default function OffreFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Poste, entreprise..."
            value={filters.q}
            onChange={(e) => update("q", e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20"
          />
        </div>

        <Select value={filters.type} onChange={(e) => update("type", e.target.value)}>
          <option value="">Tous les types</option>
          {typesOffre.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>

        <Select value={filters.ville} onChange={(e) => update("ville", e.target.value)}>
          <option value="">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Select>

        <Select value={filters.secteur} onChange={(e) => update("secteur", e.target.value)}>
          <option value="">Tous les secteurs</option>
          {secteurs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
