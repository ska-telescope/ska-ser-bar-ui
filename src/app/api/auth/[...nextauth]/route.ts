import NextAuth, { Session } from "next-auth";
import GitLabProvider from "next-auth/providers/gitlab";
import { JWT } from "next-auth/jwt";

const authOptions = {
    providers: [
      GitLabProvider({
        clientId: process.env.BINARY_GITLAB_CLIENT_ID!,
        clientSecret: process.env.BINARY_GITLAB_CLIENT_SECRET!,
        issuer: "https://gitlab.com",
        wellKnown: "https://gitlab.com/.well-known/openid-configuration",
        authorization: { params: { scope: "read_user openid profile email", claims: "groups_direct"} },
        async profile(profile) {
          return {
            id: profile.sub || profile.id,
            name: profile.preferred_username || profile.name || profile.nickname,
            email: profile.email,
            groups_direct: profile.groups_direct,
          };
        },
      }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      },
      async jwt({ token, user }: { token: JWT; user?: any }) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.groups_direct = user.groups_direct ?? [];
        }
        return token;
      },
      async session({ session, token }: { session: Session; token: JWT }) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          groups_direct: (token.groups_direct as string[]) ?? [],
        };
        return session;
      },
    },
  };
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };