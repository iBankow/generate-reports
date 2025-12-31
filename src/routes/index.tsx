import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import './routes.css'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    templates: 0,
    submissions: 0,
  })

  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem('templates') || '[]')
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]')
    setStats({
      templates: templates.length,
      submissions: submissions.length,
    })
  }, [])

  return (
    <div className="min-h-screen p-8 route-container">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-2">Gerador de Relatórios</h1>
          <p className="text-xl route-text-muted">
            Crie templates de formulários dinâmicos e colete dados facilmente
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Card de Criar Template */}
          <Card
            className="p-8 flex flex-col items-center justify-center hover:shadow-xl transition cursor-pointer route-card"
            onClick={() =>
              navigate({
                to: '/templates/create',
                search: { editId: undefined },
              })
            }
            style={{ borderColor: 'var(--primary)' }}
          >
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold mb-2">Novo Template</h2>
            <p className="route-text-muted text-center mb-4">
              Crie um novo template de formulário
            </p>
            <Button className="route-button-primary w-full">
              Criar Template
            </Button>
          </Card>

          {/* Card de Templates */}
          <Card
            className="p-8 flex flex-col justify-between hover:shadow-xl transition cursor-pointer route-card"
            onClick={() => navigate({ to: '/templates' })}
          >
            <div>
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-2xl font-bold mb-2">Templates</h2>
              <p className="route-text-muted text-center mb-4">
                Gerencie seus templates
              </p>
            </div>
            <div className="route-bg-secondary rounded p-3 mb-4 text-center">
              <div className="text-3xl font-bold">{stats.templates}</div>
              <div className="text-sm route-text-muted">
                template{stats.templates !== 1 ? 's' : ''} criado
                {stats.templates !== 1 ? 's' : ''}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Ver Templates
            </Button>
          </Card>

          {/* Card de Envios */}
          <Card
            className="p-8 flex flex-col justify-between hover:shadow-xl transition cursor-pointer route-card"
            onClick={() => navigate({ to: '/enviados' })}
          >
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2">Envios</h2>
              <p className="route-text-muted text-center mb-4">
                Visualize dados coletados
              </p>
            </div>
            <div className="route-bg-accent rounded p-3 mb-4 text-center">
              <div className="text-3xl font-bold">{stats.submissions}</div>
              <div className="text-sm route-text-muted">
                formulário{stats.submissions !== 1 ? 's' : ''} enviado
                {stats.submissions !== 1 ? 's' : ''}
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Ver Envios
            </Button>
          </Card>
        </div>

        {/* Seção de Informações */}
        <Card className="p-8 bg-white">
          <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold">Criar Template</h3>
              </div>
              <p className="text-gray-600 ml-11">
                Use o editor Tiptap para criar um template de formulário com
                campos dinâmicos
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold">Selecionar Template</h3>
              </div>
              <p className="text-gray-600 ml-11">
                Escolha um template e preencha o formulário com os dados
                necessários
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold">Enviar e Analisar</h3>
              </div>
              <p className="text-gray-600 ml-11">
                Envie os dados e visualize todos os envios em um único lugar
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
