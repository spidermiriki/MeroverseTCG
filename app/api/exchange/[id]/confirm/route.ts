import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST: confirm a trade (both parties must confirm to execute)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { bidId } = await req.json(); // Only needed for AUCTION type

  const offer = await prisma.tradeOffer.findUnique({
    where: { id: params.id },
    include: {
      bids: { where: { status: "ACCEPTED" } },
      confirmations: true,
    },
  });

  if (!offer || offer.status === "COMPLETED" || offer.status === "CANCELLED") {
    return NextResponse.json({ error: "Offre invalide ou déjà terminée." }, { status: 400 });
  }

  // For AUCTION: offerer must first accept a bid (sets offer to PENDING)
  if (offer.type === "AUCTION" && offer.offererId === session.user.id && bidId) {
    await prisma.$transaction(async (tx) => {
      // Accept this bid, reject others
      await tx.tradeBid.updateMany({
        where: { tradeOfferId: params.id },
        data: { status: "REJECTED" },
      });
      await tx.tradeBid.update({
        where: { id: bidId },
        data: { status: "ACCEPTED" },
      });
      await tx.tradeOffer.update({
        where: { id: params.id },
        data: { status: "PENDING" },
      });
    });
    return NextResponse.json({ message: "Offre acceptée. En attente de confirmation du gagnant." });
  }

  // Record confirmation
  await prisma.tradeConfirmation.upsert({
    where: { tradeOfferId_userId: { tradeOfferId: params.id, userId: session.user.id } },
    update: { confirmed: true },
    create: { tradeOfferId: params.id, userId: session.user.id, confirmed: true },
  });

  // Check if both parties have confirmed
  const confirmations = await prisma.tradeConfirmation.findMany({
    where: { tradeOfferId: params.id, confirmed: true },
  });

  const offerWithDetails = await prisma.tradeOffer.findUnique({
    where: { id: params.id },
    include: {
      offeredCard: true,
      bids: { where: { status: "ACCEPTED" } },
    },
  });

  if (!offerWithDetails) return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });

  // Determine both parties
  const party1 = offer.offererId;
  let party2: string | null = null;

  if (offer.type === "CARD_FOR_CARD" && offer.requestedCardId) {
    // Find who owns the requested card
    const requestedCardOwner = await prisma.userCard.findFirst({
      where: { cardId: offer.requestedCardId, quantity: { gt: 0 } },
    });
    party2 = requestedCardOwner?.userId ?? null;
  } else if (offer.type === "AUCTION") {
    const acceptedBid = offerWithDetails.bids[0];
    party2 = acceptedBid?.bidderId ?? null;
  }

  const bothConfirmed =
    party2 &&
    confirmations.some((c) => c.userId === party1) &&
    confirmations.some((c) => c.userId === party2);

  if (bothConfirmed && party2) {
    // Execute the trade
    await prisma.$transaction(async (tx) => {
      if (offer.type === "CARD_FOR_CARD" && offer.requestedCardId) {
        // Swap cards
        // Remove offered card from offerer
        await tx.userCard.update({
          where: { userId_cardId: { userId: party1, cardId: offer.offeredCardId } },
          data: { quantity: { decrement: 1 } },
        });
        // Give offered card to party2
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party2!, cardId: offer.offeredCardId } },
          update: { quantity: { increment: 1 } },
          create: { userId: party2!, cardId: offer.offeredCardId, quantity: 1 },
        });
        // Remove requested card from party2
        await tx.userCard.update({
          where: { userId_cardId: { userId: party2!, cardId: offer.requestedCardId! } },
          data: { quantity: { decrement: 1 } },
        });
        // Give requested card to offerer
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party1, cardId: offer.requestedCardId! } },
          update: { quantity: { increment: 1 } },
          create: { userId: party1, cardId: offer.requestedCardId!, quantity: 1 },
        });
      } else if (offer.type === "AUCTION") {
        const acceptedBid = offerWithDetails.bids[0];
        if (!acceptedBid) return;

        // Transfer card from offerer to bidder
        await tx.userCard.update({
          where: { userId_cardId: { userId: party1, cardId: offer.offeredCardId } },
          data: { quantity: { decrement: 1 } },
        });
        await tx.userCard.upsert({
          where: { userId_cardId: { userId: party2!, cardId: offer.offeredCardId } },
          update: { quantity: { increment: 1 } },
          create: { userId: party2!, cardId: offer.offeredCardId, quantity: 1 },
        });
        // Transfer melocoins from bidder to offerer
        await tx.user.update({
          where: { id: party2! },
          data: { melocoins: { decrement: acceptedBid.amount } },
        });
        await tx.user.update({
          where: { id: party1 },
          data: { melocoins: { increment: acceptedBid.amount } },
        });
      }

      await tx.tradeOffer.update({
        where: { id: params.id },
        data: { status: "COMPLETED" },
      });
    });

    return NextResponse.json({ message: "Échange effectué avec succès!" });
  }

  return NextResponse.json({ message: "Confirmation enregistrée. En attente de l'autre partie." });
}
