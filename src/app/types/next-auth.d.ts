import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      groups_direct: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    groups_direct: string[];
  }

  interface JWT {
    id: string;
    groups_direct: string[];
  }
}