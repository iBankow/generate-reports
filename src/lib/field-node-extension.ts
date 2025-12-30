import { Node as TiptapNode } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FieldNodeComponent } from '@/components/FieldNodeComponent'

export interface FieldNodeAttributes {
  id: string
  label: string
  type: string
}

export const FieldNode = TiptapNode.create({
  name: 'fieldNode',
  group: 'inline',
  inline: true,
  
  addAttributes() {
    return {
      id: {
        default: '',
      },
      label: {
        default: '',
      },
      type: {
        default: 'text',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'field-node',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['field-node', { ...HTMLAttributes }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FieldNodeComponent)
  },
})
