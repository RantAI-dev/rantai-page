"use client";

import "./tiptap.css";

import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu";
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";
import { EditorToolbar } from "./toolbars/editor-toolbar";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  placeholder?: string;
};

function createExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc",
        },
      },
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Placeholder.configure({
      emptyNodeClass: "is-editor-empty",
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case "heading":
            return `Heading ${node.attrs.level}`;
          case "detailsSummary":
            return "Section title";
          case "codeBlock":
            return "";
          default:
            return placeholder;
        }
      },
      includeChildren: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Subscript,
    Superscript,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    Typography,
  ];
}

export function RichTextEditor({
  value,
  onChange,
  className,
  placeholder = "Write something amazing...",
}: RichTextEditorProps) {
  const extensions = useMemo(() => createExtensions(placeholder), [placeholder]);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions as Extension[],
    content: value,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "relative max-h-[calc(100dvh-6rem)] w-full overflow-hidden overflow-y-auto rounded-lg border bg-card pb-[60px] sm:pb-0",
        className
      )}
    >
      <EditorToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[600px] w-full min-w-full cursor-text sm:p-6"
      />
    </div>
  );
}
