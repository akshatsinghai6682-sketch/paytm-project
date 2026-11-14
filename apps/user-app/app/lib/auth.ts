import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { decode as defaultDecode, encode as defaultEncode } from "next-auth/jwt";

export const authOptions = {
    session: {
        strategy: "jwt" as const,
    },
    jwt: {
        encode: (params: any) => defaultEncode(params),
        decode: async (params: any) => {
            try {
                return await defaultDecode(params);
            } catch (e) {
                return null;
            }
        }
    },
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          async authorize(credentials: any) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword,
                        Balance: {
                            create: {
                                amount: 0,
                                locked: 0
                            }
                        }
                    }
                });

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "secret",
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id ?? token.sub;
            }

            return session;
        }
    }
  }
  