import { homedir } from "os";
import { promisify } from "util";
import { useState } from "react";
import { exec } from "child_process";
import { Clipboard, Toast, showToast } from "@raycast/api";

interface CastArg {
  required: boolean;
  name: string;
  flag?: string;
  type?: "string" | "boolean";
}

interface Opts {
  saveToClipboard?: boolean;
  outputParser?: (stdout: string, ...extra: any) => string;
  errorParser?: (stderr: string, ...extra: any) => string;
  successMessage?: string;
}

function defaultOutputParser(stdout: string) {
  return stdout.replace("\n", "").trim();
}

function defaultErrorParser(stderr: string, fullCommand?: string) {
  console.log(stderr, fullCommand);

  const initial = stderr
    .split("Command failed: /Users/nico/.foundry/bin/cast")[1]
    ?.replace("[31m", "")
    .replace("[0m", "");

  if (!initial) {
    const secondary = stderr.replace("Error: \n", "").replace("[31m", "").replace("[0m", "");
    if (secondary) return secondary;
    return "An error occurred";
  }

  const clean = fullCommand ? initial.replace(fullCommand, "") : initial;
  if (clean) return clean;

  return initial;
}

export function useCast<Args>(cmd: string, args: Partial<Record<keyof Args, CastArg>>, opts?: Opts) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");

  const saveToClipboard = opts?.saveToClipboard ?? true;
  const successMessage = opts?.successMessage ?? "Copied to clipboard";
  const outputParser = opts?.outputParser ?? defaultOutputParser;
  const errorParser = opts?.errorParser ?? defaultErrorParser;

  async function execute(withArgs: Args) {
    checkValidArgs(withArgs);

    const fullCommand = `${cmd} ${parseArgs(withArgs)}`;

    try {
      setIsLoading(true);

      const { stdout, stderr } = await execCast(fullCommand);

      if (stderr) {
        console.log(stderr);
        throw new Error(stderr);
      }

      const output = outputParser(stdout);

      if (saveToClipboard) Clipboard.copy(output);

      setResult(output);
      showToast({ style: Toast.Style.Success, title: successMessage });

      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);

      const error = errorParser(err.stderr, fullCommand);
      showToast({ style: Toast.Style.Failure, title: error });
      throw new Error(error);
    }
  }

  function parseArgs(withArgs: Args) {
    const allArgs = Object.entries(args) as [keyof Args, CastArg][];

    const parsedArgs = allArgs
      .filter(([k, _]) => withArgs[k])
      .map(([_, arg]) => {
        if (arg.type === "boolean") return arg.flag;
        return `${arg.flag ? arg.flag : ""} ${withArgs[_]}`;
      })
      .join(" ");

    return parsedArgs;
  }

  function checkValidArgs(withArgs: Args) {
    const allArgs = Object.entries(args) as [keyof Args, CastArg][];

    const missingArgs = allArgs.filter(([k, arg]) => arg.required && !withArgs[k]);
    if (missingArgs.length > 0) {
      throw new Error(`Missing required args: ${missingArgs.map(([_, arg]) => arg.name).join(", ")}`);
    }

    const invalidArgs = allArgs.filter(([k, arg]) => arg.type === "boolean" && typeof withArgs[k] !== "boolean");
    if (invalidArgs.length > 0) {
      throw new Error(`Invalid args: ${invalidArgs.map(([_, arg]) => arg.name).join(", ")}`);
    }

    return true;
  }

  return { execute, isLoading, result };
}

export interface ExecResult {
  stdout: string;
  stderr: string;
}

const FOUNDRY_BIN = homedir() + "/.foundry/bin/cast";
const execp = promisify(exec);

export async function execCast(cmd: string, cancel?: AbortController): Promise<ExecResult> {
  try {
    return await execp(`${FOUNDRY_BIN} ${cmd}`, { signal: cancel?.signal, maxBuffer: 10 * 1024 * 1024 });
  } catch (err: any) {
    if (err?.code === 127) {
      throw new Error(`Cast executable not found at: ${FOUNDRY_BIN}`);
    }

    throw err;
  }
}
