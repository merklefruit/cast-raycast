export function getExecError(err: string) {
  return err.split(`Command failed: $HOME/.foundry/bin/cast `)?.[1] || "An error occurred";
}
