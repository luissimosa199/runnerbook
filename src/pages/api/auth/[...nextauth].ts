import clientPromise from "@/utils/mongoDbPromise";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
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
            image: user.image,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),

    // ...add more providers here
  ],

  callbacks: {
    // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.image = session.image;
      }
      return token;
    },
  },

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
