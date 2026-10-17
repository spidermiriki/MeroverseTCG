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

## Branches

| Branche | Rôle |
|---|---|
| `main` | Base stable — merge via PR uniquement |
| `feat/collection` | Onglet collection (actif) |
| `chore/securisation` | Phase 0 — sécurisation du dépôt |

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

- **User** — id, username, email, password, melocoins, isAdmin, theme
- **Card** — id, number, name, rarity, collection, imageUrl, isSecret + stats jeu (hp, attacks, etc.)
- **UserCard** — userId, cardId, quantity *(unique par paire)*
- **Pack** — id, name, collection, price, cardsCount
- **TradeOffer** — type CARD_FOR_CARD | AUCTION, status OPEN|PENDING|COMPLETED|CANCELLED
- **TradeBid / TradeConfirmation** — enchères et confirmations d'échange

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

## Points d'attention

1. **Pas de middleware d'auth** — les pages `(app)/` ne sont pas protégées côté serveur. Les routes API font le check `isAdmin`.
2. **`prisma db push` uniquement** — pas de migrations versionnées pour l'instant.
3. **RAINBOW absent de `RARITY_WEIGHTS`** dans `lib/pack-odds.ts` — ne peut pas tomber en booster (voulu).
4. **Stripe non implémenté** — la boutique Melocoins est un stub.
