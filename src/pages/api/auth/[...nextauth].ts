import clientPromise from "@/utils/mongoDbPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "@/db/dbConnect";
import { UserModel } from "@/db/models/userModel";

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

    CredentialsProvider({
      name: "credentials",
      id: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        try {
          await dbConnect();
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isValid = await user.validatePassword(credentials.password);

          if (!isValid) {
            return null;
          }
          return {
            id: user._id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),

    // ...add more providers here
  ],

  adapter: MongoDBAdapter(clientPromise) as Adapter,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
};

const NextAuthHandler = (
  req: CustomNextApiRequest,
  res: CustomNextApiResponse
) => NextAuth(req, res, authOptions);

export default NextAuthHandler;
