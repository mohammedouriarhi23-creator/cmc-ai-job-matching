import { entreprises } from "./entreprises"

// Offres reflétant les offres réelles publiées sur connect.cmcoriental.com
export const secteurs = [
  "Informatique & Digital",
  "Télécommunications",
  "Finance & Banque",
  "Industrie & Mines",
  "Industrie Automobile",
  "Énergie & Utilities",
  "Transport & Logistique",
  "Commerce & Distribution",
]

export const villes = [...new Set(entreprises.map((e) => e.ville))]

export const typesOffre = ["Stage", "PFE", "Emploi"]

const offresBrutes = [
  {
    id: 1,
    poste: "Développeur Full Stack Laravel React",
    entrepriseId: 1,
    type: "Stage",
    secteur: "Informatique & Digital",
    programme: "Développement Digital",
    postes: 2,
    datePublication: "2026-07-01",
    dateLimite: "2026-07-31",
    description:
      "Nous recherchons un stagiaire développeur Full Stack pour rejoindre notre équipe. Missions : développement de nouvelles fonctionnalités, maintenance du code.",
    profilRecherche:
      "Étudiant en Développement Digital, à l'aise avec Laravel et React, rigoureux et autonome.",
    competences: ["Laravel", "React", "PHP", "JavaScript", "MySQL"],
  },
  {
    id: 2,
    poste: "Stagiaire Data Analyst",
    entrepriseId: 1,
    type: "PFE",
    secteur: "Informatique & Digital",
    programme: "Data BI",
    postes: 1,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-15",
    description:
      "Stage PFE en analyse de données et Business Intelligence. Travail sur des projets de visualisation.",
    profilRecherche: "Étudiant en Data BI, maîtrisant l'analyse de données et les outils de reporting.",
    competences: ["SQL", "Power BI", "Python", "Business Intelligence"],
  },
  {
    id: 3,
    poste: "Technicien Réseau Senior",
    entrepriseId: 2,
    type: "Emploi",
    secteur: "Télécommunications",
    programme: "Réseaux & Systèmes",
    postes: 2,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-30",
    description:
      "Poste technicien réseau et infrastructure. Responsable de la maintenance et de l'évolution de l'infrastructure réseau nationale.",
    profilRecherche: "Technicien Spécialisé en Réseaux & Systèmes, expérience en environnement télécom souhaitée.",
    competences: ["Réseaux", "Infrastructure télécom", "Supervision", "Sécurité réseau"],
  },
  {
    id: 4,
    poste: "Chargé de Clientèle Bancaire",
    entrepriseId: 3,
    type: "Emploi",
    secteur: "Finance & Banque",
    programme: "Banque Finance",
    postes: 5,
    datePublication: "2026-07-01",
    dateLimite: "2026-07-31",
    description:
      "Recrutement de chargés de clientèle pour notre réseau d'agences. Interlocuteur des clients particuliers et professionnels.",
    profilRecherche: "Technicien Spécialisé en Banque Finance, bon relationnel et sens du service client.",
    competences: ["Relation client", "Produits bancaires", "Vente", "Gestion de portefeuille"],
  },
  {
    id: 5,
    poste: "Stagiaire Géologue Terrain",
    entrepriseId: 4,
    type: "Stage",
    secteur: "Industrie & Mines",
    programme: "Géologie Mines",
    postes: 3,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-10",
    description:
      "Stage à la direction exploration et géologie. Participation aux campagnes terrain et aux analyses laboratoire.",
    profilRecherche: "Étudiant en Géologie Mines, disponible pour des missions terrain.",
    competences: ["Géologie", "Cartographie", "Analyse d'échantillons", "Terrain"],
  },
  {
    id: 6,
    poste: "Technicien Électricien",
    entrepriseId: 5,
    type: "Emploi",
    secteur: "Énergie & Utilities",
    programme: "Électrotechnique",
    postes: 4,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-20",
    description:
      "Recrutement de techniciens électriciens pour les équipes de maintenance et d'intervention sur le réseau de distribution.",
    profilRecherche: "Technicien Spécialisé en Électrotechnique, disponible pour des interventions terrain.",
    competences: ["Électrotechnique", "Maintenance", "Habilitation électrique", "Réseau de distribution"],
  },
  {
    id: 7,
    poste: "Développeur Mobile iOS Android",
    entrepriseId: 6,
    type: "Stage",
    secteur: "Télécommunications",
    programme: "Développement Mobile",
    postes: 1,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-05",
    description:
      "Stage développement mobile pour notre application client. Développement de modules paiement et géolocalisation.",
    profilRecherche: "Étudiant en Développement Mobile, connaissance de React Native ou Flutter appréciée.",
    competences: ["React Native", "Flutter", "API REST", "Paiement mobile"],
  },
  {
    id: 8,
    poste: "Agent Commercial Cargo",
    entrepriseId: 7,
    type: "Emploi",
    secteur: "Transport & Logistique",
    programme: "Commerce",
    postes: 3,
    datePublication: "2026-07-01",
    dateLimite: "2026-07-26",
    description:
      "Agents commerciaux pour le développement du portefeuille clients fret et cargo.",
    profilRecherche: "Technicien Spécialisé en Commerce, bon niveau en anglais, sens de la négociation.",
    competences: ["Vente B2B", "Anglais", "Logistique", "Négociation"],
  },
  {
    id: 9,
    poste: "Hôtesse de Caisse",
    entrepriseId: 8,
    type: "Emploi",
    secteur: "Commerce & Distribution",
    programme: "Commerce",
    postes: 6,
    datePublication: "2026-07-01",
    dateLimite: "2026-07-21",
    description:
      "Recrutement d'hôtes/hôtesses de caisse pour nos hypermarchés de la région Orientale. Formation assurée en interne.",
    profilRecherche: "Technicien en Commerce, souriant(e) et rigoureux(se), première expérience appréciée.",
    competences: ["Encaissement", "Relation client", "Rigueur", "Sens du service"],
  },
  {
    id: 10,
    poste: "Analyste Financier Junior",
    entrepriseId: 9,
    type: "PFE",
    secteur: "Finance & Banque",
    programme: "Finance",
    postes: 1,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-25",
    description:
      "PFE en analyse financière et gestion des risques crédit. Élaboration de modèles de scoring clients.",
    profilRecherche: "Étudiant en Finance, à l'aise avec Excel et l'analyse de risque.",
    competences: ["Analyse financière", "Excel avancé", "Gestion du risque", "Scoring crédit"],
  },
  {
    id: 11,
    poste: "Stagiaire Qualité Automobile",
    entrepriseId: 10,
    type: "PFE",
    secteur: "Industrie Automobile",
    programme: "Qualité",
    postes: 1,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-10",
    description:
      "Stage PFE au département qualité. Amélioration continue des processus de production et du contrôle qualité.",
    profilRecherche: "Étudiant en Qualité Industrielle, rigoureux et méthodique.",
    competences: ["Contrôle qualité", "Amélioration continue", "Lean Manufacturing", "Normes ISO"],
  },
  {
    id: 12,
    poste: "Ingénieur Systèmes",
    entrepriseId: 2,
    type: "Emploi",
    secteur: "Télécommunications",
    programme: "Infrastructure IT",
    postes: 1,
    datePublication: "2026-07-01",
    dateLimite: "2026-08-15",
    description:
      "Ingénieur systèmes à la direction informatique. Expérience Linux et cloud requise. Gestion d'infrastructure critique.",
    profilRecherche: "Technicien Spécialisé en Infrastructure IT, maîtrise de Linux et des environnements cloud.",
    competences: ["Linux", "Cloud", "Infrastructure IT", "Virtualisation"],
  },
  {
    id: 13,
    poste: "Stage PFE - Développement Informatique",
    entrepriseId: 10,
    type: "PFE",
    secteur: "Informatique & Digital",
    programme: "Développement Digital",
    postes: 1,
    datePublication: "2026-07-09",
    dateLimite: "2026-07-31",
    description: "Stage PFE sur le développement informatique interne du site industriel.",
    profilRecherche: "Étudiant en Développement Digital en fin de cursus.",
    competences: ["Développement web", "Bases de données", "Gestion de projet"],
  },
]

export const offres = offresBrutes.map((o) => {
  const entreprise = entreprises.find((e) => e.id === o.entrepriseId)
  return {
    ...o,
    entreprise: entreprise?.nom,
    entrepriseInitiale: entreprise?.nom?.[0] ?? "?",
    entrepriseCouleur: entreprise?.couleur ?? "#3dabc4",
    ville: entreprise?.ville ?? "Oujda",
  }
})

export function getOffreById(id) {
  return offres.find((o) => o.id === Number(id))
}

export function getOffresSimilaires(offre, limit = 3) {
  return offres
    .filter((o) => o.id !== offre.id && (o.secteur === offre.secteur || o.type === offre.type))
    .slice(0, limit)
}

export function joursRestants(dateLimite) {
  const diff = new Date(dateLimite).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
