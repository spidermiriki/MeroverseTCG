import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST: place a bid on an auction
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { amount } = await req.json();
  const offer = await prisma.tradeOffer.findUnique({ where: { id: params.id } });

  if (!offer || offer.status !== "OPEN" || offer.type !== "AUCTION") {
    return NextResponse.json({ error: "Offre invalide." }, { status: 400 });
  }

  if (offer.offererId === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas enchérir sur votre propre offre." }, { status: 400 });
  }

  if (amount < (offer.minimumPrice ?? 0)) {
    return NextResponse.json({ error: `L'offre minimum est de ${offer.minimumPrice} Melocoins.` }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.melocoins < amount) {
    return NextResponse.json({ error: "Melocoins insuffisants." }, { status: 400 });
  }

  const bid = await prisma.tradeBid.create({
    data: {
      tradeOfferId: params.id,
      bidderId: session.user.id,
      amount,
      status: "PENDING",
    },
    include: { bidder: { select: { id: true, username: true } } },
  });

  return NextResponse.json(bid, { status: 201 });
}
