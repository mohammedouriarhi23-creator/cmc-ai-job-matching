import Link from "next/link";
import { Building2, ExternalLink, MapPin, Monitor } from "lucide-react";
import type { Offer } from "@/types";
import ScoreRing from "./ScoreRing";

export default function OfferCard({ offer, candidate = true }: { offer: Offer; candidate?: boolean }) {
  return (
    <Link href={candidate ? `/candidat/offres/${offer.id}` : `/offres/${offer.id}`} className="block rounded-xl border border-gray-100 border-t-4 border-t-cmc-teal bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className={`badge ${offer.source === "CMC" ? "bg-cmc-sky text-cmc-teal-dark" : "bg-violet-50 text-violet-700"}`}>{offer.source === "CMC" ? "Proposée par le CMC" : `Externe · ${offer.externalSource}`}</span>
            <span className="badge bg-gray-100 text-gray-600">{offer.opportunityType}</span>
          </div>
          <h3 className="text-lg font-extrabold text-cmc-navy">{offer.title}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-600"><Building2 size={15} />{offer.company}</p>
        </div>
        {candidate && <ScoreRing score={offer.score} size="sm" />}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500"><span className="flex items-center gap-1.5"><MapPin size={14} />{offer.location}</span><span className="flex items-center gap-1.5"><Monitor size={14} />{offer.workMode}</span></div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">{offer.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"><div className="flex flex-wrap gap-1.5">{offer.matchedSkills.slice(0, 3).map((skill) => <span key={skill} className="badge bg-emerald-50 text-emerald-700">{skill}</span>)}</div><ExternalLink size={16} className="text-cmc-teal" /></div>
    </Link>
  );
}
