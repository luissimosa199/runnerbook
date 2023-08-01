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
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credenciales",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Tu correo electrónico",
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
            // No user found with that email address
            return null;
          }

          const isValid = await user.validatePassword(credentials.password);

          if (!isValid) {
            // Password is incorrect
            return null;
          }

          // Return user object that will be saved in the token
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            // image: user.image
          };
        } catch (error) {
          // Handle any other database or comparison errors
          console.error(error);
          return null;
        }
      },
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
