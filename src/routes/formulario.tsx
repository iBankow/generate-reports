import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormSubmission, FormTemplate } from '@/types/form'
import { DynamicForm } from '@/components/DynamicForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import './routes.css'

export const Route = createFileRoute('/formulario')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate')
    if (savedTemplate) {
      setTemplate(JSON.parse(savedTemplate))
    }
    setIsLoading(false)
  }, [])

  const handleFormDataChange = (data: Record<string, unknown>) => {
    setFormValues(data)
  }

  const renderFieldPreview = (
    fieldType: string,
    value: unknown,
    label: string,
  ): string => {
    const emptyFieldHTML = `<span class="route-empty-field" style="padding: 4px 8px; border-radius: 4px; font-weight: 500; margin: 0 2px; display: inline-block;">${label}</span>`

    // Se não tem valor, retorna campo vazio
    if (value === undefined || value === null || value === '') {
      return emptyFieldHTML
    }

    switch (fieldType) {
      case 'image': {
        return `<img src="${String(value)}" alt="${label}" style="max-width: 100%; max-height: 300px; border-radius: 4px; border: 1px solid var(--primary);" />`
      }

      case 'imageList': {
        const imageList = value as Array<{ url: string; description: string }>
        const images = imageList
          .filter((item) => item.url)
          .map(
            (item) =>
              `<div style="margin-bottom: 12px; text-align: center;">
              <img src="${item.url}" alt="${item.description}" style="max-width: 100%; max-height: 200px; border-radius: 4px; border: 1px solid var(--primary);" />
              ${item.description ? `<p style="margin-top: 4px; font-size: 0.875rem; color: var(--muted-foreground);">${item.description}</p>` : ''}
            </div>`,
          )
          .join('')
        return images || emptyFieldHTML
      }

      case 'list': {
        const items = value as Array<string>
        const listItems = items
          .filter((item) => item)
          .map(
            (item) =>
              `<li style="margin-left: 20px; margin-bottom: 4px; list-style: initial;">${item}</li>`,
          )
          .join('')
        return listItems
          ? `<ul style="margin: 8px 0; padding-left: 20px;">${listItems}</ul>`
          : emptyFieldHTML
      }

      case 'text':
      case 'number':
      default: {
        const displayValue = String(value)
        return `<span class="route-value-badge" style="padding: 4px 8px; border-radius: 4px; font-weight: 500; margin: 0 2px; display: inline-block;">${displayValue}</span>`
      }
    }
  }

  const getPreviewContent = (): string => {
    if (!template) return ''

    let html = template.markdown

    // Processa cada campo usando o ID
    template.fields.forEach((field) => {
      const value = formValues[field.id]

      // Escapa caracteres especiais no ID para usar em regex
      const escapedId = field.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      // Regex para encontrar a tag field-node com o ID específico
      const fieldPattern = new RegExp(
        `<field-node[^>]*id="${escapedId}"[^>]*>.*?</field-node>`,
        'gi',
      )

      const replacement = renderFieldPreview(field.type, value, field.label)
      html = html.replace(fieldPattern, replacement)
    })

    return html
  }

  const handleFormSubmit = (submission: FormSubmission) => {
    try {
      const existingSubmissions = JSON.parse(
        localStorage.getItem('submissions') || '[]',
      )
      existingSubmissions.unshift(submission)
      localStorage.setItem('submissions', JSON.stringify(existingSubmissions))

      alert('Formulário enviado com sucesso!')
      navigate({ to: '/enviados' })
    } catch (error) {
      console.error('Erro ao salvar envio:', error)
      alert('Erro ao enviar formulário')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 route-container flex items-center justify-center">
        <Card className="p-8 text-center route-card">
          <p className="route-text-muted">Carregando formulário...</p>
        </Card>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen p-8 route-container">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center route-card">
            <p className="route-text-muted mb-4">Nenhum template selecionado</p>
            <Button onClick={() => navigate({ to: '/templates' })}>
              Voltar para Templates
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 route-container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/templates' })}
          >
            ← Voltar para Templates
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna de Formulário */}
          <div>
            <Card className="p-6 route-card">
              <DynamicForm
                title={template.title}
                description={template.description}
                content={template.markdown}
                fields={template.fields}
                templateId={template.id}
                onSubmit={handleFormSubmit}
                onDataChange={handleFormDataChange}
              />
            </Card>
          </div>

          {/* Coluna de Preview */}
          <div>
            <Card className="p-6 sticky top-8 route-card">
              <h2 className="text-2xl font-bold mb-4">Previsualizacao</h2>
              <div
                className="prose prose-sm max-w-none p-4 rounded route-preview-bg"
                dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
