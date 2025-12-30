import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipTapEditor } from "@/components/TipTapEditor";
import { AddFieldDialog } from "@/components/AddFieldDialog";
import { useTemplateStore } from "@/store/templateStore";
import { htmlToMarkdown } from "@/lib/placeholder/parse";
import { Plus, Save, ArrowLeft } from "lucide-react";

export const TemplateEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTemplate } = useTemplateStore();

  const [templateName, setTemplateName] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const insertPlaceholderRef = useRef<((field: { name: string; type: string }) => void) | null>(null);

  const handleInsertPlaceholder = useCallback((insertFn: (field: { name: string; type: string }) => void) => {
    insertPlaceholderRef.current = insertFn;
  }, []);

  const handleAddField = useCallback(
    (field: { name: string; type: string }) => {
      if (insertPlaceholderRef.current) {
        insertPlaceholderRef.current(field);
      }
    },
    []
  );

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert("Por favor, informe o nome do template.");
      return;
    }

    if (!editorContent.trim()) {
      alert("Por favor, adicione conteúdo ao template.");
      return;
    }

    setIsSaving(true);

    try {
      // Converter HTML para Markdown
      const markdownContent = htmlToMarkdown(editorContent);

      // Salvar o template
      addTemplate({
        name: templateName.trim(),
        content: markdownContent,
      });

      // Navegar para a lista de templates
      navigate({ to: "/templates" });
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      alert("Erro ao salvar template. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: "/templates" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Editor de Template
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsFieldDialogOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Campo</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving || !templateName.trim()}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Salvando..." : "Salvar Template"}</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Nome do template */}
        <div className="space-y-2">
          <Label htmlFor="template-name">Nome do Template</Label>
          <Input
            id="template-name"
            type="text"
            placeholder="Ex: Relatório Técnico - Inspeção de Equipamentos"
            value={templateName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemplateName(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Editor */}
        <div className="space-y-2">
          <Label>Conteúdo do Template</Label>
          <TipTapEditor
            content={editorContent}
            onChange={setEditorContent}
            onInsertPlaceholder={handleInsertPlaceholder}
          />
        </div>

        {/* Instruções */}
        <div className="p-4 border rounded-md bg-muted/50">
          <h3 className="text-sm font-medium mb-2">Instruções:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Escreva o texto base do seu relatório</div>
            <div>
              • Use o botão "Adicionar Campo" para inserir campos dinâmicos
            </div>
            <div>
              • Os campos aparecerão como chips amarelos no formato{" "}
              {`{{nome:tipo}}`}
            </div>
            <div>
              • Tipos disponíveis: texto, número, data, imagem, lista_imagens,
              lista
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para adicionar campo */}
      <AddFieldDialog
        open={isFieldDialogOpen}
        onOpenChange={setIsFieldDialogOpen}
        onAddField={handleAddField}
      />
    </div>
  );
};
