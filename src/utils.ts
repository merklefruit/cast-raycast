import { exec } from "child_process";
import { homedir } from "os";
import { promisify } from "util";

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export interface ExecError extends Error {
  code: number;
  stdout: string;
  stderr: string;
}

const FOUNDRY_BIN = homedir() + "/.foundry/bin/cast";
const execp = promisify(exec);

export async function execCast(cmd: string, cancel?: AbortController): Promise<ExecResult> {
  try {
    return await execp(`${FOUNDRY_BIN} ${cmd}`, { signal: cancel?.signal, maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    const execErr = err as ExecError;
    if (execErr && execErr.code === 127) {
      execErr.stderr = `Cast executable not found at: ${FOUNDRY_BIN}`;
      throw execErr;
    } else {
      let parsed = execErr.message
        .split("Command failed: /Users/nico/.foundry/bin/cast")[1]
        .replace("[31m", "")
        .replace("[0m", "");

      if (parsed) execErr.stderr = parsed;
      throw err;
    }
  }
}
