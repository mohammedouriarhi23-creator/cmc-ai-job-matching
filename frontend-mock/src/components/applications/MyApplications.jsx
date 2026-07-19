import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Card from "../ui/Card"
import Badge from "../ui/Badge"
import Button from "../ui/Button"
import { applicationApi } from "../../lib/api"

const STATUS = {
  SUBMITTED: ["Envoyée", "amber"],
  UNDER_REVIEW: ["En cours d'analyse", "blue"],
  SHORTLISTED: ["Présélectionnée", "teal"],
  INTERVIEW: ["Entretien", "blue"],
  ACCEPTED: ["Acceptée", "green"],
  REJECTED: ["Refusée", "red"],
  WITHDRAWN: ["Retirée", "gray"],
}

export default function MyApplications({ variant }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busyId, setBusyId] = useState(null)

  const loadApplications = useCallback(() => {
    setLoading(true)
    applicationApi
      .mine({ page_size: 100 })
      .then((data) => {
        setApplications(data.items)
        setError("")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(loadApplications, [loadApplications])

  async function withdraw(applicationId) {
    setBusyId(applicationId)
    try {
      await applicationApi.withdraw(applicationId)
      loadApplications()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Mes candidatures</h1>
      <p className="mb-6 text-sm text-gray-500">
        Suivez vos candidatures {variant === "laureat" ? "aux offres d'emploi" : "aux stages et PFE"}.
      </p>
      {error && <p className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="py-12 text-center text-gray-500">Chargement...</p>
      ) : applications.length === 0 ? (
        <Card className="p-10 text-center text-sm text-gray-500">Vous n'avez encore envoyé aucune candidature.</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3.5">Poste</th>
                  <th className="px-5 py-3.5">Entreprise</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((application) => {
                  const [label, color] = STATUS[application.status] || [application.status, "gray"]
                  const canWithdraw = !["ACCEPTED", "REJECTED", "WITHDRAWN"].includes(application.status)
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        <Link to={`/offres/${application.job_offer_id}`} className="hover:underline">
                          {application.offer?.title || `Offre #${application.job_offer_id}`}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{application.offer?.company_name}</td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(application.applied_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4"><Badge color={color}>{label}</Badge></td>
                      <td className="px-5 py-4">
                        {canWithdraw && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={busyId === application.id}
                            onClick={() => withdraw(application.id)}
                          >
                            Retirer
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
