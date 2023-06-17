import { useState } from "react";
import { Action, ActionPanel, List, useNavigation } from "@raycast/api";

import allScripts from "./scripts";
import { ScriptCategory, Script } from "./scripts/types";

export default function CastCommandsList() {
  const [categories, setCategories] = useState<ScriptCategory[]>(allScripts);

  return (
    <List isLoading={categories === undefined}>
      {categories?.map((category, idx) => (
        <List.Section key={idx} title={category.title}>
          {Object.values(category.items).map((item) => (
            <ListItem item={item} key={item.name} />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

function ListItem({ item }: { item: Script }) {
  const { pop, push } = useNavigation();

  return (
    <List.Item
      title={item.name}
      actions={
        <ActionPanel>
          <Action key={21} title="test" onAction={() => push(item.component())} />
        </ActionPanel>
      }
    />
  );
}
