import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormField, FormTemplate } from '@/types/form'
import { TemplateEditor } from '@/components/TemplateEditor'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/templates/create')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    editId: (search.editId as string) || undefined,
  }),
})

function RouteComponent() {
  const navigate = useNavigate()
  const { editId } = Route.useSearch()
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(!!editId)

  useEffect(() => {
    if (editId) {
      const savedTemplates = JSON.parse(
        localStorage.getItem('templates') || '[]',
      ) as Array<FormTemplate>
      const template = savedTemplates.find((t) => t.id === editId)
      if (template) {
        setEditingTemplate(template)
      }
      setIsLoading(false)
    }
  }, [editId])

  const handleSaveTemplate = (
    title: string,
    description: string,
    markdown: string,
    fields: Array<FormField>,
  ) => {
    try {
      const savedTemplates = JSON.parse(
        localStorage.getItem('templates') || '[]',
      ) as Array<FormTemplate>

      if (editingTemplate) {
        // Atualizar template existente
        const updatedTemplates = savedTemplates.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...editingTemplate,
                title,
                description,
                markdown,
                fields,
                updatedAt: new Date(),
              }
            : t,
        )
        localStorage.setItem('templates', JSON.stringify(updatedTemplates))
        alert('Template atualizado com sucesso!')
      } else {
        // Criar novo template
        const newTemplate = {
          id: `template_${Date.now()}`,
          title,
          description,
          markdown,
          fields,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        savedTemplates.unshift(newTemplate)
        localStorage.setItem('templates', JSON.stringify(savedTemplates))
        alert('Template criado com sucesso!')
      }

      navigate({ to: '/templates' })
    } catch (error) {
      console.error('Erro ao salvar template:', error)
      alert('Erro ao salvar template')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/templates' })}
          >
            ← Voltar para Templates
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center text-gray-500">
            Carregando template...
          </Card>
        ) : (
          <Card className="p-6">
            <h1 className="text-3xl font-bold mb-2">
              {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
            </h1>
            <p className="text-gray-600 mb-6">
              {editingTemplate
                ? 'Edite os dados do seu template'
                : 'Crie um template com campos dinâmicos para seus formulários'}
            </p>

            <TemplateEditor
              onSave={handleSaveTemplate}
              initialTitle={editingTemplate?.title}
              initialDescription={editingTemplate?.description}
              initialMarkdown={editingTemplate?.markdown}
            />
          </Card>
        )}
      </div>
    </div>
  )
}
