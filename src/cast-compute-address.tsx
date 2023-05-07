import { Clipboard, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";

interface FormValues {
  nonce: string;
  address: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (!v.address) {
      showToast({ style: Toast.Style.Failure, title: "Deployer Address is required" });
      return;
    }

    try {
      const { stdout } = await execCast(`compute-address ${v.address} ${v.nonce !== "" ? `--nonce ${v.nonce}` : ""}`);
      Clipboard.copy(stdout.replace("Computed Address: ", "").replace("\n", ""));
      showToast({ style: Toast.Style.Success, title: "Copied contract address to clipboard" });
      setResult(stdout);
    } catch (err: any) {
      showToast({ style: Toast.Style.Failure, title: err.stderr });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action.CopyToClipboard title="Copy address to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="address"
        title="Deployer address"
        placeholder="0x388C818CA8B9251b393131C08a736A67ccB19297"
        info="The address of the EOA deploying the contract"
      />
      <Form.Separator />
      <Form.TextField
        id="nonce"
        title="Nonce"
        placeholder="0"
        info="The nonce of the deployer address. Defaults to the latest nonce, fetched from the RPC."
      />
    </Form>
  );
}
