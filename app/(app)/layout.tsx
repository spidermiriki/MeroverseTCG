import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/navbar/BottomNav";
import { ThemeProvider } from "@/components/theme-provider";
import { SpaceBackground } from "@/components/SpaceBackground";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <ThemeProvider>
      {/* Space background - fixed behind everything */}
      <SpaceBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
