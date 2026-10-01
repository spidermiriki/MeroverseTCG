import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Crée les cartes manquantes (placeholders) pour une collection
// et met à jour totalCards sur toutes les cartes existantes
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const { collection, total } = await req.json();
    if (!collection || !total || total < 1) {
      return NextResponse.json(
        { error: "collection et total (>0) sont obligatoires." },
        { status: 400 }
      );
    }

    // Récupérer les numéros déjà existants
    const existing = await prisma.card.findMany({
      where: { collection },
      select: { id: true, number: true },
    });
    const existingNumbers = new Set(existing.map((c) => c.number));

    // Créer les cartes manquantes
    let created = 0;
    for (let n = 1; n <= total; n++) {
      if (!existingNumbers.has(n)) {
        const padded = String(n).padStart(3, "0");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma.card.create as any)({
          data: {
            number:     n,
            name:       `Carte #${padded}`,
            character:  `Carte #${padded}`,
            race:       "BLANC",
            planet:     "LA_LOUVIERE",
            rarity:     "COMMUN",
            collection,
            imageUrl:   `/cards/${collection}/${padded}.png`,
            totalCards: total,
          },
        });
        created++;
      }
    }

    // Mettre à jour totalCards sur toutes les cartes de la collection
    await prisma.card.updateMany({
      where: { collection },
      data: { totalCards: total } as object,
    });

    // Donner toutes les cartes à l'admin
    const allCards = await prisma.card.findMany({
      where: { collection },
      select: { id: true },
    });
    for (const card of allCards) {
      await prisma.userCard.upsert({
        where: { userId_cardId: { userId: user.id, cardId: card.id } },
        update: {},
        create: { userId: user.id, cardId: card.id, quantity: 1 },
      });
    }

    return NextResponse.json({ created, total, collection });
  } catch (err) {
    console.error("[POST /api/admin/init-collection]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
