import Logo from "./Logo";

export default function PublicFooter() {
  return (
    <footer className="bg-cmc-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div><Logo light /><p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Une plateforme CMC centrée sur le candidat, le matching explicable et la décision humaine de l'administration.</p></div>
        <div><p className="font-bold">Espace candidat</p><p className="mt-3 text-sm text-white/60">CV analysé par IA · Profil validé · Offres CMC · Opportunités externes · Candidatures</p></div>
        <div><p className="font-bold">Administration CMC</p><p className="mt-3 text-sm text-white/60">Pilotage stagiaires / lauréats · Offres partenaires · Review humaine · Analytics</p></div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">© 2026 CMC Connect — Nouvelle vision du projet</div>
    </footer>
  );
}
