import { ActionPanel, Action, Form } from "@raycast/api";
import { useCast } from "./useCast";

const Arguments = {
  address: { required: true, name: "Address" },
} as const;

const successMessage = "Copied address to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("resolve-name --flashbots", Arguments, { successMessage });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={execute} />
          <Action.OpenInBrowser title="View Docs" url="https://book.getfoundry.sh/reference/cast/cast-resolve-name" />
          <Action.CopyToClipboard title="Copy address to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="address"
        title="Address"
        placeholder="vitalik.eth"
        info="The ENS name to query the address for"
      />
    </Form>
  );
}
