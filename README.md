Voici la partie corrigée, prête à copier-coller :

````markdown
## Pour lancer le projet après l’avoir récupéré depuis GitHub

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
````
