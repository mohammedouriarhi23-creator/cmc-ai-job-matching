import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, FileSearch, ShieldCheck, UserCheck } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import OfferCard from "@/components/OfferCard";
import { offers } from "@/data/mock";

const steps = [
  { icon: FileSearch, title: "Déposez votre CV", desc: "L'IA lit le CV même si les rubriques portent des noms différents." },
  { icon: UserCheck, title: "Validez votre profil", desc: "Corrigez, supprimez ou ajoutez les compétences, expériences et projets détectés." },
  { icon: Bot, title: "Recevez vos scores", desc: "Chaque offre CMC ou externe est classée avec un score de compatibilité explicable." },
  { icon: ShieldCheck, title: "Le CMC garde la décision", desc: "L'administration analyse le score et les écarts avant de retenir un candidat." },
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <section className="relative overflow-hidden bg-cmc-hero">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="badge border border-white/10 bg-white/10 text-cmc-teal">Plateforme CMC · Matching explicable</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">Votre CV devient un <span className="text-cmc-teal">profil intelligent</span> pour trouver les bonnes opportunités.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">Stagiaire ou lauréat, déposez votre CV, validez les informations extraites par IA et découvrez les stages ou emplois proposés par le CMC et collectés depuis des sources externes.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="btn-primary px-6 py-3">Commencer avec mon CV <ArrowRight size={18} /></Link><Link href="/offres" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">Voir les opportunités</Link></div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="rounded-xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-cmc-teal-dark">Analyse IA du CV</p><h2 className="mt-2 text-xl font-extrabold text-cmc-navy">Profil détecté</h2></div><span className="badge bg-emerald-50 text-emerald-700">Prêt à valider</span></div>
              <div className="mt-6 space-y-4">
                {["Résumé professionnel", "5 compétences techniques", "2 expériences", "4 projets", "Formation & langues"].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700"><CheckCircle2 size={18} className="text-emerald-500" />{item}</div>)}
              </div>
              <div className="mt-6 rounded-xl bg-cmc-sky p-4 text-sm text-cmc-navy"><strong>Étape suivante :</strong> vous vérifiez les données avant qu'elles alimentent le matching.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl"><span className="badge bg-cmc-sky text-cmc-teal-dark">Parcours candidat</span><h2 className="mt-4 text-3xl font-extrabold text-cmc-navy">Simple pour le candidat, utile pour l'administration.</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, title, desc }, index) => <div key={title} className="card"><div className="flex items-center justify-between"><span className="rounded-xl bg-cmc-sky p-3 text-cmc-teal-dark"><Icon size={22} /></span><span className="text-3xl font-extrabold text-gray-100">0{index + 1}</span></div><h3 className="mt-5 font-extrabold text-cmc-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p></div>)}</div>
      </section>

      <section className="bg-cmc-sky/60 py-20">
        <div className="mx-auto max-w-7xl px-6"><div className="flex items-end justify-between gap-4"><div><span className="badge bg-white text-cmc-teal-dark">Opportunités</span><h2 className="mt-4 text-3xl font-extrabold text-cmc-navy">Des offres CMC et des offres externes.</h2></div><Link href="/offres" className="hidden font-bold text-cmc-teal-dark md:block">Voir toutes les offres →</Link></div><div className="mt-10 grid gap-5 md:grid-cols-3">{offers.slice(0, 3).map((offer) => <OfferCard key={offer.id} offer={offer} candidate={false} />)}</div></div>
      </section>
      <PublicFooter />
    </>
  );
}
