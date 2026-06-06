import type { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  paragraph: "mb-2",

  quote: "border-l-4 border-slate-300 pl-4 italic text-slate-500 my-3",

  code: "block rounded-md bg-slate-100 p-4 font-mono text-sm overflow-x-auto",

  heading: {
    h1: "text-4xl font-bold mb-4",
    h2: "text-3xl font-semibold mb-3",
    h3: "text-2xl font-semibold mb-2",
    h4: "text-xl font-semibold mb-2",
    h5: "text-lg font-semibold mb-1",
    h6: "text-base font-semibold mb-1",
  },

  list: {
    ul: "list-disc ml-6",
    ol: "list-decimal ml-6",
    listitem: "my-1",
    nested: {
      listitem: "ml-4",
    },
  },

  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "rounded bg-slate-100 px-1 py-0.5 font-mono text-sm",
  },

  link: "text-blue-600 hover:underline",
};

export default theme;
