export default function CompanyCard({ entreprise, className = "" }) {
  const name = entreprise.name || entreprise.nom
  const sector = entreprise.sector || entreprise.secteur
  return (
    <div
      className={`flex w-64 shrink-0 flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm ${className}`}
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
        style={{ backgroundColor: entreprise.couleur || "#3dabc4" }}
      >
        {name[0]}
      </span>
      <p className="font-bold text-[#333333]">{name}</p>
      <p className="text-xs text-gray-500">{sector}</p>
    </div>
  )
}
