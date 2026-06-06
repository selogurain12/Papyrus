import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import ExampleTheme from "./theme";
import ToolbarPlugin from "./toolbar-plugin";
import { parseAllowedColor, parseAllowedFontSize } from "./style-config";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

interface EditorProps {
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (content: string) => void;
}

const placeholder = "Commencez à écrire votre chapitre...";

const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
  const output = target.exportDOM(editor);

  if (output && isHTMLElement(output.element)) {
    for (const el of [output.element, ...output.element.querySelectorAll("[style],[class]")]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
    }
  }

  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  typeof ParagraphNode | typeof TextNode,
  // eslint-disable-next-line no-unused-vars
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>();

exportMap.set(ParagraphNode, removeStylesExportDOM);
exportMap.set(TextNode, removeStylesExportDOM);

const getExtraStyles = (element: HTMLElement): string => {
  let extraStyles = "";

  const fontSize = parseAllowedFontSize(element.style.fontSize);

  const backgroundColor = parseAllowedColor(element.style.backgroundColor);

  const color = parseAllowedColor(element.style.color);

  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size:${fontSize};`;
  }

  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color:${backgroundColor};`;
  }

  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color:${color};`;
  }

  return extraStyles;
};

function LoadStatePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (!value) return;
    if (initialized.current) return;

    try {
      const parsed = editor.parseEditorState(value);
      editor.setEditorState(parsed);
      initialized.current = true;
    } catch (e) {
      console.error(e);
    }
  }, [editor, value]);

  return null;
}

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);

      if (!importer) {
        return null;
      }

      return {
        ...importer,

        conversion: (element) => {
          const output = importer.conversion(element);

          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }

          const extraStyles = getExtraStyles(element);

          if (extraStyles) {
            const { forChild } = output;

            return {
              ...output,

              forChild: (child, parent) => {
                const textNode = forChild(child, parent);

                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }

                return textNode;
              },
            };
          }

          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  namespace: "Papyrus",

  theme: ExampleTheme,

  nodes: [ParagraphNode, TextNode],

  html: {
    export: exportMap,
    import: constructImportMap(),
  },

  onError(error: Error) {
    throw error;
  },
};

export default function Editor({ onChange, value }: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="w-full rounded-xl border bg-white shadow-sm">
        <ToolbarPlugin />

        <LoadStatePlugin value={value} />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="
                  min-h-[600px]
                  p-6
                  text-base
                  leading-7
                  outline-none
                  caret-slate-700
                "
              />
            }
            placeholder={
              <div
                className="
                  absolute
                  left-6
                  top-6
                  text-slate-400
                  pointer-events-none
                  select-none
                "
              >
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <AutoFocusPlugin />

          <OnChangePlugin
            onChange={(editorState) => {
              const json = editorState.toJSON();
              onChange?.(JSON.stringify(json));
            }}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
