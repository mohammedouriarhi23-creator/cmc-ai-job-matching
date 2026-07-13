import { Link } from "react-router-dom"
import Card from "../../../components/ui/Card"
import Badge from "../../../components/ui/Badge"
import { candidaturesStagiaire } from "../../../data/candidatures"

const badgeColorMap = {
  "En cours": "blue",
  Acceptée: "green",
  Refusée: "red",
  "En attente": "amber",
}

export default function MesCandidatures() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mes candidatures</h1>
      <p className="mb-6 text-sm text-gray-500">
        Suivez l'état de vos candidatures aux offres de stage et de PFE.
      </p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Poste</th>
                <th className="px-5 py-3.5">Entreprise</th>
                <th className="px-5 py-3.5">Date de candidature</th>
                <th className="px-5 py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidaturesStagiaire.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    <Link to={`/offres/${c.offreId}`} className="hover:underline">
                      {c.poste}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.entreprise}</td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(c.dateCandidature).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={badgeColorMap[c.statut]}>{c.statut}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
