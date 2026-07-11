import Link from "next/link";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { offers } from "@/data/mock";

export default function PublicOfferDetail({ params }: { params: { id: string } }) {
  const offer = offers.find((item) => item.id === Number(params.id)) ?? offers[0];
  return <><PublicHeader /><main className="mx-auto max-w-5xl px-6 py-12"><Link href="/offres" className="flex items-center gap-2 text-sm font-bold text-gray-500"><ArrowLeft size={16}/>Retour aux offres</Link><div className="mt-6 card p-8"><span className="badge bg-cmc-sky text-cmc-teal-dark">{offer.source === "CMC" ? "Offre CMC" : `Offre externe · ${offer.externalSource}`}</span><h1 className="mt-4 text-3xl font-extrabold text-cmc-navy">{offer.title}</h1><div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-500"><span className="flex items-center gap-2"><Building2 size={16}/>{offer.company}</span><span className="flex items-center gap-2"><MapPin size={16}/>{offer.location}</span></div><p className="mt-8 leading-7 text-gray-600">{offer.description}</p><div className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-xl bg-gray-50 p-5"><h2 className="font-extrabold text-cmc-navy">Compétences requises</h2><div className="mt-4 flex flex-wrap gap-2">{offer.requiredSkills.map(s=><span key={s} className="badge bg-white text-gray-700">{s}</span>)}</div></div><div className="rounded-xl bg-cmc-sky p-5"><h2 className="font-extrabold text-cmc-navy">Votre compatibilité</h2><p className="mt-2 text-sm text-gray-600">Créez votre profil à partir du CV pour obtenir un score personnalisé et explicable.</p></div></div><Link href="/register" className="btn-primary mt-8">Créer mon profil et voir mon score</Link></div></main><PublicFooter /></>;
}
