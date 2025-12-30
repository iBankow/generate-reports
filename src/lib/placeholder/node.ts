import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PlaceholderFieldComponent } from './PlaceholderFieldComponent'

export interface PlaceholderOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    placeholder: {
      insertPlaceholder: (options: { name: string; type: string }) => ReturnType
    }
  }
}

export const PlaceholderNode = Node.create<PlaceholderOptions>({
  name: 'placeholder',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      name: {
        default: '',
      },
      type: {
        default: 'texto',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'placeholder-field',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['placeholder-field', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderFieldComponent)
  },

  addCommands() {
    return {
      insertPlaceholder:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})