import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/navbar/BottomNav";
import { SpaceBackground } from "@/components/SpaceBackground";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <>
      <SpaceBackground />
      <div className="relative z-10 flex flex-col min-h-svh">
        <main className="flex-1 pb-24 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </>
  );
}
