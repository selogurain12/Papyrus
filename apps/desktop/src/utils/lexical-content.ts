interface LexicalNode {
  type?: string;
  text?: string;
  children?: LexicalNode[];
}

interface LexicalEditorState {
  root?: LexicalNode;
}

function isLexicalEditorState(value: unknown): value is LexicalEditorState {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    typeof (value as LexicalEditorState).root === "object"
  );
}

function nodeToPlainText(node: LexicalNode): string {
  if (node.type === "linebreak") {
    return "\n";
  }

  if (typeof node.text === "string") {
    return node.text;
  }

  const childrenText = node.children?.map(nodeToPlainText).join("") ?? "";

  if (node.type === "paragraph") {
    return childrenText;
  }

  return childrenText;
}

export function lexicalContentToPlainText(content: string | null | undefined): string {
  if (!content) {
    return "";
  }

  try {
    const parsed = JSON.parse(content) as unknown;

    if (!isLexicalEditorState(parsed)) {
      return content;
    }

    return parsed.root?.children?.map(nodeToPlainText).filter(Boolean).join("\n\n") ?? "";
  } catch {
    return content;
  }
}

export function countWordsFromContent(content: string | null | undefined): number {
  return lexicalContentToPlainText(content).trim().split(/\s+/).filter(Boolean).length;
}
