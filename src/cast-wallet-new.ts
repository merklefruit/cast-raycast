import { Clipboard, showHUD } from "@raycast/api";

import { execCast } from "./useCast";

const successMessage = "Copied wallet info to clipboard";

export default async function Command() {
  const { stdout } = await execCast("wallet new");
  Clipboard.copy(stdout);
  showHUD(successMessage);
}
