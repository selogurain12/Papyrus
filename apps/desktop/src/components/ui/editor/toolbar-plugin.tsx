/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  RotateCcw as Undo,
  RotateCw as Redo,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function Divider() {
  return <div className="w-px bg-gray-200 mx-1" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor }
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="flex mb-0.5 bg-white p-1 rounded-t-[10px] items-center" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5 disabled:opacity-20"
        aria-label="Undo"
      >
        <Undo
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-20"
        aria-label="Redo"
      >
        <Redo
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5 ${isBold ? "bg-blue-100/30" : ""}`}
        aria-label="Format Bold"
      >
        <Bold
          size={18}
          className={`inline-flex h-4.5 w-4.5 mt-0.5 align-middle bg-contain ${isBold ? "opacity-100" : "opacity-60"}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5 ${isItalic ? "bg-blue-100/30" : ""}`}
        aria-label="Format Italics"
      >
        <Italic
          size={18}
          className={`inline-flex h-4.5 w-4.5 mt-0.5 align-middle bg-contain ${isItalic ? "opacity-100" : "opacity-60"}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5 ${isUnderline ? "bg-blue-100/30" : ""}`}
        aria-label="Format Underline"
      >
        <Underline
          size={18}
          className={`inline-flex h-4.5 w-4.5 mt-0.5 align-middle bg-contain ${isUnderline ? "opacity-100" : "opacity-60"}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={`flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5 ${isStrikethrough ? "bg-blue-100/30" : ""}`}
        aria-label="Format Strikethrough"
      >
        <Strikethrough
          size={18}
          className={`inline-flex h-4.5 w-4.5 mt-0.5 align-middle bg-contain ${isStrikethrough ? "opacity-100" : "opacity-60"}`}
        />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5"
        aria-label="Left Align"
      >
        <AlignLeft
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5"
        aria-label="Center Align"
      >
        <AlignCenter
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed mr-0.5"
        aria-label="Right Align"
      >
        <AlignRight
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="flex border-0 bg-none rounded-[10px] p-2 cursor-pointer items-center hover:bg-gray-200 disabled:cursor-not-allowed"
        aria-label="Justify Align"
      >
        <AlignJustify
          size={18}
          className="inline-flex h-4.5 w-4.5 mt-0.5 align-middle opacity-60 bg-contain"
        />
      </button>
    </div>
  );
}
