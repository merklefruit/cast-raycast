import { ActionPanel, Action, Form } from "@raycast/api";
import { useCast } from "./useCast";

const Arguments = {
  address: { required: true, name: "Address" },
} as const;

const successMessage = "Copied wallet balance to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("balance --flashbots --ether", Arguments, { successMessage });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={execute} />
          <Action.OpenInBrowser title="View Docs" url="https://book.getfoundry.sh/reference/cast/cast-balance" />
          <Action.CopyToClipboard title="Copy balance to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="address"
        title="Address"
        placeholder="beer.eth"
        info="The wallet address to query the balance for"
      />
    </Form>
  );
}