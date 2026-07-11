# CMC Connect — Frontend nouvelle vision

Frontend Next.js 14 adapté au nouveau projet CMC : **deux espaces uniquement**.

- **Candidat** : stagiaire ou lauréat
- **Administration CMC**

## Parcours candidat maquetté

Inscription → dépôt CV → extraction IA → validation/correction → formulaire complémentaire → offres CMC / offres externes → score explicable → candidature → notifications.

## Parcours administration maquetté

Dashboard stagiaires vs lauréats → gestion candidats → entreprises partenaires → création d'offres CMC → candidatures par offre → détail du score et validation humaine → analytics.

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Important

Les données sont actuellement dans `src/data/mock.ts`. Les pages sont prêtes pour être connectées au futur backend FastAPI. Remplacer progressivement les mocks par les endpoints API sans refaire le design.
