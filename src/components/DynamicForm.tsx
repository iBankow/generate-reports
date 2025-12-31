import React, { useState } from 'react'
import type { FormField, FormSubmission, ImageListItem } from '@/types/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatNumber, unformatNumber } from '@/lib/number-formatter'

interface DynamicFormProps {
  title: string
  description: string
  content: string
  fields: Array<FormField>
  onSubmit?: (submission: FormSubmission) => void
  onDataChange?: (data: Record<string, unknown>) => void
  onDownloadHTML?: () => void
  templateId: string
}

export function DynamicForm({
  title,
  description,
  fields,
  onSubmit,
  onDataChange,
  onDownloadHTML,
  templateId,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  const handleTextChange = (fieldId: string, value: string) => {
    const newData = { ...formData, [fieldId]: value }
    setFormData(newData)
    onDataChange?.(newData)
  }

  const handleNumberChange = (fieldId: string, value: string) => {
    // Remove formatação anterior para obter apenas números
    const unformatted = unformatNumber(value)

    const newData = {
      ...formData,
      [fieldId]: unformatted ? unformatted : '',
    }
    setFormData(newData)
    onDataChange?.(newData)
  }

  const handleImageUpload = (
    fieldId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      const newData = {
        ...formData,
        [fieldId]: base64,
      }
      setFormData(newData)
      onDataChange?.(newData)
    }
    reader.readAsDataURL(file)
  }

  const handleImageListAdd = (fieldId: string) => {
    setFormData((prev) => {
      const current = (prev[fieldId] ?? []) as Array<ImageListItem>
      const newData = {
        ...prev,
        [fieldId]: [...current, { url: '', description: '' }],
      }
      onDataChange?.(newData)
      return newData
    })
  }

  const handleImageListChange = (
    fieldId: string,
    index: number,
    key: 'url' | 'description',
    value: string,
  ) => {
    setFormData((prev) => {
      const current = (prev[fieldId] ?? []) as Array<ImageListItem>
      const items = [...current]
      items[index] = { ...items[index], [key]: value }
      const newData = { ...prev, [fieldId]: items }
      onDataChange?.(newData)
      return newData
    })
  }

  const handleImageListUpload = (
    fieldId: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setFormData((prev) => {
        const current = (prev[fieldId] ?? []) as Array<ImageListItem>
        const items = [...current]
        items[index] = { ...items[index], url: base64 }
        const newData = { ...prev, [fieldId]: items }
        onDataChange?.(newData)
        return newData
      })
    }
    reader.readAsDataURL(file)
  }

  const handleListAdd = (fieldId: string) => {
    setFormData((prev) => {
      const current = (prev[fieldId] ?? []) as Array<string>
      const newData = {
        ...prev,
        [fieldId]: [...current, ''],
      }
      onDataChange?.(newData)
      return newData
    })
  }

  const handleListChange = (fieldId: string, index: number, value: string) => {
    setFormData((prev) => {
      const current = (prev[fieldId] ?? []) as Array<string>
      const items = [...current]
      items[index] = value
      const newData = { ...prev, [fieldId]: items }
      onDataChange?.(newData)
      return newData
    })
  }

  const handleListRemove = (fieldId: string, index: number) => {
    setFormData((prev) => {
      const current = (prev[fieldId] ?? []) as Array<string>
      const items = [...current]
      items.splice(index, 1)
      const newData = { ...prev, [fieldId]: items }
      onDataChange?.(newData)
      return newData
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submission: FormSubmission = {
      templateId,
      submissionId: `sub_${Date.now()}`,
      data: formData,
      submittedAt: new Date(),
    }

    onSubmit?.(submission)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="block font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
              <Textarea
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
              />
            )}

            {field.type === 'number' && (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={
                    formData[field.id]
                      ? formatNumber(String(formData[field.id]), (field as any)?.numberFormat || 'simple')
                      : ''
                  }
                  onChange={(e) => handleNumberChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
                {(field as any)?.numberFormat && (
                  <div className="text-xs text-gray-500">
                    {(field as any)?.numberFormat === 'currency' && 'Formato: Moeda (R$)'}
                    {(field as any)?.numberFormat === 'document' && 'Formato: CPF/CNPJ'}
                    {(field as any)?.numberFormat === 'simple' && 'Formato: Número simples'}
                  </div>
                )}
              </div>
            )}

            {field.type === 'image' && (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(field.id, e)}
                  required={field.required && !formData[field.id]}
                />
                {formData[field.id] ? (
                  <div className="relative w-full max-w-sm">
                    <img
                      src={formData[field.id] as string}
                      alt="Preview"
                      className="w-full h-auto rounded border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => {
                          const newData = { ...prev }
                          delete newData[field.id]
                          return newData
                        })
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded text-sm"
                    >
                      Remover
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {field.type === 'imageList' && (
              <div className="space-y-3">
                {((formData[field.id] || []) as Array<ImageListItem>).map(
                  (item: ImageListItem, index: number) => (
                    <div key={index} className="p-3 border rounded space-y-2">
                      <div>
                        <label className="text-sm font-medium">
                          Imagem {index + 1}
                        </label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageListUpload(field.id, index, e)
                          }
                        />
                        {item.url && (
                          <img
                            src={item.url}
                            alt={`Item ${index + 1}`}
                            className="w-full h-32 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Descrição</label>
                        <Textarea
                          value={item.description}
                          onChange={(e) =>
                            handleImageListChange(
                              field.id,
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          placeholder="Descrição da imagem"
                          rows={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => {
                            const current = (prev[field.id] ??
                              []) as Array<ImageListItem>
                            const items = [...current]
                            items.splice(index, 1)
                            return { ...prev, [field.id]: items }
                          })
                        }
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remover item
                      </button>
                    </div>
                  ),
                )}
                <Button
                  type="button"
                  onClick={() => handleImageListAdd(field.id)}
                  variant="outline"
                  className="w-full"
                >
                  + Adicionar Imagem
                </Button>
              </div>
            )}

            {field.type === 'list' && (
              <div className="space-y-2">
                {((formData[field.id] || []) as Array<string>).map(
                  (item: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleListChange(field.id, index, e.target.value)
                        }
                        placeholder="Item da lista"
                      />
                      <button
                        type="button"
                        onClick={() => handleListRemove(field.id, index)}
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ),
                )}
                <Button
                  type="button"
                  onClick={() => handleListAdd(field.id)}
                  variant="outline"
                  className="w-full"
                >
                  + Adicionar Item
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Enviar Formulário
        </Button>
        {onDownloadHTML && (
          <Button
            type="button"
            onClick={onDownloadHTML}
            variant="outline"
            className="flex-1"
          >
            💾 Salvar como HTML
          </Button>
        )}
      </div>
    </form>
  )
}
