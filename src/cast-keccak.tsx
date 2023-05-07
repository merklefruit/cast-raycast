import { Clipboard, ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";

import { useState } from "react";
import { execCast } from "./utils";

interface FormValues {
  value: string;
}

export default function Command() {
  const [result, setResult] = useState("");

  async function handleSubmit(v: FormValues) {
    if (!v.value) {
      showToast({ style: Toast.Style.Failure, title: "Please enter a value to hash" });
      return;
    }

    try {
      const { stdout } = await execCast(`keccak ${v.value}`);
      Clipboard.copy(stdout.replace("\n", ""));
      showToast({ style: Toast.Style.Success, title: "Copied keccak hash to clipboard" });
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
          <Action.CopyToClipboard title="Copy hash to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField id="value" title="Data to hash" placeholder="hello world" info="The data you want to hash" />
    </Form>
  );
}
