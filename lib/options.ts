import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {getDbConnection} from "@/lib/db";
import {upsertUser} from "@/db/goqueries/query_sql";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.googleId = profile.sub;
            }

            try {
                if (token.googleId && !token.role) {
                    const client = await getDbConnection();
                    const dbUser = await upsertUser(client, {
                        googleId: token.googleId as string,
                        name: token.name as string,
                        avatarUrl: token.picture as string,
                        email: token.email as string,
                    });

                    token.role = dbUser?.role;
                    token.id = dbUser?.id;
                }
            } catch (error) {
                console.error("Error during JWT callback", error);
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as number;
                session.user.isSigned = true;
                session.user.id = token.id as number;
                session.user.avatarUrl = token.avatarUrl as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};