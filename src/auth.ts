import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || "fallback-secret-for-dev-123",
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, token, user }: any) {
      if (session?.user) {
        if (token?.sub) {
          (session as any).user.id = token.sub;
        } else if (user?.id) {
          (session as any).user.id = user.id;
        }

        // Check for specific admin email
        if (session.user.email === "ejderalimert@gmail.com") {
          (session as any).user.role = "admin";
        } else {
          (session as any).user.role = "user";
        }
      }
      return session;
    },
  },
})
