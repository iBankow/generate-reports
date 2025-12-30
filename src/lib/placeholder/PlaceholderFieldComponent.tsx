import React from 'react'
import { NodeViewWrapper } from '@tiptap/react'

interface PlaceholderFieldProps {
  node: {
    attrs: {
      name: string
      type: string
    }
  }
}

export const PlaceholderFieldComponent: React.FC<PlaceholderFieldProps> = ({ node }) => {
  const { name, type } = node.attrs

  return (
    <NodeViewWrapper as="span" className="placeholder-field">
      <span className="inline-block bg-yellow-100 border border-yellow-300 rounded-md px-2 py-1 font-mono text-sm text-yellow-800">
        {`{{${name}:${type}}}`}
      </span>
    </NodeViewWrapper>
  )
}