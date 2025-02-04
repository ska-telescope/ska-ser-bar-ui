import Container from "./components/container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mui/material";
import { AzureAD } from "./components/utils/icons";

export default function Home() {
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
          ></Image>
          <p className="text-center text-6xl font-bold text-ska-secondary md:text-8xl">
            Binary Manager
          </p>
          <Link className="" href="/artefacts">
            <Button variant="contained" endIcon={<AzureAD />}>
              Continue with Azure AD
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
