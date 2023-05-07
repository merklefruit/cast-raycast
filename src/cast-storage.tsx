import { ActionPanel, Action, Form } from "@raycast/api";
import { useCast } from "./useCast";

const Arguments = {
  address: { required: true, name: "Address" },
  slot: { required: true, name: "Slot" },
} as const;

const successMessage = "Copied storage slot value to clipboard";

export default function Command() {
  const { isLoading, result, execute } = useCast("storage --flashbots", Arguments, { successMessage });

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={execute} />
          <Action.OpenInBrowser title="View Docs" url="https://book.getfoundry.sh/reference/cast/cast-storage" />
          <Action.CopyToClipboard title="Copy storage slot value to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="address"
        title="Address"
        placeholder="beer.eth"
        info="The address to query the storage slot for"
      />
      <Form.TextField id="slot" title="Slot" placeholder="0" info="The storage slot number to query the value for" />
    </Form>
  );
}
