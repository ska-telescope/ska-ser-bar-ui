import { Icon } from "@mui/material";
import Image from "next/image";

export function AzureAD() {
  return (
    <Icon>
      <Image
        alt="Azure AD logo"
        src="/azure_ad.svg"
        height={25}
        width={25}
      ></Image>
    </Icon>
  );
}
