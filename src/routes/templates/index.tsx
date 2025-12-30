import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTemplateStore } from "@/store/templateStore";
import { Plus, FileText, Calendar, Trash2, Edit, Play } from "lucide-react";

export const TemplatesListPage: React.FC = () => {
  const { templates, deleteTemplate } = useTemplateStore();

  const handleDelete = (templateId: string, templateName: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o template "${templateName}"?`
      )
    ) {
      deleteTemplate(templateId);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>

        <Link to="/templates/editor">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Template</span>
          </Button>
        </Link>
      </div>

      {/* Lista de templates */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhum template encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Crie seu primeiro template para começar a gerar relatórios.
          </p>
          <Link to="/templates/editor">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Template
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
            >
              {/* Header do card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {template.name}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Criado em {formatDate(template.createdAt)}
                  </div>
                  {template.updatedAt.getTime() !==
                    template.createdAt.getTime() && (
                    <div className="text-xs text-muted-foreground">
                      Atualizado em {formatDate(template.updatedAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview do conteúdo */}
              <div className="mb-4">
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {template.content.substring(0, 150)}
                  {template.content.length > 150 && "..."}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link to={`/templates/${template.id}/preencher`}>
                  <Button size="sm" className="flex items-center space-x-1">
                    <Play className="h-3 w-3" />
                    <span>Preencher</span>
                  </Button>
                </Link>

                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // TODO: Implementar edição
                      console.log("Editar template:", template.id);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(template.id, template.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
