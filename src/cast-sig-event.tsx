import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { useState } from "react";

interface FormValues {
  signature: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (!v.signature) {
      showToast({ style: Toast.Style.Failure, title: "Please enter an event signature" });
      return;
    }

    try {
      const { stdout } = await execCast(`sig-event '${v.signature}'`);
      Clipboard.copy(stdout.replace("\n", ""));
      showToast({ style: Toast.Style.Success, title: "Copied event selector to clipboard" });
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
        title="Event signature"
        info="The event signature for which you want to find the selector"
        placeholder="Transfer(address indexed from, address indexed to, uint256 amount)"
      />
    </Form>
  );
}
