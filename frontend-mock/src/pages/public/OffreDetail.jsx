import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Users,
  Calendar,
  CalendarClock,
  Briefcase,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"

import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import OffreCard from "../../components/offres/OffreCard"
import { useAuth } from "../../context/auth"
import { applicationApi, jobOfferApi, mapOffer } from "../../lib/api"

const typeColors = { Stage: "teal", PFE: "coral", Emploi: "emerald" }

export default function OffreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [offre, setOffre] = useState(null)
  const [similaires, setSimilaires] = useState([])
  const [coverLetter, setCoverLetter] = useState("")
  const [postule, setPostule] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    setLoading(true)
    jobOfferApi
      .get(id)
      .then((data) => {
        if (!active) return
        const mapped = mapOffer(data)
        setOffre(mapped)
        setPostule(Boolean(data.has_applied))
        return jobOfferApi.list({ sector: data.sector, page_size: 4 })
      })
      .then((data) => {
        if (active && data) {
          setSimilaires(data.items.filter((item) => item.id !== Number(id)).slice(0, 3).map(mapOffer))
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  async function handlePostuler() {
    if (!user) {
      navigate("/espace-candidat")
      return
    }
    if (user.role !== "CANDIDATE") {
      setError("Seul un candidat peut postuler à une offre.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await applicationApi.apply(offre.id, coverLetter)
      setPostule(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="container-page py-20 text-center text-gray-500">Chargement...</p>
  if (!offre) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-semibold text-gray-700">{error || "Offre introuvable."}</p>
        <Button to="/offres" variant="outline" className="mt-6">Retour aux offres</Button>
      </div>
    )
  }

  return (
    <div className="container-page py-12">
      <Link to="/offres" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#3dabc4] hover:underline">
        <ArrowLeft size={15} /> Retour aux offres
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-7">
            <div className="mb-4 flex items-center gap-2">
              <Badge color={typeColors[offre.type] || "gray"}>{offre.type}</Badge>
              <Badge color="gray">{offre.secteur}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-[#333333] sm:text-3xl">{offre.poste}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3dabc4] font-bold text-white">
                {offre.entrepriseInitiale}
              </span>
              <p className="flex items-center gap-1.5 font-semibold"><Briefcase size={16} />{offre.entreprise}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin size={15} />{offre.ville}</span>
              <span className="flex items-center gap-1.5"><Users size={15} />{offre.postes} poste(s)</span>
              <span className="flex items-center gap-1.5"><Calendar size={15} />
                Publiée le {new Date(offre.datePublication).toLocaleDateString("fr-FR")}
              </span>
              <span className="flex items-center gap-1.5"><CalendarClock size={15} />
                {offre.dateLimite ? `Limite : ${new Date(offre.dateLimite).toLocaleDateString("fr-FR")}` : "Sans date limite"}
              </span>
            </div>
            <hr className="my-6 border-gray-200" />
            <h2 className="mb-2 text-lg font-bold">Description du poste</h2>
            <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">{offre.description}</p>
            <h2 className="mb-2 text-lg font-bold">Profil recherché</h2>
            <p className="mb-6 whitespace-pre-line text-sm text-gray-600">{offre.profilRecherche}</p>
            <h2 className="mb-3 text-lg font-bold">Compétences obligatoires</h2>
            <div className="flex flex-wrap gap-2">
              {offre.competences.length
                ? offre.competences.map((skill) => <Badge key={skill} color="primary">{skill}</Badge>)
                : <span className="text-sm text-gray-500">Aucune compétence spécifique indiquée.</span>}
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {postule ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-emerald-500" />
                <p className="font-bold">Candidature envoyée !</p>
                <p className="text-sm text-gray-500">Vous pouvez la suivre dans « Mes candidatures ».</p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-sm text-gray-500">Ajoutez éventuellement un message de motivation.</p>
                {user?.role === "CANDIDATE" && (
                  <textarea
                    rows={5}
                    maxLength={5000}
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#3dabc4] focus:outline-none"
                    placeholder="Message de motivation (facultatif)"
                  />
                )}
                <Button variant="accent" className="w-full" onClick={handlePostuler} disabled={submitting}>
                  {submitting ? "Envoi..." : "Postuler à cette offre"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      {similaires.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-extrabold">Offres similaires</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((item) => <OffreCard key={item.id} offre={item} />)}
          </div>
        </div>
      )}
    </div>
  )
}
