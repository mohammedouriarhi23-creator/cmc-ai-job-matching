import DashboardShell from "@/components/DashboardShell";
import OfferCard from "@/components/OfferCard";
import { offers } from "@/data/mock";

export default function CandidateOffersPage() {
  const cmc=offers.filter(o=>o.source==="CMC"); const ext=offers.filter(o=>o.source==="SCRAPING");
  return <DashboardShell role="candidate" title="Opportunités pour moi" subtitle="Les offres sont filtrées selon votre type STAGIAIRE et classées par compatibilité."><div className="space-y-10"><section><div><span className="badge bg-cmc-sky text-cmc-teal-dark">Offres CMC</span><h2 className="mt-3 section-title">Opportunités proposées par le CMC</h2><p className="mt-1 text-sm text-gray-500">Stages et opportunités liés aux entreprises partenaires.</p></div><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{cmc.map(o=><OfferCard key={o.id} offer={o}/>)}</div></section><section><div><span className="badge bg-violet-50 text-violet-700">Collecte externe</span><h2 className="mt-3 section-title">Opportunités externes détectées</h2><p className="mt-1 text-sm text-gray-500">Offres normalisées depuis des sources externes avant matching.</p></div><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{ext.map(o=><OfferCard key={o.id} offer={o}/>)}</div></section></div></DashboardShell>;
}
