import { NextResponse } from "next/server";

const COIN_PACKAGES = [
  { id: "small",  amount: 100,  label: "100 Coins",  price: "1€" },
  { id: "medium", amount: 300,  label: "300 Coins",  price: "2.50€" },
  { id: "large",  amount: 700,  label: "700 Coins",  price: "5€" },
  { id: "xl",     amount: 1500, label: "1500 Coins", price: "10€" },
];

export async function GET() {
  return NextResponse.json({ packages: COIN_PACKAGES });
}
