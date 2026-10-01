import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection");

  const cards = await prisma.card.findMany({
    where: collection ? { collection } : {},
    orderBy: { number: "asc" },
  });

  return NextResponse.json(cards);
}

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

    const body = await req.json();
    const { number, name, collection, race, rarity } = body;
    if (!number || !name || !collection || !race || !rarity) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : number, name, collection, race, rarity." },
        { status: 400 }
      );
    }

    const existing = await prisma.card.findUnique({
      where: { collection_number: { collection, number } },
    });
    if (existing) {
      return NextResponse.json(
        { error: `La carte n°${number} existe déjà dans la collection ${collection}.` },
        { status: 409 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const card = await (prisma.card.create as any)({
      data: {
        number:         body.number,
        name:           body.name,
        character:      body.name,
        race:           body.race,
        planet:         body.planet        ?? "LA_LOUVIERE",
        rarity:         body.rarity,
        collection:     body.collection,
        imageUrl:       body.imageUrl      ?? "/placeholders/card-placeholder.svg",
        description:    body.description   ?? null,
        isSecret:       body.isSecret      ?? false,
        gender:         body.gender        ?? "M",
        hp:             body.hp            ?? 100,
        characterTypes: body.characterTypes ?? [],
        attacks:        body.attacks        ?? [],
        weaknesses:     body.weaknesses     ?? [],
        resistances:    body.resistances    ?? [],
        totalCards:     body.totalCards     ?? 0,
        artScale:       body.artScale       ?? 1.0,
        artOffsetX:     body.artOffsetX     ?? 0.0,
        artOffsetY:     body.artOffsetY     ?? 0.0,
      },
    });

    // Donner automatiquement la carte à l'admin qui la crée
    await prisma.userCard.upsert({
      where: { userId_cardId: { userId: user.id, cardId: card.id } },
      update: {},
      create: { userId: user.id, cardId: card.id, quantity: 1 },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (err) {
    console.error("[POST /api/cards]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }

    const body = await req.json();
    const { number, collection } = body;
    if (!number || !collection) {
      return NextResponse.json(
        { error: "number et collection sont obligatoires." },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const card = await (prisma.card.update as any)({
      where: { collection_number: { collection, number } },
      data: {
        name:           body.name,
        character:      body.name,
        race:           body.race,
        planet:         body.planet        ?? "LA_LOUVIERE",
        rarity:         body.rarity,
        imageUrl:       body.imageUrl      ?? "/placeholders/card-placeholder.svg",
        description:    body.description   ?? null,
        isSecret:       body.isSecret      ?? false,
        gender:         body.gender        ?? "M",
        hp:             body.hp            ?? 100,
        characterTypes: body.characterTypes ?? [],
        attacks:        body.attacks        ?? [],
        weaknesses:     body.weaknesses     ?? [],
        resistances:    body.resistances    ?? [],
        totalCards:     body.totalCards     ?? 0,
        artScale:       body.artScale       ?? 1.0,
        artOffsetX:     body.artOffsetX     ?? 0.0,
        artOffsetY:     body.artOffsetY     ?? 0.0,
      },
    });

    return NextResponse.json(card);
  } catch (err) {
    console.error("[PUT /api/cards]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
