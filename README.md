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


# on est arrivé ici

### Étape 12 — Connecter l’authentification au frontend

Les boutons et utilisateurs fictifs du frontend seront remplacés par :

* un vrai formulaire d’inscription ;
* un vrai formulaire de connexion ;
* une redirection selon le rôle ;
* une gestion réelle de la session ;
* une protection des pages.

Un candidat sera redirigé vers l’espace candidat.

Un administrateur sera redirigé vers l’espace administration.

---

### Étape 13 — Développer le dépôt du CV

Le candidat pourra déposer un CV au format PDF.

Le backend devra :

* vérifier le format du fichier ;
* limiter la taille du fichier ;
* enregistrer le CV ;
* créer une extraction en base ;
* extraire le texte du PDF ;
* gérer les erreurs.

À cette étape, aucune donnée ne sera encore ajoutée automatiquement au profil définitif.

---

### Étape 14 — Développer l’analyse IA du CV

Le texte du CV sera envoyé à un service d’intelligence artificielle.

L’IA devra produire une structure commune contenant :

* résumé professionnel ;
* compétences ;
* expériences ;
* projets ;
* formations ;
* langues ;
* certifications.

Le résultat sera enregistré temporairement avec le statut :

```text
PENDING_CONFIRMATION
```

---

### Étape 15 — Développer la validation du CV

Le frontend affichera les informations détectées.

Le candidat pourra :

* corriger une information ;
* supprimer une information ;
* ajouter une information ;
* confirmer le résultat.

Les informations ne seront ajoutées au profil définitif qu’après cette confirmation.

---

### Étape 16 — Compléter les modèles du candidat

De nouvelles tables seront créées pour gérer :

* les compétences ;
* les expériences ;
* les projets ;
* les formations ;
* les langues ;
* les certifications ;
* les préférences professionnelles.

Le candidat remplira également les informations qui ne sont généralement pas présentes dans le CV :

* filière CMC ;
* niveau de formation ;
* année d’étude ;
* année de diplomation ;
* disponibilité ;
* mobilité ;
* villes souhaitées ;
* domaines recherchés ;
* type d’opportunité ;
* mode de travail préféré.

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
