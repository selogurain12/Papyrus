# Journal des versions

## [1.0.1] - 2026-08-14

### Ajouté
- Route publique `GET /health` avec contrôles PostgreSQL, migrations et stockage S3.
- Workflow de construction d’une release desktop à partir d’un tag `v*`.
- Calcul d’une empreinte SHA-256 pour chaque artefact publié.

### Modifié
- TypeScript racine mis à jour de 5.8.3 vers 5.9.3 afin d’aligner les contrôles avec le workspace desktop.

### Corrigé
- Anomalie #174 : un chapitre sans résumé transmet désormais `null` au lieu d’une chaîne vide.

### Vérification
- Tests Jest du desktop et contrôles TypeScript de l’API et des contrats partagés.

### Limites connues
- La sonde externe, l’historique sur sept jours et la validation par un testeur distinct doivent être réalisés dans l’environnement de production.
