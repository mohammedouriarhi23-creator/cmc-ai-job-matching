export type CandidateType = "STAGIAIRE" | "LAUREAT";
export type OfferSource = "CMC" | "SCRAPING";
export type Audience = CandidateType | "BOTH";

export interface Offer {
  id: number;
  title: string;
  company: string;
  location: string;
  workMode: string;
  opportunityType: string;
  source: OfferSource;
  audience: Audience;
  score: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  publishedAt: string;
  externalSource?: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  type: CandidateType;
  filiere: string;
  city: string;
  applications: number;
  activity: "Très actif" | "Actif" | "Peu actif";
  score?: number;
  skills: string[];
}
