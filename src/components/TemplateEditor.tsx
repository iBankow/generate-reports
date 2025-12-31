import { useCallback, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { FieldEditModal } from './FieldEditModal'
import type { FormField } from '@/types/form'
import { FieldNode } from '@/lib/field-node-extension'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import './TemplateEditor.css'
import './field-styles.css'


interface TemplateEditorProps {
  onSave?: (
    title: string,
    description: string,
    markdown: string,
    fields: Array<FormField>,
  ) => void
  initialTitle?: string
  initialDescription?: string
  initialMarkdown?: string
}

export function TemplateEditor({
  onSave,
  initialTitle = '',
  initialDescription = '',
  initialMarkdown = '',
}: TemplateEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [fields, setFields] = useState<Array<FormField>>([])
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [pendingFieldType, setPendingFieldType] = useState<
    'text' | 'number' | 'image' | 'imageList' | 'list' | null
  >(null)

  const editor = useEditor({
    extensions: [StarterKit, FieldNode, TextStyleKit],
    content: initialMarkdown,
    onUpdate: ({ editor: currentEditor }) => {
      // Extrai campos dos nós fieldNode inline
      const extractedFields: Array<FormField> = []
      const fieldIds = new Set<string>()

      currentEditor.state.doc.descendants((node) => {
        if (
          node.type.name === 'fieldNode' &&
          node.attrs.id &&
          !fieldIds.has(node.attrs.id)
        ) {
          fieldIds.add(node.attrs.id)
          extractedFields.push({
            id: node.attrs.id,
            label: node.attrs.label,
            type: node.attrs.type,
            numberFormat: node.attrs.numberFormat,
            name: node.attrs.label.toLowerCase().replace(/\s+/g, '_'),
            required: true,
          })
        }
      })

      setFields(extractedFields)
    },
  })

  const handleInsertField = useCallback(
    (fieldType: 'text' | 'number' | 'image' | 'imageList' | 'list') => {
      setPendingFieldType(fieldType)
      setShowFieldModal(true)
    },
    [editor],
  )

  const handleSaveFieldModal = (data: {
    id: string
    label: string
    type: string
    numberFormat?: string
  }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'fieldNode',
        attrs: {
          id: data.id,
          label: data.label,
          type: data.type,
          numberFormat: data.numberFormat || 'simple',
        },
      })
      .insertContent(' ')
      .run()

    setShowFieldModal(false)
    setPendingFieldType(null)
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, preencha o título do template')
      return
    }

    const htmlContent = editor.getHTML()
    onSave?.(title, description, htmlContent, fields)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Título do Template</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Relatório de Vendas"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Descrição</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição breve do template"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Ferramentas</label>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleInsertField('text')}
            variant="outline"
            size="sm"
          >
            + Campo Texto
          </Button>
          <Button
            onClick={() => handleInsertField('number')}
            variant="outline"
            size="sm"
          >
            + Campo Número
          </Button>
          <Button
            onClick={() => handleInsertField('image')}
            variant="outline"
            size="sm"
          >
            + Imagem
          </Button>
          <Button
            onClick={() => handleInsertField('imageList')}
            variant="outline"
            size="sm"
          >
            + Lista Imagens
          </Button>
          <Button
            onClick={() => handleInsertField('list')}
            variant="outline"
            size="sm"
          >
            + Lista Simples
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Conteúdo do Template
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      </div>

      {fields.length > 0 && (
        <Card className="p-4 bg-slate-50">
          <h3 className="font-semibold mb-3">
            Campos Detectados ({fields.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className="text-sm p-2 bg-white rounded border"
              >
                <div className="font-mono text-xs text-slate-500">
                  {field.id}
                </div>
                <div className="font-medium">{field.label}</div>
                <div className="text-xs text-slate-600">{field.type}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button onClick={handleSave} className="w-full">
        Salvar Template
      </Button>

      {showFieldModal && pendingFieldType && (
        <FieldEditModal
          initialData={{
            id: `field_${Date.now()}`,
            label: '',
            type: pendingFieldType,
          }}
          onSave={handleSaveFieldModal}
          onClose={() => {
            setShowFieldModal(false)
            setPendingFieldType(null)
          }}
        />
      )}
    </div>
  )
}
