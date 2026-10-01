import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const allCards = await prisma.card.findMany({ select: { id: true } });

    for (const card of allCards) {
      await prisma.userCard.upsert({
        where: { userId_cardId: { userId: user.id, cardId: card.id } },
        update: {},
        create: { userId: user.id, cardId: card.id, quantity: 1 },
      });
    }

    return NextResponse.json({ total: allCards.length });
  } catch (err) {
    console.error("[POST /api/admin/sync-cards]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
