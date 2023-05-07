import { Clipboard, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";

import { useState } from "react";
import { execCast } from "./utils";

interface FormValues {
  signature: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (!v.signature) {
      showToast({ style: Toast.Style.Failure, title: "Please enter a function signature" });
      return;
    }

    try {
      const { stdout } = await execCast(`sig '${v.signature}'`);
      Clipboard.copy(stdout.replace("\n", ""));
      showToast({ style: Toast.Style.Success, title: "Copied function selector to clipboard" });
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
          <Action.CopyToClipboard title="Copy selector to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="signature"
        title="Function signature"
        placeholder="transfer(address,uint256)"
        info="The function signature for which you want to find the selector"
      />
    </Form>
  );
}
