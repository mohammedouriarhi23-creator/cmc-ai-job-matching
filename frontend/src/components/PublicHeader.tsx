import Link from "next/link";
import Logo from "./Logo";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-gray-600 md:flex">
          <Link href="/" className="hover:text-cmc-teal">Accueil</Link>
          <Link href="/offres" className="hover:text-cmc-teal">Opportunités</Link>
          <Link href="/#fonctionnement" className="hover:text-cmc-teal">Comment ça marche</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-secondary">Connexion</Link>
          <Link href="/register" className="btn-primary hidden sm:inline-flex">Créer mon profil</Link>
        </div>
      </div>
    </header>
  );
}
