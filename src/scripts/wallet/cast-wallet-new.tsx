import { Clipboard, showHUD } from "@raycast/api";

import { execCast } from "../../lib/utils";
import { Script } from "../types";

export const CastWalletNew: Script = {
  name: "New Wallet",
  description: "Create a new random keypair",
  component: Command,
};

const successMessage = "Copied wallet info to clipboard";

export default function Command() {
  (async () => {
    const { stdout } = await execCast("wallet new", 1);
    Clipboard.copy(stdout);
    showHUD(successMessage);
  })();

  return <></>;
}
