import NextAuth from "next-auth";
import GitLabProvider from "next-auth/providers/gitlab";

export const authOptions = {
    providers: [
      GitLabProvider({
        clientId: process.env.BINARY_GITLAB_CLIENT_ID!,
        clientSecret: process.env.BINARY_GITLAB_CLIENT_SECRET!,
        issuer: "https://gitlab.com",
        wellKnown: "https://gitlab.com/.well-known/openid-configuration",
        authorization: { params: { scope: "read_user openid profile email" } },
        profile(profile) {
            console.log("GitLab Profile Response:", profile); // Debugging line
    
            return {
              id: profile.sub || profile.id, // Ensure we get the correct user ID
              name: profile.name || profile.username,
              email: profile.email,
              image: profile.picture || profile.avatar_url,
            };
        },
      }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }) {
        return url.startsWith(baseUrl) ? url : baseUrl;
      },
      async session({ session, token }) {
        // Attach GitLab user info to the session
        if (token) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
  };
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };