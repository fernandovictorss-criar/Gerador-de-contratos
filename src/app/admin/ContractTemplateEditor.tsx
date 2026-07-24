"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DEFAULT_CLAUSULAS_TEMPLATE, MERGE_FIELDS } from "@/lib/contract-template";

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-bold uppercase tracking-wide rounded-lg border px-3 py-1.5 cursor-pointer transition-colors ${
        active
          ? "bg-brand-gold text-brand-navy border-brand-gold"
          : "bg-brand-navy text-brand-light border-brand-border hover:border-brand-gold"
      }`}
    >
      {children}
    </button>
  );
}

export function ContractTemplateEditor({
  title = "Modelo de contrato",
  initialHtml,
  isCustom,
  action,
  headerActions,
  fields,
}: {
  title?: string;
  initialHtml: string;
  isCustom: boolean;
  action: (formData: FormData) => void | Promise<void>;
  headerActions?: React.ReactNode;
  fields?: React.ReactNode;
}) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [isDefault, setIsDefault] = useState(!isCustom);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        link: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        code: false,
      }),
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) {
        hiddenRef.current.value = editor.getHTML();
      }
      setIsDefault(false);
    },
    editorProps: {
      attributes: {
        class: "contract-editor-body",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold text-brand-light/80">{title}</p>
        {headerActions}
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          Negrito
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          Itálico
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          Título
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          Lista numerada
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          Lista com marcadores
        </ToolbarButton>

        <select
          value=""
          onChange={(e) => {
            const key = e.target.value;
            if (key) {
              editor.chain().focus().insertContent(`{{${key}}}`).run();
            }
            e.target.value = "";
          }}
          className="text-xs font-bold uppercase tracking-wide rounded-lg border border-brand-border bg-brand-navy text-brand-light px-3 py-1.5 cursor-pointer"
        >
          <option value="">Inserir campo...</option>
          {MERGE_FIELDS.map((field) => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            if (confirm("Restaurar o modelo padrão? As alterações não salvas serão perdidas.")) {
              editor.commands.setContent(DEFAULT_CLAUSULAS_TEMPLATE);
              if (hiddenRef.current) {
                hiddenRef.current.value = DEFAULT_CLAUSULAS_TEMPLATE;
              }
              setIsDefault(true);
            }
          }}
          className="ml-auto text-xs text-brand-gray hover:text-brand-gold hover:underline cursor-pointer"
        >
          Restaurar modelo padrão
        </button>
      </div>

      <div className="contract-editor rounded-lg border border-brand-border bg-brand-navy px-4 py-3 text-brand-light text-sm max-h-[28rem] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <form action={action} className="space-y-3">
        {fields}
        <input ref={hiddenRef} type="hidden" name="html" defaultValue={initialHtml} />
        <input type="hidden" name="isDefault" value={isDefault ? "true" : "false"} />
        <button
          type="submit"
          className="w-full rounded-full bg-brand-gold text-brand-navy font-bold uppercase tracking-wide py-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          Salvar modelo
        </button>
      </form>
    </div>
  );
}
