import { Link } from "react-router-dom"
import { MessageCircle, Globe, Wifi, Share2, MapPin, Mail, Phone } from "lucide-react"
import Logo from "../ui/Logo"

const socialIcons = [MessageCircle, Globe, Wifi, Share2]

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-gray-300">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        <div>
          <div className="mb-4">
            <Logo light />
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            La plateforme officielle de mise en relation entre les stagiaires, lauréats et
            entreprises partenaires de la Cité des Métiers et des Compétences de l'Oriental.
          </p>
          <div className="mt-5 flex gap-3">
            {socialIcons.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Réseau social"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-[#3dabc4] hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Navigation
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/offres" className="hover:text-white">
                Offres
              </Link>
            </li>
            <li>
              <Link to="/entreprises" className="hover:text-white">
                Entreprises
              </Link>
            </li>
            <li>
              <Link to="/connexion" className="hover:text-white">
                Se connecter
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-[#3dabc4]" />
              contact@cmc.ma
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-[#3dabc4]" />
              +212 500 000 000
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#3dabc4]" />
              Route de l'Avenir, Maroc
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-gray-400 sm:flex-row">
          <p>© 2026 Cité des Métiers et des Compétences. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-white">
              CGU
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
