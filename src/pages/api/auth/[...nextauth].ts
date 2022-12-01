/**
 *
 * Authentication route using NextAuth
 * Prisma adapter provides type mapping and ORM
 *
 */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@prisma/client";
import NextAuth, { Session } from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "~/server/prisma";

export interface WithAuth {
	auth: boolean;
}

export interface WithRole {
	roles: Role[];
}

export interface WithAuthRole extends WithAuth, WithRole {}

let useMockProvider = process.env.NODE_ENV === "test";

const { GITHUB_CLIENT_ID, GITHUB_SECRET, NODE_ENV, APP_ENV } = process.env;

if (
	(NODE_ENV !== "production" || APP_ENV === "test") &&
	(!GITHUB_CLIENT_ID || !GITHUB_SECRET)
) {
	console.log("⚠️ Using mocked GitHub auth correct credentials were not added");
	useMockProvider = true;
}

const providers: Provider[] = [
	EmailProvider({
		server: process.env.EMAIL_SERVER,
		from: process.env.EMAIL_FROM,
	}),
	GoogleProvider({
		clientId: process.env.GOOGLE_ID || "",
		clientSecret: process.env.GOOGLE_SECRET || "",
	}),
	GithubProvider({
		clientId: process.env.GITHUB_ID || "",
		clientSecret: process.env.GITHUB_SECRET || "",
	}),
];

/**
 * If in development show signin for mock provider
 */
if (useMockProvider)
	providers.push(
		CredentialsProvider({
			id: "github",
			name: "mocked GitHub",
			async authorize(credentials) {
				console.log(credentials);
				return {
					id: credentials?.name,
					name: credentials?.name,
					email: credentials?.name,
				};
			},
			credentials: {
				name: { type: "test" },
			},
		})
	);

export default NextAuth({
	session: {
		strategy: "database",
	},
	adapter: PrismaAdapter(prisma),
	providers: providers,
	debug: false,
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		async session({ session, user }) {
			const userData = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
				select: {
					role: true,
					id: true,
				},
			});

			// Add user ID and role to session object
			const updatedSession: Session = {
				...session,
				userId: user.id,
				user: {
					...session.user,
					id: user.id,
					role: userData?.role ?? Role.USER,
				},
			};

			return updatedSession;
		},
		// Seems to be required for custom sign in page to work
		// Does skip sign in process, just signs in.
		async redirect({ baseUrl }) {
			return baseUrl;
		},
	},
});
