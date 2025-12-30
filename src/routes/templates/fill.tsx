import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DynamicField } from "@/components/DynamicField";
import { useTemplateStore } from "@/store/templateStore";
import { extractPlaceholders } from "@/lib/placeholder/parse";
import { ArrowLeft, FileText, Eye } from "lucide-react";

export const TemplateFillPage: React.FC = () => {
  const { id } = useParams({ from: "/templates/$id/preencher" });
  const navigate = useNavigate();
  const { getTemplate } = useTemplateStore();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(false);

  const template = getTemplate(id);

  const fields = useMemo(() => {
    if (!template) return [];
    return extractPlaceholders(template.content);
  }, [template]);

  useEffect(() => {
    if (!template) {
      navigate({ to: "/templates" });
    }
  }, [template, navigate]);

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <p>Template não encontrado.</p>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const generatePreview = () => {
    let content = template.content;

    // Substituir cada placeholder pelo valor correspondente
    fields.forEach((field) => {
      const value = formData[field.name] || "";
      const placeholder = `{{${field.name}:${field.type}}}`;

      let replacementValue = "";

      switch (field.type) {
        case "texto":
        case "numero":
        case "data":
          replacementValue = value.toString();
          break;

        case "imagem":
          if (value?.url) {
            replacementValue = `![${value.name}](${value.url})`;
          } else {
            replacementValue = "[Imagem não carregada]";
          }
          break;

        case "lista_imagens":
          if (Array.isArray(value) && value.length > 0) {
            replacementValue = value
              .filter((item) => item.url)
              .map((item) => `![${item.description || item.name}](${item.url})`)
              .join("\n\n");
          } else {
            replacementValue = "[Nenhuma imagem carregada]";
          }
          break;

        case "lista":
          if (Array.isArray(value) && value.length > 0) {
            replacementValue = value
              .filter((item) => item.trim())
              .map((item) => `• ${item}`)
              .join("\n");
          } else {
            replacementValue = "[Lista vazia]";
          }
          break;

        default:
          replacementValue = value.toString();
      }

      content = content.replace(
        new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        replacementValue
      );
    });

    return content;
  };

  const handleDownload = () => {
    const content = generatePreview();
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/[^a-zA-Z0-9]/g, "_")}_preenchido.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showPreview) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        {/* Header da preview */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPreview(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Preview: {template.name}
            </h1>
          </div>

          <Button
            onClick={handleDownload}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Baixar Markdown</span>
          </Button>
        </div>

        {/* Preview do conteúdo */}
        <div className="p-6 border rounded-lg bg-card">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {generatePreview()}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
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
            Preencher: {template.name}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
        </div>
      </div>

      {/* Formulário */}
      {fields.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Template sem campos dinâmicos
          </h3>
          <p className="text-muted-foreground mb-4">
            Este template não possui campos para preencher.
          </p>
          <Button onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver Conteúdo
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Instruções:</h3>
            <p className="text-sm text-muted-foreground">
              Preencha os campos abaixo para gerar seu relatório personalizado.
              Use o botão "Preview" para ver o resultado final antes de baixar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {fields.map((field) => (
              <DynamicField
                key={`${field.name}-${field.type}`}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setShowPreview(true)}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Ver Preview do Relatório</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
