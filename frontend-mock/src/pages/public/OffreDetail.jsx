import { useState } from "react"
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
import { getOffreById, getOffresSimilaires } from "../../data/offres"
import { useAuth } from "../../context/AuthContext"

const typeColors = { Stage: "teal", PFE: "coral", Emploi: "emerald" }

export default function OffreDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [postule, setPostule] = useState(false)

  const offre = getOffreById(id)

  if (!offre) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-semibold text-gray-700">Offre introuvable.</p>
        <Button to="/offres" variant="outline" className="mt-6">
          Retour aux offres
        </Button>
      </div>
    )
  }

  const similaires = getOffresSimilaires(offre)

  function handlePostuler() {
    if (!user) {
      navigate("/espace-candidat")
      return
    }
    setPostule(true)
  }

  return (
    <div className="container-page py-12">
      <Link
        to="/offres"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#3dabc4] hover:underline"
      >
        <ArrowLeft size={15} />
        Retour aux offres
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
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: offre.entrepriseCouleur }}
              >
                {offre.entrepriseInitiale}
              </span>
              <p className="flex items-center gap-1.5 text-base font-semibold text-[#333333]">
                <Briefcase size={16} className="text-gray-400" />
                {offre.entreprise}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} />
                {offre.ville}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={15} />
                {offre.postes} poste{offre.postes > 1 ? "s" : ""} disponible
                {offre.postes > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} />
                Publiée le {new Date(offre.datePublication).toLocaleDateString("fr-FR")}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock size={15} />
                Date limite : {new Date(offre.dateLimite).toLocaleDateString("fr-FR")}
              </span>
            </div>

            <hr className="my-6 border-gray-200" />

            <h2 className="mb-2 text-lg font-bold text-[#333333]">Description du poste</h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">{offre.description}</p>

            <h2 className="mb-2 text-lg font-bold text-[#333333]">Profil recherché</h2>
            <p className="mb-1 text-sm leading-relaxed text-gray-600">{offre.profilRecherche}</p>
            <p className="mb-6 text-sm text-gray-500">
              Programme requis : <span className="font-medium text-gray-700">{offre.programme}</span>
            </p>

            <h2 className="mb-3 text-lg font-bold text-[#333333]">Compétences requises</h2>
            <div className="flex flex-wrap gap-2">
              {offre.competences.map((c) => (
                <Badge key={c} color="primary">
                  {c}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            {postule ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-emerald-500" />
                <p className="font-bold text-[#333333]">Candidature envoyée !</p>
                <p className="text-sm text-gray-500">
                  Votre candidature a bien été enregistrée. Suivez son statut depuis votre espace
                  « Mes candidatures ».
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  Intéressé par cette offre ? Postulez dès maintenant, il ne vous faudra qu'une
                  minute.
                </p>
                <Button variant="accent" className="w-full" onClick={handlePostuler}>
                  Postuler à cette offre
                </Button>
                {!user && (
                  <p className="mt-3 text-center text-xs text-gray-400">
                    Vous devez être connecté pour postuler.
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      {similaires.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-extrabold text-[#333333]">Offres similaires</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((o) => (
              <OffreCard key={o.id} offre={o} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
