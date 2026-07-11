import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import OfferCard from "@/components/OfferCard";
import { offers } from "@/data/mock";

export default function PublicOffersPage() {
  return <><PublicHeader /><main className="mx-auto max-w-7xl px-6 py-12"><span className="badge bg-cmc-sky text-cmc-teal-dark">Opportunités publiques</span><h1 className="mt-4 text-4xl font-extrabold text-cmc-navy">Découvrez les opportunités disponibles</h1><p className="mt-3 max-w-2xl text-gray-500">Connectez-vous pour voir votre score de compatibilité et l'explication personnalisée du matching.</p><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{offers.map((offer)=><OfferCard key={offer.id} offer={offer} candidate={false} />)}</div></main><PublicFooter /></>;
}
