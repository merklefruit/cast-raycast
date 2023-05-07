import { ActionPanel, Action, Form } from "@raycast/api";
import { useCast } from "./useCast";

const Arguments = {
  signature: { required: true, name: "Function Signature" },
} as const;

const successMessage = "Copied function selector to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("sig", Arguments, { successMessage });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={(v) => execute({ signature: `"${v.signature}"` })} />
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