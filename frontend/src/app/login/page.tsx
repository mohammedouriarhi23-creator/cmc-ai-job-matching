import Link from "next/link";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-cmc-hero p-12 text-white lg:flex lg:flex-col lg:justify-between"><Logo light /><div><span className="badge bg-white/10 text-cmc-teal">CMC Connect</span><h1 className="mt-5 text-5xl font-extrabold leading-tight">Deux espaces. Une plateforme plus claire.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-white/60">Le candidat construit son profil à partir du CV. L'administration CMC pilote les opportunités et prend la décision finale.</p></div><p className="text-sm text-white/40">Stagiaires · Lauréats · Administration CMC</p></section>
      <section className="flex items-center justify-center p-6"><div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500"><ArrowLeft size={16} />Retour</Link><h2 className="text-3xl font-extrabold text-cmc-navy">Connexion</h2><p className="mt-2 text-gray-500">Accédez à votre espace CMC Connect.</p><div className="mt-8 space-y-5"><div><label className="label">Adresse email</label><div className="relative"><Mail size={17} className="absolute left-3 top-3 text-gray-400" /><input className="input pl-10" placeholder="vous@cmc.ma" /></div></div><div><label className="label">Mot de passe</label><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-3 text-gray-400" /><input type="password" className="input pl-10" placeholder="••••••••" /></div></div><Link href="/candidat" className="btn-primary w-full">Se connecter comme candidat</Link><Link href="/admin" className="btn-dark w-full">Voir la démo administration</Link></div><p className="mt-6 text-center text-sm text-gray-500">Nouveau candidat ? <Link href="/register" className="font-bold text-cmc-teal-dark">Créer un profil</Link></p></div></section>
    </main>
  );
}
