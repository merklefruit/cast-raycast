import { Clipboard, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { useState } from "react";

interface FormValues {
  signature: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (v.signature)
      exec(`$HOME/.foundry/bin/cast keccak "${v.signature.replace("\n", "")}"`, (err, stdout) => {
        if (err) {
          showToast({ style: Toast.Style.Failure, title: err.message });
          console.error(err);
          return;
        }
        setResult(stdout);
        Clipboard.copy(stdout);
        showToast({ style: Toast.Style.Success, title: "Copied keccak result to clipboard" });
      });
    else {
      showToast({ style: Toast.Style.Failure, title: "Value is required" });
      return false;
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
          <Action.CopyToClipboard title="Copy value to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField id="signature" title="Input data" placeholder="hello world" />
    </Form>
  );
}
