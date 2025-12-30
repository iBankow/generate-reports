import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormTemplate } from '@/types/form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/templates/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Array<FormTemplate>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTemplates = JSON.parse(
      localStorage.getItem('templates') || '[]',
    )
    setTemplates(savedTemplates)
    setIsLoading(false)
  }, [])

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      const updated = templates.filter((t) => t.id !== templateId)
      setTemplates(updated)
      localStorage.setItem('templates', JSON.stringify(updated))
    }
  }

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      localStorage.setItem('selectedTemplate', JSON.stringify(template))
      navigate({ to: '/formulario' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Templates</h1>
            <p className="text-gray-600">
              Gerencie seus templates de formulários
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/templates/create', search: { editId: undefined } })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Novo Template
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center text-gray-500">
            Carregando templates...
          </Card>
        ) : templates.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhum template criado ainda</p>
            <Button
              onClick={() => navigate({ to: '/templates/create', search: { editId: undefined } })}
              variant="outline"
            >
              Criar Primeiro Template
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-6 flex flex-col hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">
                  {template.description}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  {template.fields.length} campo{template.fields.length !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Usar
                  </Button>
                  <Button
                    onClick={() =>
                      navigate({
                        to: '/templates/create',
                        search: { editId: template.id },
                      })
                    }
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteTemplate(template.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Deletar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
