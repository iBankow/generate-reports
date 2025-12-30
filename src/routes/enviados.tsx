import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { FormSubmission } from '@/types/form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/enviados')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Array<FormSubmission>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const savedSubmissions = JSON.parse(
      localStorage.getItem('submissions') || '[]',
    ) as Array<FormSubmission>
    setSubmissions(savedSubmissions)
    setIsLoading(false)
  }, [])

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(submissions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `submissions_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    if (submissions.length === 0) return

    const firstSubmission = submissions[0]
    const headers = Object.keys(firstSubmission.data)

    const csvContent = [
      ['ID', 'Data de Envio', ...headers].join(','),
      ...submissions.map((s) => [
        s.submissionId,
        new Date(s.submittedAt).toLocaleString('pt-BR'),
        ...headers.map((h) => {
          const value = (s.data as Record<string, unknown>)[h]
          if (typeof value === 'string') return `"${value}"`
          return JSON.stringify(value)
        }),
      ]),
    ].join('\n')

    const dataBlob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteSubmission = (submissionId: string) => {
    if (confirm('Tem certeza que deseja deletar este envio?')) {
      const updated = submissions.filter((s) => s.submissionId !== submissionId)
      setSubmissions(updated)
      localStorage.setItem('submissions', JSON.stringify(updated))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Envios</h1>
            <p className="text-gray-600">
              Visualize todos os formulários enviados
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/templates' })}
          >
            ← Voltar para Templates
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center text-gray-500">
            Carregando envios...
          </Card>
        ) : submissions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhum formulário enviado ainda</p>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/templates' })}
            >
              Ir para Templates
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
              >
                📥 Exportar JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
              >
                📥 Exportar CSV
              </Button>
              <div className="flex-1" />
              <span className="text-sm text-gray-600 self-center">
                Total: {submissions.length} envio{submissions.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card
                  key={submission.submissionId}
                  className="p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        Envio #{submission.submissionId.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === submission.submissionId
                          ? null
                          : submission.submissionId,
                      )
                    }
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {expandedId === submission.submissionId ? '▼' : '▶'} Detalhes
                  </button>

                  {expandedId === submission.submissionId && (
                    <>
                      <div className="bg-gray-50 p-4 rounded mb-4 max-h-96 overflow-auto">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">
                          {JSON.stringify(submission.data, null, 2)}
                        </pre>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() =>
                            handleDeleteSubmission(submission.submissionId)
                          }
                        >
                          🗑️ Deletar
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
