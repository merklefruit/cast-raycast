import { ActionPanel, Action, Form, showToast, Toast } from "@raycast/api";

import { useCast } from "./useCast";

interface FormValues {
  startsWith: string;
  endsWith: string;
  matching: string;
  caseSensitive: boolean;
  deployerAddress: string;
  initCode: string;
  initCodeHash: string;
}

const Arguments = {
  startsWith: { required: true, name: "Starts with", flag: "--starts-with" },
  endsWith: { required: false, name: "Ends with", flag: "--ends-with" },
  matching: { required: false, name: "Matching", flag: "--matching" },
  caseSensitive: { required: false, name: "Case sensitive", flag: "--case-sensitive", type: "boolean" },
  deployerAddress: { required: false, name: "Deployer address", flag: "--deployer-address" },
  initCode: { required: false, name: "Init code", flag: "--init-code" },
  initCodeHash: { required: false, name: "Init code hash", flag: "--init-code-hash" },
} as const;

export default function Command() {
  const { isLoading, result, execute } = useCast("create2", Arguments);

  async function handleSubmit(v: FormValues) {
    try {
      await execute(v);
      showToast({ style: Toast.Style.Success, title: "Copied contract address to clipboard" });
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
          <Action.CopyToClipboard title="Copy CREATE2 address to clipboard" content={result} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="startsWith"
        title="Starts With"
        placeholder="c0ffee"
        info="The hex prefix of the address to be created"
      />
      <Form.Separator />
      <Form.TextField
        id="endsWith"
        title="Ends With"
        placeholder="00"
        info="The hex suffix of the address to be created"
      />
      <Form.TextField
        id="matching"
        title="Matching"
        placeholder="aabb"
        info="Hex sequence that the address has to match"
      />
      <Form.TextField
        id="deployerAddress"
        title="Deployer Address"
        placeholder="0x4e59b44847b379578588920ca78fbf26c0b4956c"
        info="Address of the contract deployer"
      />
      <Form.Checkbox id="caseSensitive" label="Case Sensitive" defaultValue={false} />

      <Form.TextField id="initCode" title="Init Code" placeholder="" info="The init code of the contract" />
      <Form.TextField
        id="initCodeHash"
        title="Init Code Hash"
        placeholder=""
        info="The init code hash of the contract"
      />
    </Form>
  );
}
