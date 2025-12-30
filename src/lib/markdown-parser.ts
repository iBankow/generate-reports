import type { FieldType, FormField } from '@/types/form'

interface ParsedField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
}

export function parseMarkdownTemplate(markdown: string): {
  content: string
  fields: Array<FormField>
} {
  const fields: Array<FormField> = []
  const fieldMap = new Map<string, ParsedField>()

  // Encontra todos os campos variáveis
  let match
  const fieldPattern = /\{\{([a-zA-Z0-9_-]+):([a-zA-Z]+)(?::([^}]*))?\}\}/g

  while ((match = fieldPattern.exec(markdown)) !== null) {
    const [, id, type, options] = match
    const validType = isValidFieldType(type) ? type : 'text'

    if (!fieldMap.has(id)) {
      const parsedOptions = parseFieldOptions(options || '', id)
      fieldMap.set(id, {
        id,
        type: validType,
        label: parsedOptions.label || id,
        placeholder: parsedOptions.placeholder,
        required: parsedOptions.required !== false,
      })
    }
  }

  // Converte para array ordenado por aparição no markdown
  fieldMap.forEach((field) => {
    fields.push(field as FormField)
  })

  // Remove os placeholders do markdown para exibir apenas o conteúdo formatado
  const cleanContent = markdown.replace(
    /\{\{[a-zA-Z0-9_-]+:[a-zA-Z]+(?::[^}]*)?\}\}/g,
    (fullMatch) => {
      const extracted = fullMatch.match(/\{\{([a-zA-Z0-9_-]+):/)
      return extracted ? `**[${extracted[1].toUpperCase()}]**` : fullMatch
    }
  )

  return { content: cleanContent, fields }
}

function isValidFieldType(type: string): type is FieldType {
  return ['text', 'number', 'image', 'imageList', 'list'].includes(type)
}

interface FieldOptions {
  label?: string
  placeholder?: string
  required?: boolean
}

function parseFieldOptions(options: string, id: string): FieldOptions {
  if (!options) {
    return { label: id, required: true }
  }

  const result: FieldOptions = { required: true }
  const parts = options.split('|').map((p) => p.trim())

  for (const part of parts) {
    if (part.startsWith('label:')) {
      result.label = part.replace('label:', '').trim()
    } else if (part.startsWith('placeholder:')) {
      result.placeholder = part.replace('placeholder:', '').trim()
    } else if (part === 'optional') {
      result.required = false
    }
  }

  result.label = result.label || id
  return result
}

export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
