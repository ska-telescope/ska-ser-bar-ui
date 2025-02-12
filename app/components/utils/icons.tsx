import { Icon } from "@mui/material";
import Image from "next/image";

export function Gitlab() {
  return (
    <Icon>
      <Image
        alt="Gitlab logo"
        src="/gitlab_logo.svg"
        height={25}
        width={25}
      ></Image>
    </Icon>
  );
}
