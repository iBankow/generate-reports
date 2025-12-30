export type FieldType = 'text' | 'number' | 'image' | 'imageList' | 'list'

export interface FormField {
  id: string
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
}

export interface FormTemplate {
  id: string
  title: string
  description: string
  markdown: string
  fields: Array<FormField>
  createdAt: Date
  updatedAt: Date
}

export interface FormSubmission {
  templateId: string
  submissionId: string
  data: Record<string, any>
  submittedAt: Date
}

export interface ImageListItem {
  url: string
  description: string
}
