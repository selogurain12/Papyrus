# Preuve de mise à jour mineure d’une dépendance

Date d’exécution : 14 août 2026  
Dépendance : TypeScript (configuration racine du monorepo)  
Type : mise à jour mineure réelle

## État avant mise à jour

- Contrainte déclarée : `~5.8.2`
- Version résolue : `5.8.3`

## État après mise à jour

- Contrainte déclarée : `~5.9.2`
- Version résolue : `5.9.3`
- Fichiers modifiés : `package.json`, `yarn.lock`, `CHANGELOG.md`
- Commit contenant la mise à jour : `3debc8745e2ad58468c939cdb4744a3888658b18`

## Contrôles exécutés après installation

| Contrôle | Résultat réel |
|---|---|
| Installation verrouillée des dépendances | Réussie, avec avertissements de peer dependencies préexistants |
| Tests API | 2 suites réussies, 6 tests réussis |
| Tests desktop | 17 suites réussies, 106 tests réussis |
| Typecheck `packages/source` | Réussi |
| Typecheck API | Réussi |
| Typecheck desktop | Réussi |
| Lint des fichiers de santé ajoutés | Réussi |
| Lint desktop complet | Réussi avec 1 avertissement préexistant et aucune erreur |

## Décision

La mise à jour est conservée : aucune régression n’a été détectée par les tests et les contrôles de typage. Le verrou Yarn a été régénéré et versionné afin de rendre l’installation reproductible.

## Traçabilité associée

- Changelog : entrée `1.0.1` dans `CHANGELOG.md`
- Tag : `v1.0.1`
- Release : <https://github.com/selogurain12/Papyrus/releases/tag/v1.0.1>
- Run de release réussi : <https://github.com/selogurain12/Papyrus/actions/runs/31802934764>
