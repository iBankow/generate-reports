import { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { FieldEditModal } from '@/components/FieldEditModal'
import './field-styles.css'

interface FieldNodeComponentProps {
  node: ProseMirrorNode
  updateAttributes: (attrs: Record<string, unknown>) => void
  deleteNode: () => void
  selected: boolean
}

const EMOJI_MAP: Record<string, string> = {
  text: '📝',
  number: '🔢',
  image: '🖼️',
  imageList: '📸',
  list: '📋',
}

export function FieldNodeComponent({
  node,
  updateAttributes,
  selected,
}: FieldNodeComponentProps) {
  const [showModal, setShowModal] = useState(false)
  const { id, label, type } = node.attrs

  const handleSave = (data: { label: string; type: string; id: string }) => {
    updateAttributes({
      id: data.id,
      label: data.label,
      type: data.type,
    })
    setShowModal(false)
  }

  return (
    <NodeViewWrapper
      as="span"
      className={`field-node-inline ${selected ? 'selected' : ''}`}
      data-field-id={id}
      contentEditable={false}
    >
      <span
        className="field-node-badge"
        onClick={() => setShowModal(true)}
        title={`${label} (${type})`}
      >
        {EMOJI_MAP[type]}{label}
      </span>

      {showModal && (
        <FieldEditModal
          initialData={{ id, label, type }}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </NodeViewWrapper>
  )
}
