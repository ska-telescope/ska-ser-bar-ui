"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "./components/container";
import Image from "next/image";
import { Button, CircularProgress } from "@mui/material";
import { Gitlab } from "./components/utils/icons";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/artefacts");
    }
  }, [status, session, router]);

  return (
    <main>
      <Container className="relative flex min-h-full">
        <div className="absolute min-h-full w-full bg-gradient-to-b from-ska-primary to-ska-secondary opacity-[0.3]"></div>
        <div className="flex w-full flex-col items-center justify-center space-y-8">
          <Image
            alt="SKAO logo"
            src="/logo.png"
            width={512}
            height={512}
            className="w-64 md:w-[30rem]"
          />

          <p className="text-center text-6xl font-bold text-ska-secondary md:text-8xl">
            Binary Artefacts Repository
          </p>

          {status === "loading" ? (
            <div className="flex flex-col items-center space-y-2">
              <CircularProgress color="inherit" />
              <p className="text-xl text-ska-primary">Redirecting to artefacts...</p>
            </div>
          ) : status === "authenticated" ? null : (
            <Button variant="contained" endIcon={<Gitlab />} onClick={() => signIn("gitlab")}>
              Continue with GitLab
            </Button>
          )}
        </div>
      </Container>
    </main>
  );
}