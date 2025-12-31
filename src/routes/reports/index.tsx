import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormField, FormSubmission, FormTemplate } from '@/types/form'
import { TemplateEditor } from '@/components/TemplateEditor'
import { DynamicForm } from '@/components/DynamicForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import '../routes.css'

export const Route = createFileRoute('/reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [templates, setTemplates] = useState<Array<FormTemplate>>([])
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null,
  )
  const [submissions, setSubmissions] = useState<Array<FormSubmission>>([])
  const [activeTab, setActiveTab] = useState<
    'templates' | 'form' | 'submissions'
  >('templates')

  const handleSaveTemplate = (
    title: string,
    description: string,
    markdown: string,
    fields: Array<FormField>,
  ) => {
    const newTemplate: FormTemplate = {
      id: `template_${Date.now()}`,
      title,
      description,
      markdown,
      fields,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTemplates((prev) => [newTemplate, ...prev])
    setActiveTab('templates')
    alert('Template salvo com sucesso!')
  }

  const handleSelectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setActiveTab('form')
  }

  const handleFormSubmit = (submission: FormSubmission) => {
    setSubmissions((prev) => [submission, ...prev])
    alert('Formulário enviado com sucesso!')
    console.log('Submission:', submission)
  }

  return (
    <div className="min-h-screen p-8 route-container">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Gerador de Relatórios</h1>
        <p className="route-text-muted mb-8">
          Crie templates de formulários dinâmicos com campos variáveis
        </p>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as 'templates' | 'form' | 'submissions')
          }
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="form" disabled={!selectedTemplate}>
              Formulário
            </TabsTrigger>
            <TabsTrigger value="submissions">Envios</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6 mt-6">
            <Card className="p-6 route-card">
              <h2 className="text-2xl font-bold mb-4">Criar Novo Template</h2>
              <TemplateEditor onSave={handleSaveTemplate} />
            </Card>

            {templates.length > 0 && (
              <Card className="p-6 route-card">
                <h3 className="text-xl font-bold mb-4">Templates Criados</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <Card
                      key={template.id}
                      className="p-4 border-2 cursor-pointer transition route-card"
                      style={{ borderColor: 'var(--primary)' }}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <h4 className="font-bold text-lg mb-2">
                        {template.title}
                      </h4>
                      <p className="text-sm route-text-muted mb-3">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="route-text-muted">
                          {template.fields.length} campos
                        </span>
                        <Button size="sm" variant="outline">
                          Usar Template
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="form" className="mt-6">
            {selectedTemplate && (
              <Card className="p-6 route-card">
                <DynamicForm
                  title={selectedTemplate.title}
                  description={selectedTemplate.description}
                  content={selectedTemplate.markdown}
                  fields={selectedTemplate.fields}
                  templateId={selectedTemplate.id}
                  onSubmit={handleFormSubmit}
                />
              </Card>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6 mt-6">
            {submissions.length === 0 ? (
              <Card className="p-6 text-center route-card route-text-muted">
                Nenhum formulário enviado ainda
              </Card>
            ) : (
              <div className="grid gap-4">
                {submissions.map((submission) => (
                  <Card key={submission.submissionId} className="p-6 route-card">
                    <div className="mb-4">
                      <h4 className="font-bold text-lg mb-2">
                        Envio #{submission.submissionId}
                      </h4>
                      <p className="text-sm route-text-muted">
                        {new Date(submission.submittedAt).toLocaleString(
                          'pt-BR',
                        )}
                      </p>
                    </div>
                    <div className="route-submission-details p-4 rounded max-h-96 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {JSON.stringify(submission.data, null, 2)}
                      </pre>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
