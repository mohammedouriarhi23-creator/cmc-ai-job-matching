"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, School } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const [type, setType] = useState<"STAGIAIRE" | "LAUREAT">("STAGIAIRE");
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl"><div className="flex items-center justify-between"><Logo /><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500"><ArrowLeft size={16} />Retour</Link></div><div className="mt-10 card p-8"><span className="badge bg-cmc-sky text-cmc-teal-dark">Étape 1 sur 3</span><h1 className="mt-4 text-3xl font-extrabold text-cmc-navy">Créer mon espace candidat</h1><p className="mt-2 text-gray-500">Le CMC doit distinguer les stagiaires des lauréats pour analyser leur activité et leurs candidatures.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{[{value:"STAGIAIRE",title:"Je suis stagiaire",desc:"Je suis encore en formation au CMC.",icon:School},{value:"LAUREAT",title:"Je suis lauréat",desc:"J'ai terminé ma formation au CMC.",icon:GraduationCap}].map((item) => { const Icon=item.icon; const selected=type===item.value; return <button key={item.value} onClick={() => setType(item.value as typeof type)} className={`rounded-xl border-2 p-5 text-left transition ${selected ? "border-cmc-teal bg-cmc-sky" : "border-gray-200 bg-white hover:border-cmc-teal/40"}`}><Icon className="text-cmc-teal-dark" /><h3 className="mt-4 font-extrabold text-cmc-navy">{item.title}</h3><p className="mt-1 text-sm text-gray-500">{item.desc}</p></button>})}</div><div className="mt-8 grid gap-4 md:grid-cols-2"><div><label className="label">Nom complet</label><input className="input" placeholder="Mohammed Saidi" /></div><div><label className="label">Email</label><input className="input" placeholder="email@exemple.com" /></div><div className="md:col-span-2"><label className="label">Mot de passe</label><input type="password" className="input" placeholder="8 caractères minimum" /></div></div><Link href="/candidat/profil" className="btn-primary mt-8 w-full">Créer mon compte et déposer mon CV</Link></div></div>
    </main>
  );
}
