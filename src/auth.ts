import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Nodemailer from "next-auth/providers/nodemailer"
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
    }),
    Nodemailer({
      server: {
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: `Star Dublaj <${process.env.EMAIL_SERVER_USER}>`,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { createTransport } = await import("nodemailer");
        const transport = createTransport(provider.server);
        
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Star Dublaj - Giriş Bağlantısı`,
          html: `
            <div style="background-color: #0f0f13; padding: 40px; font-family: Helvetica, Arial, sans-serif; text-align: center; border-radius: 20px;">
              <h1 style="color: #ffffff; margin-bottom: 20px; font-style: italic; font-weight: 900; letter-spacing: 2px;">STAR DUBLAJ STUDIOS</h1>
              <p style="color: #aaaaaa; font-size: 16px; margin-bottom: 40px;">Hesabınıza giriş yapmak veya yeni kayıt oluşturmak için aşağıdaki butona tıklayın.</p>
              <a href="${url}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 18px 40px; border-radius: 15px; text-decoration: none; font-weight: 900; letter-spacing: 2px; font-size: 14px;">GİRİŞ YAP / KAYIT OL</a>
              <p style="color: #555555; font-size: 12px; margin-top: 50px;">Eğer bu isteği siz yapmadıysanız lütfen bu E-postayı görmezden gelin.</p>
            </div>
          `,
        });
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, trigger, session, user }: any) {
      if (user) {
        token.id = user.id;
        token.publicFavorites = user.publicFavorites ?? true;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.publicFavorites !== undefined) token.publicFavorites = session.publicFavorites;
      }
      return token;
    },
    session({ session, token }: any) {
      if (session?.user && token) {
        session.user.id = token.sub || token.id;
        session.user.name = token.name;
        session.user.image = token.picture as string;
        session.user.publicFavorites = token.publicFavorites ?? true;

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
