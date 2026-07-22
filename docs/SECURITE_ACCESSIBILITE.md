# Sécurité et accessibilité

## Sécurité applicative

### Authentification

- Les mots de passe sont hashés avec `bcrypt`.
- Les routes métier de l'API sont protégées par un guard JWT.
- Le token JWT utilise `JWT_SECRET` et une durée d'expiration configurable avec `JWT_EXPIRES_IN`.
- Le front envoie le token avec l'en-tête `Authorization: Bearer`.

### Validation des entrées

- Les DTO et contrats partagés utilisent Zod.
- L'API Nest active un `ValidationPipe`.
- Les formulaires desktop utilisent des schémas de validation avant envoi.

### Protection HTTP

- CORS restreint les origines autorisées.
- Des headers de sécurité sont ajoutés côté API :
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Content-Security-Policy`
- Un rate limit simple limite les abus par adresse IP.

### Uploads

- Les uploads sont limités à 10 MB.
- Les types MIME acceptés sont restreints :
  - images
  - PDF
  - EPUB
  - vidéos
  - PowerPoint
- Le nom du fichier est nettoyé avant stockage S3.

## Points OWASP couverts

| Point | Couverture |
|---|---|
| Authentification | JWT + bcrypt |
| Contrôle d'accès | Guard API sur les routes métier |
| Validation d'entrée | Zod + ValidationPipe |
| Exposition de données sensibles | Variables d'environnement pour secrets |
| Upload de fichiers | Taille et MIME contrôlés |
| Sécurité HTTP | Headers de sécurité + CORS |
| Disponibilité | Rate limiting |

## Points à surveiller

- Ne jamais commiter `.env`.
- Changer `JWT_SECRET` en production.
- Limiter l'accès à pgAdmin ou le désactiver en production publique.
- Prévoir une sauvegarde régulière PostgreSQL.
- Vérifier les dépendances avec un audit avant livraison.

## Accessibilité

### Déjà présent

- Boutons avec labels visuels ou `aria-label`.
- Status de connexion avec `role="status"` et `aria-live`.
- Composants Radix UI pour dialogs, selects, popovers et tooltips.
- Formulaires avec labels, messages d'erreur et `aria-invalid`.
- Navigation structurée dans la sidebar.

### Recommandations de vérification RGAA/OPQUAST

- Tester la navigation clavier sur les dialogs, selects, date pickers et menus.
- Vérifier le contraste des textes et boutons.
- Vérifier que les messages d'erreur sont lisibles par lecteur d'écran.
- Ajouter des textes alternatifs pertinents aux images métier.
- Vérifier que les focus visibles restent évidents en mode clair et sombre.

## Checklist de recette

- Connexion et déconnexion fonctionnelles.
- Accès refusé sans token.
- Requête avec token expiré refusée.
- Upload refusé si type non autorisé.
- Upload refusé si taille supérieure à 10 MB.
- Formulaires utilisables au clavier.
- Dialogs refermables au clavier.
- Tests Jest et typecheck passants avant livraison.

