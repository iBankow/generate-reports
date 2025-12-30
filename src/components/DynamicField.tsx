import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Upload } from 'lucide-react'

interface FieldValue {
  [key: string]: any
}

interface DynamicFieldProps {
  name: string
  type: string
  value: any
  onChange: (value: any) => void
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ name, type, value, onChange }) => {
  const fieldId = `field-${name}`

  const renderField = () => {
    switch (type) {
      case 'texto':
        return (
          <Input
            id={fieldId}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Digite ${name.replace(/_/g, ' ')}`}
          />
        )

      case 'numero':
        return (
          <Input
            id={fieldId}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Digite ${name.replace(/_/g, ' ')}`}
          />
        )

      case 'data':
        return (
          <Input
            id={fieldId}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'imagem':
        return (
          <div className="space-y-2">
            <Input
              id={fieldId}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Simular URL da imagem (em produção, faria upload)
                  const url = URL.createObjectURL(file)
                  onChange({ file, url, name: file.name })
                }
              }}
            />
            {value?.url && (
              <div className="border rounded-md p-2">
                <img 
                  src={value.url} 
                  alt={value.name} 
                  className="max-w-full h-32 object-contain mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-1">{value.name}</p>
              </div>
            )}
          </div>
        )

      case 'lista_imagens':
        const images = value || []
        return (
          <div className="space-y-4">
            {images.map((item: any, index: number) => (
              <div key={index} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Imagem {index + 1}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newImages = images.filter((_: any, i: number) => i !== index)
                      onChange(newImages)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      const newImages = [...images]
                      newImages[index] = { 
                        ...newImages[index], 
                        file, 
                        url, 
                        name: file.name 
                      }
                      onChange(newImages)
                    }
                  }}
                />
                
                {item.url && (
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="max-w-full h-24 object-contain"
                  />
                )}
                
                <Input
                  type="text"
                  placeholder="Descrição da imagem"
                  value={item.description || ''}
                  onChange={(e) => {
                    const newImages = [...images]
                    newImages[index] = { ...newImages[index], description: e.target.value }
                    onChange(newImages)
                  }}
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onChange([...images, { description: '' }])
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Imagem
            </Button>
          </div>
        )

      case 'lista':
        const items = value || ['']
        return (
          <div className="space-y-2">
            {items.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items]
                    newItems[index] = e.target.value
                    onChange(newItems)
                  }}
                  placeholder={`Item ${index + 1}`}
                />
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = items.filter((_: string, i: number) => i !== index)
                      onChange(newItems)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => onChange([...items, ''])}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        )

      default:
        return (
          <Input
            id={fieldId}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Digite ${name.replace(/_/g, ' ')}`}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {name.replace(/_/g, ' ').toUpperCase()} 
        <span className="text-xs text-muted-foreground ml-2">({type})</span>
      </Label>
      {renderField()}
    </div>
  )
}