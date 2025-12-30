import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface FieldEditModalProps {
  initialData: {
    id: string
    label: string
    type: string
  }
  onSave: (data: { id: string; label: string; type: string }) => void
  onClose: () => void
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto', emoji: '📝' },
  { value: 'number', label: 'Número', emoji: '🔢' },
  { value: 'image', label: 'Imagem', emoji: '🖼️' },
  { value: 'imageList', label: 'Lista de Imagens', emoji: '📸' },
  { value: 'list', label: 'Lista Simples', emoji: '📋' },
]

export function FieldEditModal({ initialData, onSave, onClose }: FieldEditModalProps) {
  const [id, setId] = useState(initialData.id)
  const [label, setLabel] = useState(initialData.label)
  const [type, setType] = useState(initialData.type)
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!id.trim()) {
      setError('ID é obrigatório')
      return
    }
    if (!label.trim()) {
      setError('Label é obrigatória')
      return
    }
    if (!type) {
      setError('Tipo de campo é obrigatório')
      return
    }

    // Validar ID (apenas letras, números e underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      setError('ID deve conter apenas letras, números, underscore e hífen')
      return
    }

    onSave({ id, label, type })
  }

  return (
    <div className="field-modal-overlay">
      <div className="field-modal">
        <div className="field-modal-header">
          <h2>Editar Campo</h2>
          <button onClick={onClose} className="field-modal-close">
            ✕
          </button>
        </div>

        <div className="field-modal-body">
          <div className="field-modal-group">
            <label className="field-modal-label">ID do Campo</label>
            <Input
              value={id}
              onChange={(e) => {
                setId(e.target.value)
                setError('')
              }}
              placeholder="campo_id"
              disabled
              className="field-modal-input-disabled"
            />
            <span className="field-modal-help">ID gerado automaticamente (não editável)</span>
          </div>

          <div className="field-modal-group">
            <label className="field-modal-label">Label *</label>
            <Input
              value={label}
              onChange={(e) => {
                setLabel(e.target.value)
                setError('')
              }}
              placeholder="Ex: Nome do Cliente"
            />
            <span className="field-modal-help">Texto exibido no formulário</span>
          </div>

          <div className="field-modal-group">
            <label className="field-modal-label">Tipo de Campo *</label>
            <div className="field-modal-types">
              {FIELD_TYPES.map(({ value, label: typeLabel, emoji }) => (
                <button
                  key={value}
                  onClick={() => {
                    setType(value)
                    setError('')
                  }}
                  className={`field-modal-type-btn ${type === value ? 'field-modal-type-selected' : ''}`}
                >
                  <span className="field-modal-type-emoji">{emoji}</span>
                  <span className="field-modal-type-label">{typeLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="field-modal-error">{error}</div>}
        </div>

        <div className="field-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="field-modal-save-btn">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
}
