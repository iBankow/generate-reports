import type { FormSubmission } from '@/types/form'

/**
 * Exporta dados de envio para JSON
 */
export function exportToJSON(submission: FormSubmission): string {
  return JSON.stringify(submission, null, 2)
}

/**
 * Exporta dados de envio para CSV (apenas campos de texto e número)
 */
export function exportToCSV(submission: FormSubmission): string {
  const flatData = flattenData(submission.data)
  const headers = Object.keys(flatData)
  const values = Object.values(flatData)

  const csv = [
    headers.join(','),
    values.map((v) => escapeCSV(String(v))).join(','),
  ].join('\n')

  return csv
}

/**
 * Baixa arquivo de dados
 */
export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Flatena objetos aninhados para CSV
 */
function flattenData(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}_${key}` : key

    if (Array.isArray(value)) {
      result[newKey] = value.length
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(result, flattenData(item as Record<string, unknown>, `${newKey}[${index}]`))
        } else {
          result[`${newKey}[${index}]`] = item
        }
      })
    } else if (typeof value === 'object' && value !== null && !isBase64(String(value))) {
      Object.assign(result, flattenData(value as Record<string, unknown>, newKey))
    } else if (typeof value === 'string' && isBase64(value)) {
      result[newKey] = '[Binary Image Data]'
    } else {
      result[newKey] = value
    }
  }

  return result
}

/**
 * Verifica se string é base64 (imagem)
 */
function isBase64(str: string): boolean {
  return str.startsWith('data:image/')
}

/**
 * Escapa valores para CSV
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Copia dados para clipboard
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

/**
 * Gera ID único
 */
export function generateUniqueId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Formata data para locale brasileiro
 */
export function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
