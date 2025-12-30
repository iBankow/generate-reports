import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddField: (field: { name: string; type: string }) => void
}

const fieldTypes = [
  { value: 'texto', label: 'Texto' },
  { value: 'numero', label: 'Número' },
  { value: 'data', label: 'Data' },
  { value: 'imagem', label: 'Imagem' },
  { value: 'lista_imagens', label: 'Lista de Imagens' },
  { value: 'lista', label: 'Lista' },
]

export const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  open,
  onOpenChange,
  onAddField,
}) => {
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('texto')

  const handleSubmit = () => {
    if (!fieldName.trim()) {
      return
    }

    onAddField({
      name: fieldName.trim(),
      type: fieldType,
    })

    // Reset form
    setFieldName('')
    setFieldType('texto')
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form
    setFieldName('')
    setFieldType('texto')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Campo</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="field-name" className="text-right">
              Nome
            </Label>
            <Input
              id="field-name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Ex: nome_cliente"
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="field-type" className="text-right">
              Tipo
            </Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!fieldName.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}