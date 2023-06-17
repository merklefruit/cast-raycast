export interface ScriptCategory {
  title: string;
  items: Record<string, Script>;
}

export interface Script {
  name: string;
  description: string;
  component: () => JSX.Element;
}
