import Image from "next/image";
import Link from "next/link";
import NavbarMenu from "./navbarMenu";

export default function Navbar({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-between bg-ska-primary bg-opacity-[0.9] px-4 py-2 shadow-lg">
        <Link href="/artefacts">
          <Image
            alt="SKAO logo"
            src="/logo_light.svg"
            width={80}
            height={0}
          ></Image>
        </Link>
        <NavbarMenu></NavbarMenu>
      </div>
    </div>
  );
}
