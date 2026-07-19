import IdentiteStep from "../../components/wizard/steps/IdentiteStep"
import FormationStep from "../../components/wizard/steps/FormationStep"
import StageRechercheStep from "../../components/wizard/steps/StageRechercheStep"
import CompetencesStep from "../../components/wizard/steps/CompetencesStep"
import ParcoursStep from "../../components/wizard/steps/ParcoursStep"
import DocumentsProfilStep from "../../components/wizard/steps/DocumentsProfilStep"
import { SOFT_SKILLS_STAGIAIRE, TYPES_EXPERIENCE_STAGIAIRE } from "./options"
import { required, minLength, emailValid, phoneValid, passwordsMatch, collect } from "./validators"

const DOCUMENT_FIELDS = [
  { key: "cv", label: "CV (PDF)", required: true },
  { key: "lettreMotivation", label: "Lettre de motivation" },
  { key: "attestationScolarite", label: "Attestation de scolarité" },
  { key: "releveNotes", label: "Relevé de notes" },
  { key: "portfolioDocument", label: "Portfolio" },
]

const CONSENT_FIELDS = [
  { key: "consentPartage", label: "J'autorise le partage de mon profil aux entreprises partenaires" },
  { key: "consentConfidentialite", label: "J'accepte la politique de confidentialité" },
  { key: "consentExactitude", label: "Je certifie l'exactitude des informations fournies" },
]

export const stagiaireSteps = [
  {
    id: "identite",
    label: "Identité",
    initial: {
      nom: "",
      prenom: "",
      photo: null,
      photoError: null,
      dateNaissance: "",
      sexe: "",
      nationalite: "",
      ville: "",
      adresse: "",
      telephone: "",
      email: "",
      linkedin: "",
      portfolio: "",
      motDePasse: "",
      confirmationMotDePasse: "",
    },
    Component: (props) => IdentiteStep({ ...props, variant: "stagiaire" }),
    validate: (data) =>
      collect(
        ["nom", required(data.nom)],
        ["prenom", required(data.prenom)],
        ["dateNaissance", required(data.dateNaissance)],
        ["nationalite", required(data.nationalite)],
        ["ville", required(data.ville)],
        ["telephone", required(data.telephone) || phoneValid(data.telephone)],
        ["email", required(data.email) || emailValid(data.email)],
        ["motDePasse", required(data.motDePasse) || minLength(data.motDePasse, 8, "8 caractères minimum.")],
        ["confirmationMotDePasse", passwordsMatch(data.motDePasse, data.confirmationMotDePasse)]
      ),
  },
  {
    id: "formation",
    label: "Formation",
    initial: {
      filiere: "",
      niveau: "",
      anneeFormation: "",
      anneeObtentionPrevue: "",
      moyenneGenerale: "",
      classement: "",
    },
    Component: (props) => FormationStep({ ...props, variant: "stagiaire" }),
    validate: (data) =>
      collect(
        [
          "filiere",
          required(data.filiere) ||
            minLength(data.filiere, 2, "2 caractères minimum.") ||
            (data.filiere.length > 100 ? "100 caractères maximum." : null),
        ],
        ["niveau", required(data.niveau)],
        ["anneeFormation", required(data.anneeFormation)],
        ["anneeObtentionPrevue", required(data.anneeObtentionPrevue)]
      ),
  },
  {
    id: "stageRecherche",
    label: "Stage recherché",
    initial: {
      typeStage: "",
      domaineRecherche: "",
      dateDisponibilite: "",
      dureeSouhaitee: "",
      disponibiliteGeographique: "",
      mobilite: "",
      permisConduire: false,
      vehiculePersonnel: false,
    },
    Component: (props) => StageRechercheStep(props),
    validate: (data) =>
      collect(
        ["typeStage", required(data.typeStage)],
        ["domaineRecherche", required(data.domaineRecherche)],
        ["dateDisponibilite", required(data.dateDisponibilite)],
        ["dureeSouhaitee", required(data.dureeSouhaitee)]
      ),
  },
  {
    id: "competences",
    label: "Compétences",
    initial: { competencesTechniques: [], langues: [], softSkills: [] },
    Component: (props) => CompetencesStep({ ...props, softSkillsOptions: SOFT_SKILLS_STAGIAIRE }),
    validate: () => ({}),
  },
  {
    id: "parcours",
    label: "Parcours",
    initial: { experiences: [], projets: [], certifications: [] },
    Component: (props) =>
      ParcoursStep({
        ...props,
        experienceTypeOptions: TYPES_EXPERIENCE_STAGIAIRE,
        titreLabel: "Intitulé",
        organismeLabel: "Organisme",
        showLienDemo: true,
      }),
    validate: () => ({}),
  },
  {
    id: "documentsProfil",
    label: "Documents & Profil",
    initial: {
      cv: null,
      cvError: null,
      lettreMotivation: null,
      lettreMotivationError: null,
      attestationScolarite: null,
      attestationScolariteError: null,
      releveNotes: null,
      releveNotesError: null,
      portfolioDocument: null,
      portfolioDocumentError: null,
      centresInteret: [],
      centresInteretAutre: "",
      secteur: "",
      metier: "",
      salaireSouhaite: "",
      modeTravail: "",
      presentation: "",
      pourquoiCeStage: "",
      ceQuiVousDistingue: "",
      consentPartage: false,
      consentConfidentialite: false,
      consentExactitude: false,
    },
    Component: (props) =>
      DocumentsProfilStep({
        ...props,
        variant: "stagiaire",
        documentFields: DOCUMENT_FIELDS,
        consentFields: CONSENT_FIELDS,
      }),
    validate: (data) => {
      const errors = collect(
        ["cv", data.cv && !data.cv.stale ? null : "Le CV doit être sélectionné sur cet appareil."],
        [
          "presentation",
          data.presentation && (data.presentation.length < 500 || data.presentation.length > 1000)
            ? "La présentation doit contenir entre 500 et 1000 caractères."
            : null,
        ]
      )
      if (!data.consentPartage || !data.consentConfidentialite || !data.consentExactitude) {
        errors.consentements = "Les 3 consentements sont obligatoires."
      }
      return errors
    },
  },
]
