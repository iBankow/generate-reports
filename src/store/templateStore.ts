import { create } from 'zustand'

export interface Template {
  id: string
  name: string
  content: string // Markdown content
  createdAt: Date
  updatedAt: Date
}

interface TemplateStore {
  templates: Template[]
  currentTemplate: Template | null
  
  // Actions
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateTemplate: (id: string, updates: Partial<Pick<Template, 'name' | 'content'>>) => void
  deleteTemplate: (id: string) => void
  getTemplate: (id: string) => Template | undefined
  setCurrentTemplate: (template: Template | null) => void
  loadTemplates: () => void
  saveTemplates: () => void
}

// Funções auxiliares para localStorage
const STORAGE_KEY = 'generate-reports-templates'

const loadFromStorage = (): Template[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Converter strings de data de volta para Date objects
      return parsed.map((template: any) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt),
      }))
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error)
  }
  return []
}

const saveToStorage = (templates: Template[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  } catch (error) {
    console.error('Erro ao salvar templates:', error)
  }
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: loadFromStorage(),
  currentTemplate: null,

  addTemplate: (templateData) => {
    const id = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    
    const newTemplate: Template = {
      ...templateData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const newTemplates = [...state.templates, newTemplate]
      saveToStorage(newTemplates)
      return { templates: newTemplates }
    })

    return id
  },

  updateTemplate: (id, updates) => {
    set((state) => {
      const newTemplates = state.templates.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      )
      saveToStorage(newTemplates)
      return { templates: newTemplates }
    })
  },

  deleteTemplate: (id) => {
    set((state) => {
      const newTemplates = state.templates.filter((template) => template.id !== id)
      saveToStorage(newTemplates)
      return { 
        templates: newTemplates,
        currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate
      }
    })
  },

  getTemplate: (id) => {
    return get().templates.find((template) => template.id === id)
  },

  setCurrentTemplate: (template) => {
    set({ currentTemplate: template })
  },

  loadTemplates: () => {
    set({ templates: loadFromStorage() })
  },

  saveTemplates: () => {
    const { templates } = get()
    saveToStorage(templates)
  },
}))