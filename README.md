

````markdown
# CMC AI Job Matching

Plateforme de matching intelligent et explicable entre les profils des candidats du CMC et les offres d’emploi ou de stage.

## Lancer le projet après l’avoir récupéré depuis GitHub

### Prérequis

Installer :

- Git ;
- Python ;
- Node.js ;
- Docker Desktop.

### 1. Cloner le dépôt

```powershell
git clone https://github.com/mohammedouriarhi23-creator/cmc-ai-job-matching.git
cd cmc-ai-job-matching
```

### 2. Démarrer PostgreSQL

Ouvrir Docker Desktop, puis exécuter depuis la racine du projet :

```powershell
docker compose up -d postgres
```

### 3. Installer le backend

```powershell
cd backend
py -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Dans `backend/.env`, renseigner notamment :

```env
DATABASE_URL=postgresql+psycopg2://cmc_user:cmc_password@localhost:5432/cmc_connect
SECRET_KEY=UNE_LONGUE_CLE_SECRETE
GEMINI_API_KEY=
```

La clé Gemini est facultative, mais nécessaire pour utiliser l’analyse IA des CV.

### 4. Préparer et lancer l’API

Toujours dans le dossier `backend` :

```powershell
.\venv\Scripts\alembic.exe upgrade head
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

L’API sera disponible sur :

- http://localhost:8000
- http://localhost:8000/docs
- http://localhost:8000/health

### 5. Installer et lancer le frontend

Ouvrir un deuxième terminal :

```powershell
cd C:\chemin\vers\cmc-ai-job-matching\frontend-mock
npm install
npm run dev
```

Le site sera disponible sur :

- http://localhost:5173

### 6. Créer un compte administrateur

Depuis le dossier `backend` :

```powershell
.\venv\Scripts\python.exe scripts\create_admin.py
```

Saisir ensuite l’adresse email et le mot de passe de l’administrateur.

Chaque personne possède sa propre base PostgreSQL, ses propres comptes et son propre fichier `.env`. Ces données privées ne sont pas récupérées depuis GitHub.

---

## Étapes de réalisation du projet

### Étape 1 — Définition du besoin ✅

Au début, le projet devait utiliser un dataset et entraîner un modèle de Machine Learning pour effectuer le matching.

Après analyse, cette approche a été abandonnée, car nous ne disposons pas d’un dataset réel et suffisamment fiable.

Le projet a donc été redéfini comme une plateforme de **matching intelligent et explicable**, sans entraînement d’un modèle sur un dataset.

Le système compare directement :

- le profil du candidat ;
- les compétences du candidat ;
- ses expériences et ses projets ;
- ses préférences ;
- les exigences de l’offre.

Il produit ensuite un score de compatibilité accompagné d’une explication.

---

### Étape 2 — Définition des utilisateurs ✅

La plateforme contient deux espaces.

#### Espace candidat

Un candidat peut être :

- `STAGIAIRE` : encore en formation au CMC ;
- `LAUREAT` : ayant terminé sa formation.

Les stagiaires et les lauréats utilisent le même espace candidat, mais leur type est enregistré dans leur profil.

#### Espace administration CMC

L’administration peut :

- gérer les candidats ;
- différencier les stagiaires et les lauréats ;
- publier des offres ;
- gérer les entreprises partenaires ;
- consulter les candidatures ;
- analyser les scores ;
- sélectionner manuellement les candidats ;
- consulter les statistiques.

Il n’existe pas d’espace de connexion pour les entreprises. Les offres des entreprises partenaires sont gérées par l’administration du CMC.

---

### Étape 3 — Définition du parcours candidat ✅

Le parcours prévu est le suivant :

```text
Création du compte
        ↓
Choix : stagiaire ou lauréat
        ↓
Dépôt du CV
        ↓
Lecture du CV
        ↓
Analyse du CV par une IA
        ↓
Extraction des informations
        ↓
Vérification et correction par le candidat
        ↓
Formulaire complémentaire
        ↓
Profil complet
        ↓
Matching avec les offres
        ↓
Candidature
        ↓
Analyse par l’administration
```

L’IA doit extraire principalement :

- le résumé professionnel ;
- les compétences ;
- les expériences ;
- les projets ;
- les formations ;
- les langues ;
- les certifications.

L’IA doit comprendre les différentes façons de nommer les sections d’un CV.

Par exemple :

- Profil ;
- À propos ;
- Résumé professionnel ;
- Professional Summary.

Toutes ces sections doivent être transformées vers un même champ standard.

---

### Étape 4 — Création du frontend ✅

Le frontend a été créé par un membre de l’équipe et ajouté au dépôt GitHub.

Il contient actuellement les interfaces principales :

- espace candidat ;
- espace administration ;
- tableau de bord ;
- gestion du profil ;
- offres ;
- candidatures ;
- entreprises partenaires ;
- analyse des candidats ;
- statistiques.

Les écrans d’authentification, de profil, de CV, d’entreprises partenaires, d’offres et de candidatures utilisent maintenant les vraies données du backend et de PostgreSQL.

Certaines statistiques générales des tableaux de bord utilisent encore des valeurs de démonstration. Leur connexion complète est prévue à l’Étape 24.

Le dossier du frontend est actuellement :

```text
frontend-mock/
```

Il pourra être renommé plus tard en :

```text
frontend/
```

---

### Étape 5 — Création du backend ✅

Un backend a été créé avec FastAPI.

Le backend a été ajouté dans le même dépôt, à côté du frontend.

La structure actuelle est similaire à :

```text
cmc-ai-job-matching/
├── frontend-mock/
├── backend/
├── docker-compose.yml
└── .gitignore
```

Le backend contient les dossiers suivants :

```text
backend/app/
├── core/
├── models/
├── routers/
├── schemas/
├── services/
└── utils/
```

Chaque dossier possède un rôle précis :

- `core` : configuration et connexion à la base ;
- `models` : tables SQLAlchemy ;
- `schemas` : validation des données avec Pydantic ;
- `routers` : routes de l’API ;
- `services` : logique métier ;
- `utils` : fonctions générales.

---

### Étape 6 — Configuration de PostgreSQL ✅

PostgreSQL a été configuré avec Docker Compose.

Le backend utilise une variable `DATABASE_URL` pour se connecter à la base de données.

Le fichier local :

```text
backend/.env
```

contient les vraies informations de connexion et ne doit pas être envoyé sur GitHub.

Le fichier :

```text
backend/.env.example
```

est ajouté au dépôt pour montrer aux autres membres de l’équipe les variables nécessaires.

Une incompatibilité entre un ancien volume PostgreSQL 15 et PostgreSQL 16 a été détectée.

L’ancien volume a été supprimé afin de recréer une base PostgreSQL 16 propre.

---

### Étape 7 — Création des premiers modèles ✅

Trois premiers modèles ont été développés.

#### User

Le modèle `User` contient :

- l’email ;
- le mot de passe chiffré ;
- le rôle ;
- l’état du compte ;
- la date de création.

Les rôles sont :

- `ADMIN` ;
- `CANDIDATE`.

#### CandidateProfile

Le modèle `CandidateProfile` contient :

- le nom ;
- le prénom ;
- le téléphone ;
- la ville ;
- le résumé professionnel ;
- le type du candidat ;
- le statut du profil.

Les types de candidats sont :

- `STAGIAIRE` ;
- `LAUREAT`.

Les statuts du profil permettent de suivre son avancement :

- nouveau ;
- CV en cours d’analyse ;
- CV en attente de confirmation ;
- profil incomplet ;
- profil complété.

#### CvExtraction

Le modèle `CvExtraction` a été créé pour pouvoir conserver :

- le nom du CV ;
- le chemin du fichier ;
- le texte extrait ;
- le résultat JSON produit par l’IA ;
- le statut du traitement ;
- les erreurs éventuelles ;
- la date de confirmation.

Dans l’implémentation actuelle, l’analyse Gemini reste sans état : le fichier et son résultat ne sont pas enregistrés dans cette table.

Le candidat confirme directement les données dans le wizard, puis le profil validé est sauvegardé lors de l’Étape 16.

---

### Étape 8 — Configuration d’Alembic ✅

Alembic a été configuré pour gérer les modifications de la base de données.

Une première migration a été générée afin de créer les tables :

```text
users
candidate_profiles
cv_extractions
```

Cette migration est présente dans :

```text
backend/alembic/versions/
```

Alembic permet à tous les membres de l’équipe de recréer la même structure de base de données.

---

### Étape 9 — Intégration dans le dépôt GitHub ✅

Le frontend créé par un membre de l’équipe était déjà présent dans le dépôt.

Le backend développé séparément a ensuite été copié et ajouté dans ce même dépôt.

Les fichiers suivants ont été ajoutés :

- le backend FastAPI ;
- les modèles SQLAlchemy ;
- la configuration Alembic ;
- les migrations ;
- le fichier `requirements.txt` ;
- le fichier `.env.example` ;
- le fichier `docker-compose.yml` ;
- le fichier `.gitignore`.

Les fichiers suivants ne sont pas envoyés sur GitHub :

- `backend/venv/` ;
- `backend/.env` ;
- `frontend-mock/node_modules/` ;
- `backend/storage/candidate_documents/` ;
- `backend/.pytest_cache/` ;
- les fichiers temporaires Python.

---

### Étape 10 — Vérifier et appliquer la première migration ✅

Les vérifications suivantes ont été réalisées :

- PostgreSQL fonctionne avec Docker Compose ;
- le backend se connecte correctement à PostgreSQL ;
- les migrations Alembic sont appliquées ;
- les tables sont présentes ;
- FastAPI démarre correctement ;
- les routes `/` et `/health` répondent.

Cette étape valide définitivement la base technique.

---

### Étape 11 — Développer l’authentification ✅

La vraie authentification est opérationnelle.

Les mots de passe sont hachés, les sessions utilisent des tokens JWT et les rôles `CANDIDATE` et `ADMIN` sont séparés.

Les fonctionnalités disponibles sont :

- inscription d’un candidat avec création automatique de son `CandidateProfile` ;
- connexion avec email et mot de passe ;
- récupération de l’utilisateur connecté avec `GET /api/auth/me` ;
- protection des routes selon le rôle ;
- compte administrateur ;
- restauration de la session après rechargement du frontend.

Les parcours candidat et administrateur ont été validés par le test d’intégration.

---

### Étape 12 — Connecter l’authentification au frontend ✅

Les boutons et utilisateurs fictifs du frontend ont été remplacés par une vraie authentification :

- formulaire de connexion qui appelle `POST /api/auth/login` ;
- inscription qui appelle `POST /api/auth/register` ;
- connexion automatique après l’inscription ;
- session restaurée avec `GET /api/auth/me` ;
- redirection selon le rôle ;
- pages protégées pour les candidats et les administrateurs.

Le formulaire d’inscription a été transformé en wizard multi-étapes.

Il contient six étapes par profil :

- identité ;
- formation ;
- stage recherché ou situation actuelle ;
- compétences ;
- parcours ;
- documents et profil.

Le wizard sauvegarde un brouillon dans `localStorage`.

Les mots de passe ne sont jamais conservés dans ce brouillon.

Après la création du compte, le profil complet est envoyé au backend et les documents sont téléversés séparément dans le stockage privé.

---

### Étape 13 — Développer le dépôt du CV ✅

Le candidat peut déposer un CV PDF, JPG ou PNG directement dans le wizard d’inscription.

La route d’analyse IA reste volontairement sans état :

- le fichier est lu en mémoire ;
- il est envoyé à l’IA ;
- il est supprimé de la mémoire à la fin de la requête.

Après la validation du wizard et la création du compte, le CV est téléversé dans un stockage privé et référencé par la table `candidate_documents`.

Les validations comprennent :

- formats PDF, JPG et PNG ;
- taille maximale de 5 Mo ;
- maximum de 10 pages pour un PDF ;
- vérification de la signature réelle du fichier.

---

### Étape 14 — Développer l’analyse IA du CV ✅

Le fichier du CV est envoyé directement à Google Gemini avec le modèle configuré dans le backend.

Cette approche permet de traiter :

- les PDF contenant du texte ;
- les PDF scannés ;
- les images JPG ;
- les images PNG.

L’IA renvoie une structure JSON contenant notamment :

- l’identité ;
- la formation ;
- les compétences techniques ;
- les langues ;
- les soft skills ;
- les expériences ;
- les projets ;
- les certifications ;
- la présentation.

Chaque donnée possède un niveau de confiance :

- `high` ;
- `medium` ;
- `low`.

La route utilisée est :

```text
POST /api/cv/parse
```

Les protections comprennent :

- délai maximal de traitement ;
- nouvel essai si la réponse IA est invalide ;
- limitation du nombre d’analyses par adresse IP ;
- absence de contenu personnel dans les logs ;
- erreur claire si `GEMINI_API_KEY` n’est pas configurée.

---

### Étape 15 — Développer la validation du CV ✅

Après l’extraction, une fenêtre de revue affiche les informations détectées avec leur niveau de confiance.

Le candidat peut :

- accepter ou refuser chaque champ ;
- tout accepter ;
- tout ignorer ;
- voir les informations non détectées.

Les règles suivantes sont appliquées :

- une valeur saisie manuellement n’est jamais écrasée automatiquement ;
- les listes sont fusionnées sans doublons ;
- les comparaisons ignorent la casse et les accents ;
- un badge indique les champs extraits du CV.

Cette validation se déroule pendant l’inscription.

---

### Étape 16 — Compléter les modèles du candidat ✅

Le profil complet est sauvegardé de deux manières :

- en JSONB comme représentation complète du wizard ;
- dans des tables structurées utilisables par le futur moteur de matching.

Les données structurées comprennent :

- la formation ;
- les compétences techniques ;
- les langues ;
- les soft skills ;
- les expériences ;
- les projets ;
- les certifications ;
- les préférences ;
- les disponibilités ;
- la mobilité ;
- les documents.

Les routes permettent :

- de récupérer le profil complet ;
- de modifier le profil ;
- de mettre à jour les informations principales ;
- de téléverser un document ;
- de télécharger un document ;
- de supprimer un document.

Un script idempotent permet de synchroniser les anciens profils JSONB :

```powershell
python -m scripts.backfill_candidate_profiles
```

Les données existantes ont été migrées vers les nouvelles tables structurées.

---

### Étape 17 — Gestion des entreprises partenaires ✅

L’administration peut enregistrer et gérer les entreprises partenaires du CMC.

Chaque entreprise peut contenir :

- un nom ;
- un secteur ;
- une ville ;
- un email ;
- un téléphone ;
- un contact ;
- un site internet ;
- une description ;
- un statut de partenariat.

Les statuts disponibles sont :

- `PENDING` ;
- `ACTIVE` ;
- `INACTIVE`.

Les entreprises ne disposent pas d’un compte de connexion.

Les fonctionnalités disponibles sont :

- création ;
- consultation ;
- modification ;
- suppression protégée ;
- filtrage ;
- pagination ;
- affichage public des entreprises actives.

Le backend et les écrans React sont connectés.

---

### Étape 18 — Gestion des offres CMC ✅

L’administration peut créer et gérer les offres.

Une offre contient :

- un titre ;
- une description ;
- une entreprise ;
- un secteur ;
- une localisation ;
- un type de contrat ;
- un public ciblé ;
- des compétences obligatoires ;
- des compétences souhaitées ;
- un niveau de formation ;
- une expérience demandée ;
- une date limite ;
- un mode de travail ;
- un nombre de postes ;
- un statut.

Le public ciblé peut être :

- `STAGIAIRE` ;
- `LAUREAT` ;
- `BOTH`.

Les modes de travail sont :

- `ONSITE` ;
- `REMOTE` ;
- `HYBRID`.

Les fonctionnalités disponibles sont :

- création ;
- modification ;
- publication ;
- archivage ;
- suppression protégée ;
- filtres ;
- pagination ;
- contrôle des dates limites ;
- affichage public ;
- affichage administratif ;
- recherche adaptée au type du candidat.

Le backend et le frontend sont connectés.

---

### Étape 19 — Développer le moteur de matching ⏳ Prochaine étape

Le moteur de matching comparera les profils avec les offres.

Il utilisera notamment :

- les compétences obligatoires ;
- les compétences souhaitées ;
- le domaine ;
- les expériences ;
- les projets ;
- la formation ;
- la localisation ;
- la disponibilité ;
- les préférences ;
- la similarité sémantique.

Le résultat comprendra :

- un score global ;
- des sous-scores ;
- les compétences correspondantes ;
- les compétences manquantes ;
- les points forts ;
- les critères non satisfaits ;
- une explication compréhensible.

Aucun dataset d’entraînement ne sera nécessaire.

---

### Étape 20 — Développer les candidatures ✅

Le candidat peut sélectionner une offre et postuler.

Pour postuler, il doit :

- être connecté comme candidat ;
- posséder un profil complet ;
- posséder un véritable CV enregistré ;
- correspondre au public ciblé par l’offre ;
- respecter la date limite.

Les statuts disponibles sont :

- `SUBMITTED` ;
- `UNDER_REVIEW` ;
- `SHORTLISTED` ;
- `INTERVIEW` ;
- `ACCEPTED` ;
- `REJECTED` ;
- `WITHDRAWN`.

Le candidat peut :

- postuler ;
- suivre ses candidatures ;
- consulter le détail ;
- retirer une candidature ;
- postuler à nouveau après un retrait.

L’administration peut :

- consulter les candidatures ;
- filtrer les candidatures ;
- télécharger le CV protégé ;
- ajouter une note ;
- modifier le statut selon les transitions autorisées.

Une note administrative n’est jamais affichée au candidat.

Le backend et les écrans React utilisent les vraies données.

---

### Étape 21 — Développer la revue administrative 🟡 Partiellement réalisée

Une première version de la revue administrative est disponible.

L’administration peut déjà :

- voir les candidats ayant postulé ;
- filtrer les stagiaires et les lauréats ;
- consulter leurs coordonnées ;
- voir leur type de profil ;
- télécharger leur CV ;
- ajouter une note administrative ;
- modifier leur statut ;
- présélectionner un candidat ;
- convoquer un candidat en entretien ;
- accepter ou refuser une candidature.

Il reste à connecter la revue au moteur de matching afin de :

- classer les candidats ;
- consulter leur profil structuré complet ;
- afficher leur score ;
- expliquer le score ;
- montrer les compétences présentes ;
- montrer les compétences manquantes ;
- comparer les candidats.

La décision finale restera humaine.

---

### Étape 22 — Développer les notifications ⬜ À faire

Le candidat recevra des notifications lors des changements importants :

- candidature reçue ;
- candidature en cours d’analyse ;
- présélection ;
- entretien ;
- sélection ;
- refus ;
- nouvelle offre compatible.

Les notifications pourront être envoyées :

- dans la plateforme ;
- par email.

---

### Étape 23 — Ajouter les offres externes ⬜ À faire

Lorsque les offres CMC et le moteur de matching fonctionneront correctement, un système de collecte d’offres externes sera ajouté.

Les offres devront être :

- récupérées ;
- nettoyées ;
- normalisées ;
- vérifiées ;
- dédupliquées ;
- enregistrées avec la source `SCRAPING`.

Elles utiliseront ensuite le même moteur de matching.

---

### Étape 24 — Connecter les tableaux de bord 🟡 Partiellement réalisée

Les pages suivantes utilisent déjà les vraies données PostgreSQL :

- profil candidat ;
- CV ;
- entreprises ;
- offres ;
- candidatures ;
- administration des entreprises ;
- administration des offres ;
- administration des candidatures.

Il reste à remplacer les statistiques générales encore fictives par des indicateurs calculés par le backend.

L’administration pourra notamment consulter :

- le nombre de stagiaires ;
- le nombre de lauréats ;
- les utilisateurs actifs ;
- le nombre de candidatures ;
- le taux de sélection ;
- les filières les plus actives ;
- les offres les plus consultées ;
- les compétences les plus demandées ;
- les compétences les plus manquantes ;
- les offres CMC et externes.

---

### Étape 25 — Tests, sécurité et déploiement 🟡 Partiellement réalisée

#### Éléments déjà réalisés

- tests unitaires frontend ;
- test d’intégration backend ;
- vérification des rôles ;
- sécurisation des mots de passe ;
- absence des mots de passe dans les brouillons locaux ;
- sécurisation des CV ;
- stockage privé des documents ;
- protection des données personnelles ;
- validation du format des fichiers ;
- validation de la taille des fichiers ;
- validation de la signature des fichiers ;
- reconstruction complète d’une base vide avec Alembic ;
- vérification du schéma Alembic ;
- vérification des dépendances Python ;
- lint du frontend ;
- tests du frontend ;
- build de production React ;
- documentation de l’état du projet.

#### Éléments restant à réaliser

- tests du moteur de matching ;
- tests supplémentaires de l’ensemble du projet ;
- conteneurisation complète du backend et du frontend ;
- intégration continue ;
- déploiement continu ;
- préparation de l’environnement de production ;
- documentation finale d’exploitation.

---

## État actuel du projet

Les étapes **1 à 18 sont terminées**.

L’Étape **20 — Candidatures** est également terminée en avance.

Nous sommes actuellement à l’**Étape 19 — Développer le moteur de matching**.

Ordre de travail prévu :

```text
Étape 19 — Moteur de matching
        ↓
Étape 21 — Revue administrative complète
        ↓
Étape 22 — Notifications
        ↓
Étape 23 — Offres externes
        ↓
Étape 24 — Statistiques réelles
        ↓
Étape 25 — Finalisation, sécurité et déploiement
```

La prochaine tâche doit donc concerner uniquement le moteur de matching, sans commencer plusieurs étapes en parallèle.
````
