import { Search } from "lucide-react"
import Select from "../ui/Select"

const OFFER_TYPES = [
  ["INTERNSHIP", "Stage"],
  ["PFE", "PFE"],
  ["EMPLOYMENT", "Emploi"],
]

export default function OffreFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Poste, entreprise..."
            value={filters.q}
            onChange={(event) => update("q", event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3.5 text-sm focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20"
          />
        </div>
        <Select value={filters.type} onChange={(event) => update("type", event.target.value)}>
          <option value="">Tous les types</option>
          {OFFER_TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <input
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#3dabc4] focus:outline-none"
          placeholder="Ville"
          value={filters.ville}
          onChange={(event) => update("ville", event.target.value)}
        />
        <input
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-[#3dabc4] focus:outline-none"
          placeholder="Secteur"
          value={filters.secteur}
          onChange={(event) => update("secteur", event.target.value)}
        />
      </div>
    </div>
  )
}
