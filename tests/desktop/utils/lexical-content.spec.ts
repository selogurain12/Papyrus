import { countWordsFromContent, lexicalContentToPlainText } from "../../../apps/desktop/src/utils/lexical-content";

const lexicalContent = JSON.stringify({
  root: {
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", text: "Premier paragraphe" }],
      },
      {
        type: "paragraph",
        children: [
          { type: "text", text: "Deuxième ligne" },
          { type: "linebreak" },
          { type: "text", text: "suite" },
        ],
      },
    ],
  },
});

describe("lexical content utilities", () => {
  it("converts Lexical JSON to readable text", () => {
    expect(lexicalContentToPlainText(lexicalContent)).toBe(
      "Premier paragraphe\n\nDeuxième ligne\nsuite"
    );
  });

  it("returns raw text when content is not JSON", () => {
    expect(lexicalContentToPlainText("Texte brut")).toBe("Texte brut");
  });

  it("returns empty text for empty content and raw JSON for non Lexical JSON", () => {
    expect(lexicalContentToPlainText(null)).toBe("");
    expect(lexicalContentToPlainText(JSON.stringify({ value: "not lexical" }))).toBe(
      '{"value":"not lexical"}'
    );
  });

  it("counts words from Lexical content", () => {
    expect(countWordsFromContent(lexicalContent)).toBe(5);
  });
});
