import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";
import { useCast } from "./useCast";

interface FormValues {
  signature: string;
}

const Arguments = {
  signature: { required: true, name: "Function Signature" },
} as const;

const successMessage = "Copied function selector to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("sig", Arguments, { successMessage });

  async function handleSubmit(v: FormValues) {
    try {
      await execute({ signature: `"${v.signature}"` });
    } catch (err: any) {
      showToast({ style: Toast.Style.Failure, title: err.message });
    }
  }

  return (
    <Form
      isLoading={isLoading}
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
