// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../../lib/db/prisma";

// import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
// import { PrismaClient } from '@prisma/client';

import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});