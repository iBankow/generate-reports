import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PlaceholderNode } from "@/lib/placeholder/node";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onInsertPlaceholder: (insertFn: (field: { name: string; type: string }) => void) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  onInsertPlaceholder,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, PlaceholderNode],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4 border rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Função para inserir placeholder externamente
  const insertPlaceholder = useCallback(
    (field: { name: string; type: string }) => {
      if (editor) {
        editor.commands.insertPlaceholder(field);
      }
    },
    [editor]
  );

  // Expor a função de inserir placeholder
  useEffect(() => {
    if (editor) {
      // Criar uma referência global para poder chamar de fora
      (window as any).insertPlaceholder = insertPlaceholder;
    }
  }, [editor, insertPlaceholder]);

  // Atualizar onInsertPlaceholder sempre que o editor mudar
  useEffect(() => {
    if (editor && insertPlaceholder) {
      onInsertPlaceholder(insertPlaceholder);
    }
  }, [editor, insertPlaceholder, onInsertPlaceholder]);

  if (!editor) {
    return (
      <div className="p-4 border rounded-md min-h-[400px] animate-pulse bg-muted" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bold")
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          Negrito
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("italic")
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          Itálico
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("bulletList")
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("orderedList")
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          Lista Numerada
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-accent"
          }`}
        >
          H2
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};
