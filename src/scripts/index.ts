import * as Abi from "./abi";
import * as Account from "./account";
import * as Ens from "./ens";
import { ScriptCategory } from "./types";
import * as Utility from "./utility";
import * as Wallet from "./wallet";

const allScripts: ScriptCategory[] = [
  { title: "ABI", items: Abi },
  { title: "Account", items: Account },
  { title: "ENS", items: Ens },
  { title: "Utility", items: Utility },
  { title: "Wallet", items: Wallet },
];

export default allScripts;
