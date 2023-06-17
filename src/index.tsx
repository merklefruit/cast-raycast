import { useEffect, useState } from "react";
import { List } from "@raycast/api";

import allScripts from "./scripts";
import { ScriptCategory, Script } from "./scripts/types";

export default function CastList() {
  const [categories, setCategories] = useState<ScriptCategory[]>(allScripts);

  console.log(categories);

  return (
    <List isLoading={categories === undefined}>
      {categories?.map((category) => (
        <List.Section key={category.title} title={category.title}>
          {/* {category.items.map((item) => {
            return <ListItem item={item} key={item.name} />;
          })} */}
        </List.Section>
      ))}
    </List>
  );
}

function ListItem(props: { item: Script }) {
  return <List.Item title={props.item.name} />;
}
