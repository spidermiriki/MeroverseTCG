import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/home",
    "/messages",
    "/gifts",
    "/collection/:path*",
    "/exchange",
    "/settings",
    "/shop",
    "/group",
    "/admin/:path*",
    "/dev/:path*",
  ],
};
