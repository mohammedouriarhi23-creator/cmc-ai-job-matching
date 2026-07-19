import IdentiteStep from "../../components/wizard/steps/IdentiteStep"
import FormationStep from "../../components/wizard/steps/FormationStep"
import SituationRechercheStep from "../../components/wizard/steps/SituationRechercheStep"
import ParcoursStep from "../../components/wizard/steps/ParcoursStep"
import CompetencesStep from "../../components/wizard/steps/CompetencesStep"
import DocumentsProfilStep from "../../components/wizard/steps/DocumentsProfilStep"
import { SOFT_SKILLS_LAUREAT, SKILL_CATEGORIES_LAUREAT, TYPES_EXPERIENCE_LAUREAT } from "./options"
import { required, minLength, emailValid, phoneValid, passwordsMatch, collect } from "./validators"

const DOCUMENT_FIELDS = [
  { key: "cv", label: "CV", required: true },
  { key: "lettreMotivation", label: "Lettre de motivation" },
  { key: "diplomeOfppt", label: "Diplôme OFPPT" },
  { key: "attestationsStage", label: "Attestations de stage" },
  { key: "certificats", label: "Certificats" },
  { key: "portfolioDocument", label: "Portfolio" },
]

const CONSENT_FIELDS = [
  { key: "consentPartage", label: "J'autorise la diffusion de mon profil aux entreprises" },
  { key: "consentConfidentialite", label: "J'accepte la politique de confidentialité" },
]

export const laureatSteps = [
  {
    id: "identite",
    label: "Identité",
    initial: {
      nom: "",
      prenom: "",
      photo: null,
      photoError: null,
      dateNaissance: "",
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
    Component: (props) => IdentiteStep({ ...props, variant: "laureat" }),
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
    label: "Diplôme OFPPT",
    initial: { filiere: "", niveau: "", anneeObtention: "", mention: "" },
    Component: (props) => FormationStep({ ...props, variant: "laureat" }),
    validate: (data) =>
      collect(
        [
          "filiere",
          required(data.filiere) ||
            minLength(data.filiere, 2, "2 caractères minimum.") ||
            (data.filiere.length > 100 ? "100 caractères maximum." : null),
        ],
        ["niveau", required(data.niveau)],
        ["anneeObtention", required(data.anneeObtention)]
      ),
  },
  {
    id: "situationRecherche",
    label: "Situation & Recherche",
    initial: {
      situationActuelle: "",
      universiteEcole: "",
      formationActuelle: "",
      niveauEtudesPoursuite: "",
      anneeEtude: "",
      typesOpportunite: [],
      disponibilite: "",
      dateDisponibilitePrecise: "",
      villeSouhaitee: "",
      regionsAcceptees: "",
      mobiliteNationale: false,
      mobiliteInternationale: false,
      permisB: false,
      vehiculePersonnel: false,
    },
    Component: (props) => SituationRechercheStep(props),
    validate: (data) => {
      const errors = collect(["situationActuelle", required(data.situationActuelle)])
      if (data.situationActuelle === "Poursuite d'études") {
        Object.assign(
          errors,
          collect(
            ["universiteEcole", required(data.universiteEcole)],
            ["formationActuelle", required(data.formationActuelle)],
            ["niveauEtudesPoursuite", required(data.niveauEtudesPoursuite)],
            ["anneeEtude", required(data.anneeEtude)]
          )
        )
      }
      return errors
    },
  },
  {
    id: "parcours",
    label: "Parcours",
    initial: { experiences: [], projets: [], certifications: [] },
    Component: (props) =>
      ParcoursStep({
        ...props,
        experienceTypeOptions: TYPES_EXPERIENCE_LAUREAT,
        titreLabel: "Poste",
        organismeLabel: "Entreprise",
        showLienDemo: false,
      }),
    validate: () => ({}),
  },
  {
    id: "competences",
    label: "Compétences",
    initial: { competencesTechniques: [], langues: [], softSkills: [] },
    Component: (props) =>
      CompetencesStep({
        ...props,
        softSkillsOptions: SOFT_SKILLS_LAUREAT,
        skillCategoryOptions: SKILL_CATEGORIES_LAUREAT,
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
      diplomeOfppt: null,
      diplomeOfpptError: null,
      attestationsStage: null,
      attestationsStageError: null,
      certificats: null,
      certificatsError: null,
      portfolioDocument: null,
      portfolioDocumentError: null,
      presentation: "",
      consentPartage: false,
      consentConfidentialite: false,
    },
    Component: (props) =>
      DocumentsProfilStep({
        ...props,
        variant: "laureat",
        documentFields: DOCUMENT_FIELDS,
        consentFields: CONSENT_FIELDS,
      }),
    validate: (data) => {
      const errors = collect(
        ["cv", data.cv && !data.cv.stale ? null : "Le CV doit être sélectionné sur cet appareil."],
        [
          "presentation",
          required(data.presentation) ||
            (data.presentation.length < 500 || data.presentation.length > 1000
              ? "La présentation doit contenir entre 500 et 1000 caractères."
              : null),
        ]
      )
      if (!data.consentPartage || !data.consentConfidentialite) {
        errors.consentements = "Les consentements sont obligatoires."
      }
      return errors
    },
  },
]
