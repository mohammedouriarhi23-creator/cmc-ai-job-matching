export const CECRL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

export const SKILL_LEVELS = ["Débutant", "Intermédiaire", "Avancé"]

export const SOFT_SKILLS_STAGIAIRE = [
  "Travail en équipe",
  "Communication",
  "Leadership",
  "Gestion du temps",
  "Esprit d'analyse",
  "Résolution de problèmes",
  "Créativité",
  "Autonomie",
  "Adaptabilité",
]

export const SOFT_SKILLS_LAUREAT = [
  "Communication",
  "Travail en équipe",
  "Leadership",
  "Gestion du stress",
  "Organisation",
  "Adaptabilité",
  "Résolution de problèmes",
  "Créativité",
]

export const SKILL_CATEGORIES_LAUREAT = [
  "Logiciels",
  "Langages",
  "Outils",
  "Réseaux",
  "Maintenance",
  "CAO/DAO",
  "Bureautique",
]

export const TYPES_STAGE = [
  "Stage d'observation",
  "Stage technique",
  "PFE",
  "Alternance",
  "Emploi étudiant",
]

export const TYPES_EXPERIENCE_STAGIAIRE = [
  "Stage",
  "Projet académique",
  "Projet personnel",
  "Freelance",
  "Bénévolat",
  "Club étudiant",
]

export const TYPES_EXPERIENCE_LAUREAT = ["Stage", "Emploi", "Alternance"]

export const CENTRES_INTERET = [
  "Sport",
  "Lecture",
  "Voyage",
  "Bénévolat associatif",
  "Nouvelles technologies",
  "Musique",
  "Arts & création",
  "Jeux vidéo",
]

export const SECTEURS = [
  "Informatique & Digital",
  "Industrie",
  "BTP",
  "Automobile",
  "Tourisme & Hôtellerie",
  "Offshoring & Gestion",
  "Textile & Cuir",
]

export const MODES_TRAVAIL = ["Sur site", "Télétravail", "Hybride"]

export const SITUATIONS_ACTUELLES = [
  "Recherche d'emploi",
  "Recherche de stage",
  "Recherche d'alternance",
  "Poursuite d'études",
  "En emploi",
  "Auto-entrepreneur",
  "Sans activité",
]

export const NIVEAUX_ETUDES_POURSUITE = ["Bac+3", "Bac+5", "Master", "Ingénieur"]

export const TYPES_OPPORTUNITE = ["CDI", "CDD", "Stage", "Stage PFE", "Alternance", "Freelance", "Mission ponctuelle"]

export const DISPONIBILITES = ["Immédiate", "Dans 15 jours", "Dans 1 mois", "Date précise"]

export const NIVEAUX_STAGIAIRE = ["Technicien", "Technicien Spécialisé"]

export const NIVEAUX_LAUREAT = ["Qualification", "Technicien", "Technicien Spécialisé"]

export const ANNEES_FORMATION = ["1ère année", "2ème année"]

export const ANNEES_OBTENTION = ["2023", "2024", "2025", "2026"]

const CURRENT_YEAR = new Date().getFullYear()
export const ANNEES_OBTENTION_PREVUE = Array.from({ length: 4 }, (_, i) => String(CURRENT_YEAR + i))
