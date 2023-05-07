import { ActionPanel, Action, Form } from "@raycast/api";
import { useCast } from "./useCast";

const Arguments = {
  value: { required: true, name: "Value" },
} as const;

const successMessage = "Copied keccak hash to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("keccak", Arguments, { successMessage });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={execute} />
          <Action.OpenInBrowser title="View Docs" url="https://book.getfoundry.sh/reference/cast/cast-keccak" />
          <Action.CopyToClipboard title="Copy hash to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField id="value" title="Data to hash" placeholder="hello world" info="The data you want to hash" />
    </Form>
  );
}
