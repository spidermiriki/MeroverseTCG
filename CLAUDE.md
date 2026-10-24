# MeroverseTCG — Guide pour Claude Code

## Présentation

Application web de TCG (Trading Card Game) pour un groupe d'amis. Les cartes représentent de vraies personnes. Les joueurs ouvrent des boosters, collectionnent les cartes, les échangent et les vendent.

**Stack :** Next.js 14 App Router · TypeScript · Prisma · Neon PostgreSQL · NextAuth.js · Tailwind CSS

---

## ⛔ FICHIER INTOUCHABLE

```
app/(admin)/admin/card-editor/page.tsx
```

**Ne jamais modifier ce fichier.** C'est l'éditeur de cartes admin (1041 lignes, tout inline). Il génère les PNGs via `dom-to-image-more` et gère le CRUD des cartes en base. Toute modification peut casser la production de cartes.

Routes API associées — également protégées :
- `app/api/cards/route.ts`
- `app/api/admin/reset-collection/route.ts`
- `app/api/admin/init-collection/route.ts`
- `app/api/admin/sync-cards/route.ts`

---

## Thèmes

Le système de thèmes est basé sur des variables CSS par `[data-theme="..."]` sur `<html>`.

| Thème | Slug | Accent principal | Usage |
|---|---|---|---|
| Black vs White | `black-vs-white` | `#ea4316` orange | Collection en cours (défaut) |
| Classique | `classique` | `#a37bff` violet | Future collection |
| Gary | `gary` | `#ffc83d` or | Future collection |
| Ginsa | `ginsa` | `#8e96a6` gris | Future collection |

**Règle :** le thème par défaut suit la collection en cours. `COLLECTION_THEME` dans `components/theme-provider.tsx` est la source de vérité. Changer de collection = mettre à jour `COLLECTION_THEME`.

Les variables CSS exposées par chaque thème :
- `--accent` / `--accent-2` / `--accent-3` : RGB séparés par espaces (pour Tailwind `bg-mv-accent/50`)
- `--color-accent` / `--color-accent-2` / `--color-accent-3` : hex (pour `box-shadow`, `gradient`, etc.)
- `--color-nebula-1/2/3` : couleurs rgba pour le fond étoilé (SpaceBackground)

**Page dev :** `/dev/composants` — affiche tous les composants UI dans les 4 thèmes.

---

## Branches

| Branche | Rôle |
|---|---|
| `main` | Base stable — merge via PR uniquement |
| `refonte/fondations` | Phase 1 — fondations visuelles |

Les branches vides sont supprimées. Les états archivés sont dans les tags `legacy-*`.

---

## Commandes utiles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers Neon (sans migration)
npm run db:studio    # Interface Prisma Studio
```

---

## Variables d'environnement requises

```
DATABASE_URL       # Connection string Neon PostgreSQL
NEXTAUTH_SECRET    # Secret JWT NextAuth
NEXTAUTH_URL       # URL publique (ex: https://meroverse.vercel.app)
```

---

## Schéma de données (résumé)

- **User** — id, username, email, password, coins (premium), orbs (gratuit/doublons), level, xp, energyCount, lastEnergyTick, onboardingDone, theme, avatarUrl, isAdmin
- **Card** — id, number, name, rarity, collection, imageUrl, isSecret + stats jeu (hp, attacks, etc.)
- **UserCard** — userId, cardId, quantity *(unique par paire)*
- **Pack** — id, name, collection, price, cardsCount
- **TradeOffer** — offererId, recipientId (obligatoire), offeredCardId, requestedCardId?, expiresAt, status EN_ATTENTE|VU|ACCEPTE|REFUSE|ANNULE|EXPIRE
- **TradeConfirmation** — confirmations d'échange (double validation)
- **Auction / AuctionBid** — enchères séparées des échanges directs
- **Friendship / Group*** — système social (GroupMember, GroupRequest, GroupBan, etc.)
- **Gift** — cadeaux carte→carte (cardId FK vers Card, séquestre quantity)
- **FavoriteCard / UserBadge / UserCosmetic** — profil enrichi
- **DirectMessage / Notification / BugReport** — messagerie et support

---

## Raretés

`COMMUN` → `RARE` → `EPIQUE` → `MYTHIQUE` → `LEGENDAIRE` → `CHROMATIQUE` → `RAINBOW`

- **LEGENDAIRE / CHROMATIQUE / RAINBOW** : cartes full-art (illustration plein format)
- **CHROMATIQUE / RAINBOW** : cartes pure-art (pas de stats — juste l'illustration et le nom stylisé)
- **RAINBOW** : unique — carte #038 (Tunay)

---

## Collection BLACK_VS_WHITE

- Cartes #001–032 : normales (`isSecret: false`)
- Cartes #033–045 : secrètes full-art (`isSecret: true`)
- Images : `public/cards/BLACK_VS_WHITE/NNN.png` (placées manuellement après export)

---

## Commits

Ne jamais ajouter de ligne `Co-Authored-By:` dans les messages de commit.

---

## Points d'attention

1. **Middleware d'auth** — `middleware.ts` protège les routes `(app)/` via `withAuth` de NextAuth. Matcher : `/home`, `/collection`, `/exchange`, `/settings`, `/shop`, `/group`, `/admin/**`, `/dev/**`. La page `/login` reste publique.
2. **`prisma migrate deploy`** — les migrations versionnées sont dans `prisma/migrations/`. Ne plus utiliser `prisma db push` sur la prod ; utiliser `prisma migrate deploy` (automatique via `vercel.json` buildCommand).
3. **RAINBOW absent de `RARITY_WEIGHTS`** dans `lib/pack-odds.ts` — ne peut pas tomber en booster (voulu).
4. **Stripe non implémenté** — la boutique Coins est un stub.
5. **⚠ Ne jamais appeler `/api/admin/reset-collection` en production** — cette route fait une cascade sur les collections, les enchères et les favoris. Réservée aux environnements de test uniquement.
