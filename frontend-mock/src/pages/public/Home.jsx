import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  ChevronDown,
  UserPlus,
  Search,
  Send,
  Trophy,
  CheckCircle2,
  Rocket,
} from "lucide-react"
import Button from "../../components/ui/Button"
import FadeUp from "../../components/ui/FadeUp"
import OffreCard from "../../components/offres/OffreCard"
import StatCard from "../../components/home/StatCard"
import StepCard from "../../components/home/StepCard"
import CompanyCard from "../../components/home/CompanyCard"
import { offres } from "../../data/offres"
import { stats } from "../../data/stats"
import { entreprises } from "../../data/entreprises"

const statIcons = { users: Users, "graduation-cap": GraduationCap, building: Building2, briefcase: Briefcase }

const avatarColors = ["#3dabc4", "#bc0001", "#10b981", "#f59e0b", "#8b5cf6"]

const etapes = [
  {
    icon: UserPlus,
    titre: "Créez votre profil",
    description: "Inscrivez-vous et complétez votre profil en quelques minutes",
  },
  {
    icon: Search,
    titre: "Explorez les offres",
    description: "Parcourez les offres adaptées à votre filière",
  },
  {
    icon: Send,
    titre: "Postulez en ligne",
    description: "Envoyez votre candidature directement depuis la plateforme",
  },
  {
    icon: Trophy,
    titre: "Décrochez votre poste",
    description: "Soyez contacté(e) par l'entreprise et lancez votre carrière",
  },
]

export default function Home() {
  const offresRecentes = offres.slice(0, 6)
  const offresApercu = offres.slice(0, 3)

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4]"
      >
        <div className="absolute inset-0 bg-grid-diagonal" />

        <div
          className="absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#3dabc4] opacity-20 blur-3xl animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-32 h-72 w-72 rounded-full bg-[#d7435b] opacity-15 blur-3xl animate-float-slow"
          aria-hidden="true"
        />
        <div
          className="absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-emerald-500 opacity-15 blur-3xl animate-float"
          aria-hidden="true"
        />

        <div className="container-page relative z-10 grid grid-cols-1 items-center gap-16 py-32 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Plateforme officielle du CMC Connect
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.15] sm:text-5xl lg:text-6xl">
              <span className="block text-white">Trouvez Votre</span>
              <span className="block text-[#7dd2df]">Avenir</span>
              <span className="block text-white">
                Professio<span className="text-[#f18594]">nnel</span>
              </span>
              <span className="block text-white">Au Maroc</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-gray-300">
              CMC Connect réunit stagiaires, lauréats et entreprises partenaires de la Cité des
              Métiers et des Compétences de l'Oriental pour construire l'insertion professionnelle
              de demain.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/offres" variant="primary" size="lg">
                Explorer les Offres
                <ArrowRight size={18} />
              </Button>
              <Button to="/espace-candidat" variant="outline-white" size="lg">
                Créer mon profil
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {avatarColors.map((c, i) => (
                  <span
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a4a54] text-xs font-bold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-300">
                <span className="font-bold text-white">335+</span> stagiaires inscrits
              </p>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <p className="mb-5 font-bold text-white">Offres Récentes</p>
              <div className="flex flex-col gap-4">
                {offresApercu.map((offre, i) => (
                  <div key={offre.id} className="flex items-center gap-3 rounded-xl bg-white/10 p-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: offre.entrepriseCouleur }}
                    >
                      {offre.entrepriseInitiale}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{offre.poste}</p>
                      <span className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {offre.type}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-gray-300">il y a {2 + i * 3}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-6 right-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-2xl">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">89% Taux d'insertion</span>
            </div>
            <div className="absolute -bottom-6 left-4 rounded-xl bg-white px-4 py-2.5 shadow-2xl">
              <span className="text-sm font-bold text-[#bc0001]">140+ Entreprises</span>
            </div>
          </div>
        </div>

        <a
          href="#stats"
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-white/70 hover:text-white"
        >
          Découvrir
          <ChevronDown size={18} className="animate-bounce" />
        </a>
      </section>

      {/* STATS */}
      <section id="stats" className="bg-white py-16">
        <div className="container-page">
          <FadeUp>
            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.id} icon={statIcons[stat.icon]} value={stat.value} label={stat.label} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* OFFRES */}
      <section id="offers" className="bg-[#ebfbff] py-20">
        <div className="container-page">
          <FadeUp className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#3dabc4] shadow-sm">
              Opportunités
            </span>
            <h2 className="text-3xl font-extrabold text-[#333333] sm:text-4xl">
              Dernières Offres Publiées
            </h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-[#bc0001]" />
            <p className="mt-4 text-gray-500">Découvrez les opportunités disponibles</p>
          </FadeUp>

          <FadeUp delay={100} className="mb-10">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-md sm:flex-row"
            >
              <div className="relative flex-1">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un stage, PFE, emploi..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20"
                />
              </div>
              <select className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 focus:border-[#3dabc4] focus:outline-none focus:ring-2 focus:ring-[#3dabc4]/20 sm:w-48">
                <option>Tous les types</option>
                <option>Stage</option>
                <option>PFE</option>
                <option>Emploi</option>
              </select>
              <Button type="submit" to="/offres" variant="primary" className="sm:w-40">
                Rechercher
              </Button>
            </form>
          </FadeUp>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offresRecentes.map((offre, i) => (
              <FadeUp key={offre.id} delay={i * 80}>
                <OffreCard offre={offre} />
              </FadeUp>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button to="/offres" variant="outline" size="lg" className="rounded-full">
              Voir toutes les offres
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="bg-white py-20">
        <div className="container-page">
          <FadeUp className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#fdecee] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#bc0001]">
              Processus
            </span>
            <h2 className="text-3xl font-extrabold text-[#333333] sm:text-4xl">Comment ça marche ?</h2>
            <span className="mx-auto mt-3 block h-1 w-14 rounded-full bg-[#3dabc4]" />
          </FadeUp>

          <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute top-10 hidden w-full border-t-2 border-dashed border-gray-200 lg:block" />
            {etapes.map((etape, i) => (
              <FadeUp key={etape.titre} delay={i * 100} className="relative z-10">
                <StepCard icon={etape.icon} number={i + 1} title={etape.titre} description={etape.description} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ENTREPRISES PARTENAIRES */}
      <section id="companies" className="overflow-hidden bg-[#ebfbff] py-20">
        <div className="container-page">
          <FadeUp className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#3dabc4] shadow-sm">
              Ils nous font confiance
            </span>
            <h2 className="text-3xl font-extrabold text-[#333333] sm:text-4xl">
              Nos Entreprises Partenaires
            </h2>
            <p className="mt-4 text-gray-500">
              Un réseau d'entreprises qui recrutent nos lauréats
            </p>
          </FadeUp>
        </div>

        <div className="marquee-container">
          <div className="marquee-track gap-6">
            {[...entreprises, ...entreprises].map((e, i) => (
              <CompanyCard key={`${e.id}-${i}`} entreprise={e} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#333333] via-[#1a4a54] to-[#3dabc4] py-24">
        <div className="absolute inset-0 bg-dot-pattern" />
        <div className="container-page relative z-10 text-center">
          <FadeUp>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
              <Rocket size={13} />
              Commencez dès aujourd'hui
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Prêt(e) à Lancer Votre Carrière ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-300">
              Rejoignez des centaines de stagiaires et lauréats qui ont trouvé leur voie.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button to="/espace-candidat" variant="white" size="lg">
                Créer mon compte
              </Button>
              <Button to="/offres" variant="outline-white" size="lg">
                Voir les offres
                <ArrowRight size={18} />
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
