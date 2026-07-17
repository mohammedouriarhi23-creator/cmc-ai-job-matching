## Étapes de réalisation du projet

### Étape 1 — Définition du besoin

Au début, le projet devait utiliser un dataset et entraîner un modèle de Machine Learning pour effectuer le matching.

Après analyse, cette approche a été abandonnée, car nous ne disposons pas d’un dataset réel et suffisamment fiable.

Le projet a donc été redéfini comme une plateforme de **matching intelligent et explicable**, sans entraînement d’un modèle sur un dataset.

Le système compare directement :

* le profil du candidat ;
* les compétences du candidat ;
* ses expériences et ses projets ;
* ses préférences ;
* les exigences de l’offre.

Il produit ensuite un score de compatibilité accompagné d’une explication.

---

### Étape 2 — Définition des utilisateurs

La plateforme contient deux espaces.

#### Espace candidat

Un candidat peut être :

* `STAGIAIRE` : encore en formation au CMC ;
* `LAUREAT` : ayant terminé sa formation.

Les stagiaires et les lauréats utilisent le même espace candidat, mais leur type est enregistré dans leur profil.

#### Espace administration CMC

L’administration peut :

* gérer les candidats ;
* différencier les stagiaires et les lauréats ;
* publier des offres ;
* gérer les entreprises partenaires ;
* consulter les candidatures ;
* analyser les scores ;
* sélectionner manuellement les candidats ;
* consulter les statistiques.

Il n’existe pas d’espace de connexion pour les entreprises. Les offres des entreprises partenaires sont gérées par l’administration du CMC.

---

### Étape 3 — Définition du parcours candidat

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

* le résumé professionnel ;
* les compétences ;
* les expériences ;
* les projets ;
* les formations ;
* les langues ;
* les certifications.

L’IA doit comprendre les différentes façons de nommer les sections d’un CV.

Par exemple :

* Profil ;
* À propos ;
* Résumé professionnel ;
* Professional Summary.

Toutes ces sections doivent être transformées vers un même champ standard.

---

### Étape 4 — Création du frontend

Le frontend a été créé par un membre de l’équipe et ajouté au dépôt GitHub.

Il contient actuellement les interfaces principales :

* espace candidat ;
* espace administration ;
* tableau de bord ;
* gestion du profil ;
* offres ;
* candidatures ;
* entreprises partenaires ;
* analyse des candidats ;
* statistiques.

Le frontend utilise encore des données de démonstration.

Ces données seront progressivement remplacées par les vraies données provenant du backend et de PostgreSQL.

Le dossier du frontend est actuellement :

```text
frontend-mock/
```

Il pourra être renommé plus tard en :

```text
frontend/
```

---

### Étape 5 — Création du backend

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

* `core` : configuration et connexion à la base ;
* `models` : tables SQLAlchemy ;
* `schemas` : validation des données avec Pydantic ;
* `routers` : routes de l’API ;
* `services` : logique métier ;
* `utils` : fonctions générales.

---

### Étape 6 — Configuration de PostgreSQL

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

### Étape 7 — Création des premiers modèles

Trois premiers modèles ont été développés.

#### User

Le modèle `User` contient :

* l’email ;
* le mot de passe chiffré ;
* le rôle ;
* l’état du compte ;
* la date de création.

Les rôles seront :

* `ADMIN` ;
* `CANDIDATE`.

#### CandidateProfile

Le modèle `CandidateProfile` contient :

* le nom ;
* le prénom ;
* le téléphone ;
* la ville ;
* le résumé professionnel ;
* le type du candidat ;
* le statut du profil.

Les types de candidats sont :

* `STAGIAIRE` ;
* `LAUREAT`.

Les statuts du profil permettront de suivre son avancement :

* nouveau ;
* CV en cours d’analyse ;
* CV en attente de confirmation ;
* profil incomplet ;
* profil complété.

#### CvExtraction

Le modèle `CvExtraction` permettra de conserver :

* le nom du CV ;
* le chemin du fichier ;
* le texte extrait ;
* le résultat JSON produit par l’IA ;
* le statut du traitement ;
* les erreurs éventuelles ;
* la date de confirmation.

Le résultat de l’IA sera temporaire jusqu’à sa confirmation par le candidat.

---

### Étape 8 — Configuration d’Alembic

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

### Étape 9 — Intégration dans le dépôt GitHub

Le frontend créé par un membre de l’équipe était déjà présent dans le dépôt.

Le backend développé séparément a ensuite été copié et ajouté dans ce même dépôt.

Les fichiers suivants ont été ajoutés :

* le backend FastAPI ;
* les modèles SQLAlchemy ;
* la configuration Alembic ;
* la première migration ;
* le fichier `requirements.txt` ;
* le fichier `.env.example` ;
* le fichier `docker-compose.yml` ;
* le fichier `.gitignore`.

Les fichiers suivants ne sont pas envoyés sur GitHub :

* `backend/venv/` ;
* `backend/.env` ;
* `frontend/node_modules/` ;
* les fichiers temporaires Python.

---


---


### Étape 10 — Vérifier et appliquer la première migration

Avant de développer de nouvelles fonctionnalités, il faut :

* vérifier que PostgreSQL fonctionne correctement ;
* vérifier que le backend peut se connecter à PostgreSQL ;
* appliquer la migration Alembic ;
* confirmer la création des tables ;
* tester le démarrage de FastAPI ;
* tester les routes `/` et `/health`.

Cette étape valide définitivement la base technique.

---

### Étape 11 — Développer l’authentification

Dans cette étape, nous avons commencé à mettre en place la vraie authentification du projet. Nous avons ajouté les dépendances nécessaires pour sécuriser les mots de passe et créer des tokens JWT, puis créé la configuration de sécurité, les schémas d’inscription et de connexion, le service d’authentification, les routes protégées et la séparation entre les rôles CANDIDATE et ADMIN. Nous avons aussi préparé l’inscription d’un candidat avec création automatique de son CandidateProfile, la connexion avec email et mot de passe, la route /me pour récupérer l’utilisateur connecté, ainsi que les contrôles d’accès candidat et administration.

Pendant les tests, nous avons corrigé plusieurs problèmes : dépendance PyJWT manquante, fichiers dependencies.py et auth_service.py incomplets, ancienne version de FastAPI provoquant un problème avec les routeurs, puis un échec de connexion à PostgreSQL. La dernière erreur venait du fait que Docker Desktop n’était pas démarré, donc PostgreSQL ne pouvait pas fonctionner.

À ce stade, le code d’authentification est presque prêt. Il reste maintenant à démarrer Docker Desktop, relancer PostgreSQL, appliquer les migrations si nécessaire, créer un candidat de test, tester le login JWT, puis créer et tester un compte administrateur.

---


# Prochaines étapes

### Étape 12 — Connecter l'authentification au frontend ✅

Les boutons et utilisateurs fictifs du frontend ont été remplacés par une vraie authentification :

* vrai formulaire de connexion (`/connexion`) qui appelle `POST /api/auth/login` (OAuth2 form) ;
* vraie inscription qui appelle `POST /api/auth/register` puis connecte automatiquement le candidat ;
* token JWT stocké côté client, session restaurée au rechargement de page via `GET /api/auth/me` (avant, un simple F5 déconnectait l'utilisateur) ;
* redirection selon le rôle réel renvoyé par le backend : candidat stagiaire → `/dashboard/stagiaire`, candidat lauréat → `/dashboard/laureat`, admin → `/admin` (page minimale, l'espace administration complet reste à construire — voir Étape 21) ;
* pages protégées par rôle réel (`CANDIDATE`/`ADMIN`) au lieu d'un faux statut local ;
* le faux statut "compte en attente de validation" a été retiré : le backend active les comptes immédiatement, il n'y a pas encore de workflow de validation admin (à décider plus tard si on en a besoin).

**Changement de scope important par rapport au plan initial :** le formulaire d'inscription a été transformé en **wizard multi-étapes** (`FormWizard`, composant générique piloté par une config — `frontend-mock/src/data/wizard/stagiaireSteps.js` / `laureatSteps.js`) au lieu d'un simple formulaire une page. 6 étapes par profil (Identité, Formation, Stage recherché/Situation, Compétences, Parcours, Documents & Profil), avec stepper visuel, validation par étape, et sauvegarde en `localStorage` pour ne pas perdre la saisie au rechargement.

Seuls email / mot de passe / nom / prénom / téléphone / type (stagiaire ou lauréat) partent réellement vers le backend aujourd'hui — voir Étape 16 pour ce qui manque encore côté persistance.

---

### Étape 13 — Développer le dépôt du CV ✅ (approche différente du plan initial)

Le candidat peut déposer un CV (PDF, JPG ou PNG) directement à l'**étape 1** du wizard d'inscription, avant même la création du compte.

Contrairement au plan initial, le fichier **n'est jamais enregistré sur le serveur** : il est lu en mémoire, envoyé à l'IA, puis oublié dès la fin de la requête. Il n'y a donc pas de table `cv_extractions` utilisée pour l'instant — cette route est volontairement "stateless" pour l'instant (à revoir si on veut un jour garder un historique des CV déposés).

Validations faites côté backend avant tout traitement : format (PDF/JPG/PNG), taille (5 Mo max), nombre de pages PDF (10 max).

---

### Étape 14 — Développer l'analyse IA du CV ✅ (Gemini au lieu du pipeline initialement prévu)

Le fichier du CV est envoyé directement à **Google Gemini** (`gemini-2.5-flash`, encodage base64) plutôt que d'extraire le texte localement puis de l'envoyer à un modèle — cette approche permet aussi de traiter les CV scannés/images, pas seulement les PDF avec texte natif.

L'IA renvoie une structure JSON qui reprend les mêmes noms de champs que le wizard (identité, formation, compétences techniques, langues, soft skills, expériences, projets, certifications, présentation), avec pour chaque champ une `value` et un niveau de confiance (`high`/`medium`/`low`), afin que le candidat sache quoi vérifier en priorité.

Le statut `PENDING_CONFIRMATION` prévu initialement n'existe pas en base : comme le fichier n'est pas persisté (Étape 13), il n'y a rien à "confirmer" côté serveur — la confirmation se fait entièrement côté frontend (voir Étape 15).

Route : `POST /api/cv/parse` (`backend/app/routers/cv.py`, `backend/app/services/cv_extraction_service.py`). Protections : timeout 60 s avec 1 nouvel essai si la réponse IA n'est pas un JSON valide, limite de 3 analyses par IP toutes les 10 minutes, aucun contenu de CV n'est jamais écrit dans les logs (RGPD). Si `GEMINI_API_KEY` n'est pas configurée, la route répond clairement (503) plutôt que de planter.

---

### Étape 15 — Développer la validation du CV ✅ (côté frontend uniquement)

Après extraction, une fenêtre de revue (`CvReviewModal`) affiche les informations détectées, groupées par section, avec un badge de confiance par champ.

Le candidat peut :

* accepter ou refuser chaque champ individuellement (case à cocher) ;
* tout accepter ou tout ignorer en un clic ;
* voir la liste des informations non détectées dans son CV.

Règles d'injection respectées (`frontend-mock/src/data/wizard/cvToFormMapper.js`, testé unitairement) :

* un champ déjà rempli manuellement n'est **jamais** écrasé automatiquement ;
* les listes (compétences, langues, expériences...) sont fusionnées sans doublons (comparaison insensible à la casse et aux accents) ;
* un badge "extrait du CV" reste affiché à côté d'un champ pré-rempli tant que le candidat ne l'a pas modifié lui-même.

Cette validation se fait uniquement pendant l'inscription (avant la création du compte) — ce n'est pas un flux séparé consultable plus tard, contrairement à ce qui était envisagé au départ.

---

### Étape 16 — Compléter les modèles du candidat ⚠️ collecté côté frontend, **pas encore sauvegardé en base**

Le wizard d'inscription collecte déjà toutes les informations prévues à cette étape : compétences techniques, soft skills, langues, expériences, projets, certifications, filière CMC, niveau, année de formation/obtention, disponibilité, mobilité, type d'opportunité recherché, mode de travail préféré, etc.

**Ce qui manque réellement :** aucune de ces données n'est encore envoyée ni sauvegardée côté backend. Seuls email / mot de passe / nom / prénom / téléphone / type de candidat sont persistés aujourd'hui (modèle `CandidateProfile` existant, inchangé depuis l'Étape 7). Le reste vit uniquement dans l'état local du navigateur (React) et est perdu si le candidat vide son cache ou change d'appareil.

# on est arrivé ici

La prochaine étape concrète est donc de **créer les tables/modèles SQLAlchemy + migrations Alembic + routes API** pour que tout ce que le wizard collecte (compétences, expériences, projets, formations, langues, certifications, préférences) soit réellement sauvegardé, au lieu de rester uniquement dans le navigateur.

---

### Étape 17 — Gestion des entreprises partenaires

L’administration pourra enregistrer les entreprises partenaires du CMC.

Chaque entreprise pourra contenir :

* un nom ;
* un secteur ;
* une ville ;
* un email ;
* un téléphone ;
* un contact ;
* un statut de partenariat.

Les entreprises ne disposeront pas d’un compte de connexion.

---

### Étape 18 — Gestion des offres CMC

L’administration pourra créer et gérer les offres.

Une offre contiendra :

* un titre ;
* une description ;
* une entreprise ;
* une localisation ;
* un type de contrat ;
* un public ciblé ;
* des compétences obligatoires ;
* des compétences souhaitées ;
* un niveau de formation ;
* une expérience demandée ;
* une date limite ;
* un statut.

Le public ciblé pourra être :

* stagiaire ;
* lauréat ;
* les deux.

---

### Étape 19 — Développer le moteur de matching

Le moteur de matching comparera les profils avec les offres.

Il utilisera notamment :

* les compétences obligatoires ;
* les compétences souhaitées ;
* le domaine ;
* les expériences ;
* les projets ;
* la formation ;
* la localisation ;
* la disponibilité ;
* les préférences ;
* la similarité sémantique.

Le résultat comprendra :

* un score global ;
* des sous-scores ;
* les compétences correspondantes ;
* les compétences manquantes ;
* les points forts ;
* les critères non satisfaits.

Aucun dataset d’entraînement ne sera nécessaire.

---

### Étape 20 — Développer les candidatures

Le candidat pourra choisir une offre et postuler.

Les statuts possibles seront :

* envoyée ;
* en cours d’analyse ;
* présélectionnée ;
* retenue ;
* refusée.

Le score ne déclenchera jamais automatiquement une candidature ou une sélection.

---

### Étape 21 — Développer la revue administrative

Pour chaque offre, l’administration pourra :

* voir les candidats ayant postulé ;
* filtrer les stagiaires et les lauréats ;
* classer les candidats ;
* consulter leur profil ;
* comprendre leur score ;
* voir les compétences présentes et manquantes ;
* consulter les expériences et projets ;
* présélectionner, retenir ou refuser.

La décision finale restera humaine.

---

### Étape 22 — Développer les notifications

Le candidat recevra des notifications lors des changements importants :

* candidature reçue ;
* candidature en cours d’analyse ;
* présélection ;
* sélection ;
* refus ;
* nouvelle offre compatible.

Les notifications pourront être envoyées :

* dans la plateforme ;
* par email.

---

### Étape 23 — Ajouter les offres externes

Lorsque les offres CMC fonctionneront correctement, un système de collecte d’offres externes sera ajouté.

Les offres devront être :

* récupérées ;
* nettoyées ;
* normalisées ;
* vérifiées ;
* dédupliquées ;
* enregistrées avec la source `SCRAPING`.

Elles utiliseront ensuite le même moteur de matching.

---

### Étape 24 — Connecter les tableaux de bord

Les statistiques fictives du frontend seront remplacées par les vraies données PostgreSQL.

L’administration pourra comparer :

* stagiaires et lauréats ;
* utilisateurs actifs ;
* nombre de candidatures ;
* taux de sélection ;
* filières les plus actives ;
* offres les plus consultées ;
* compétences les plus demandées ;
* compétences les plus manquantes ;
* offres CMC et offres externes.

---

### Étape 25 — Tests, sécurité et déploiement

La dernière partie comprendra :

* tests unitaires ;
* tests d’intégration ;
* tests du matching ;
* vérification des rôles ;
* sécurisation des mots de passe ;
* sécurisation des CV ;
* protection des données personnelles ;
* validation des fichiers ;
* conteneurisation complète ;
* préparation du déploiement ;
* documentation finale.
