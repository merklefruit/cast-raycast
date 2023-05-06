import { Clipboard, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { useState } from "react";
import { getExecError } from "./utils";

interface FormValues {
  nonce: string;
  address: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (v.address)
      exec(
        `$HOME/.foundry/bin/cast compute-address ${v.address} ${v.nonce !== "" ? `--nonce ${v.nonce}` : ""} `,
        (err, stdout) => {
          if (err) {
            showToast({ style: Toast.Style.Failure, title: err.message });
            console.error(err);
            return;
          }
          const res = stdout.slice(-43);
          setResult(res);
          Clipboard.copy(res);
          showToast({ style: Toast.Style.Success, title: "Copied computed address to clipboard" });
        }
      );
    else {
      showToast({ style: Toast.Style.Failure, title: "Address is required" });
      return false;
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action.CopyToClipboard title="Copy selector to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="nonce"
        title="Nonce"
        placeholder="0"
        info="The nonce of the deployer address. Defaults to the latest nonce, fetched from the RPC."
      />
      <Form.TextField
        id="address"
        title="Deployer address"
        placeholder="0x388C818CA8B9251b393131C08a736A67ccB19297"
        info="The address of the EOA deploying the contract"
      />
    </Form>
  );
}
