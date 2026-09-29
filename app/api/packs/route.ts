import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const packs = await prisma.pack.findMany({
    where: { isAvailable: true },
    orderBy: { price: "asc" },
  });
  return NextResponse.json({ packs });
}
