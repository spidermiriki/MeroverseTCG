import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const DONE_STATUSES = ["ACCEPTE", "REFUSE", "ANNULE", "EXPIRE"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const offer = await prisma.tradeOffer.findUnique({
    where: { id: params.id },
    include: { confirmations: true },
  });

  if (!offer || DONE_STATUSES.includes(offer.status)) {
    return NextResponse.json({ error: "Offre invalide ou déjà terminée." }, { status: 400 });
  }

  // Only offerer and recipient can confirm
  const isInvolved =
    offer.offererId === session.user.id || offer.recipientId === session.user.id;
  if (!isInvolved) {
    return NextResponse.json({ error: "Vous n'êtes pas concerné par cette offre." }, { status: 403 });
  }

  // Mark offer as VU when recipient first interacts
  if (offer.recipientId === session.user.id && offer.status === "EN_ATTENTE") {
    await prisma.tradeOffer.update({
      where: { id: params.id },
      data: { status: "VU", seenAt: new Date() },
    });
  }

  await prisma.tradeConfirmation.upsert({
    where: { tradeOfferId_userId: { tradeOfferId: params.id, userId: session.user.id } },
    update: { confirmed: true },
    create: { tradeOfferId: params.id, userId: session.user.id, confirmed: true },
  });

  const confirmations = await prisma.tradeConfirmation.findMany({
    where: { tradeOfferId: params.id, confirmed: true },
  });

  const party1 = offer.offererId;
  const party2 = offer.recipientId;

  const bothConfirmed =
    confirmations.some((c) => c.userId === party1) &&
    confirmations.some((c) => c.userId === party2);

  if (bothConfirmed) {
    await prisma.$transaction(async (tx) => {
      if (offer.requestedCardId) {
        // Swap: party1 gives offeredCard, party2 gives requestedCard
        await tx.userCard.update({
          where: { userId_cardId: { userId: party1, cardId: offer.offeredCardId } },
          data: { quantity: { decrement: 1 } },
        });
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party2, cardId: offer.offeredCardId } },
          update: { quantity: { increment: 1 } },
          create: { userId: party2, cardId: offer.offeredCardId, quantity: 1 },
        });
        await tx.userCard.update({
          where: { userId_cardId: { userId: party2, cardId: offer.requestedCardId } },
          data: { quantity: { decrement: 1 } },
        });
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party1, cardId: offer.requestedCardId } },
          update: { quantity: { increment: 1 } },
          create: { userId: party1, cardId: offer.requestedCardId, quantity: 1 },
        });
      } else {
        // One-way gift: party1 gives offeredCard to party2
        await tx.userCard.update({
          where: { userId_cardId: { userId: party1, cardId: offer.offeredCardId } },
          data: { quantity: { decrement: 1 } },
        });
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party2, cardId: offer.offeredCardId } },
          update: { quantity: { increment: 1 } },
          create: { userId: party2, cardId: offer.offeredCardId, quantity: 1 },
        });
      }

      await tx.tradeOffer.update({
        where: { id: params.id },
        data: { status: "ACCEPTE" },
      });
    });

    return NextResponse.json({ message: "Échange effectué avec succès !" });
  }

  return NextResponse.json({ message: "Confirmation enregistrée. En attente de l'autre partie." });
}
