import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { TemplateEditorPage } from './routes/templates/editor'
import { TemplateFillPage } from './routes/templates/fill'
import { TemplatesListPage } from './routes/templates/index'

// Root layout component
const rootRoute = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Generate Reports</h1>
            <div className="flex space-x-4">
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </a>
              <a href="/templates" className="text-muted-foreground hover:text-foreground">
                Templates
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold tracking-tight mb-4">
        Sistema de Templates de Relatórios
      </h2>
      <p className="text-muted-foreground mb-8">
        Crie e preencha templates de relatórios técnicos de forma dinâmica.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Criar Template</h3>
          <p className="text-muted-foreground mb-4">
            Use o editor para criar templates com campos dinâmicos.
          </p>
          <a 
            href="/templates/editor"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Novo Template
          </a>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ver Templates</h3>
          <p className="text-muted-foreground mb-4">
            Visualize e edite templates existentes.
          </p>
          <a 
            href="/templates"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Ver Templates
          </a>
        </div>
      </div>
    </div>
  )
}

// Templates listing route
const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: TemplatesListPage,
})

// Template editor route
const templateEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/editor',
  component: TemplateEditorPage,
})

// Template fill route
const templateFillRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates/$id/preencher',
  component: TemplateFillPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  templatesRoute,
  templateEditorRoute,
  templateFillRoute,
])

// Create the router
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }