import clientPromise from "@/utils/mongoDbPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";

import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";

export interface CustomSession extends Session {
  // Add any custom session properties here
}

export interface CustomNextApiRequest extends NextApiRequest {
  // Add any custom request properties here
}

export interface CustomNextApiResponse<T = any> extends NextApiResponse<T> {
  // Add any custom response properties here
}

export const authOptions: NextAuthOptions = {

  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    // ...add more providers here
  ],

  adapter: MongoDBAdapter(clientPromise) as Adapter,

  // Add any custom typings or configurations here
  // For example:
  // session: {
  //   jwt: true,
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   updateAge: 24 * 60 * 60, // 24 hours
  // },
  // callbacks: {
  //   async session(session: CustomSession, user: any) {
  //     session.user.id = user.id
  //     return session
  //   },
  // },
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error", // Error code callbacks will redirect here
  // },
  // database: process.env.DATABASE_URL,
  // secret: process.env.SECRET,
  // sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  // sessionUpdateAge: 24 * 60 * 60, // 24 hours
  // ...
};

const NextAuthHandler = (
  req: CustomNextApiRequest,
  res: CustomNextApiResponse
) => NextAuth(req, res, authOptions);

export default NextAuthHandler;