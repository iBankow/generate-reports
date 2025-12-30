// Conversão HTML → Markdown (trocar nodes por {{name:type}})
export function htmlToMarkdown(html: string): string {
  // Converter placeholder-field tags para placeholders de markdown
  return html.replace(
    /<placeholder-field[^>]*data-name="([^"]*)"[^>]*data-type="([^"]*)"[^>]*><\/placeholder-field>/g,
    '{{$1:$2}}'
  ).replace(
    /<placeholder-field[^>]*data-type="([^"]*)"[^>]*data-name="([^"]*)"[^>]*><\/placeholder-field>/g,
    '{{$2:$1}}'
  )
}

// Conversão Markdown → HTML (trocar tokens por <placeholder-field>)
export function markdownToHtml(markdown: string): string {
  // Converter placeholders para placeholder-field tags
  return markdown.replace(
    /\{\{([^:]+):([^}]+)\}\}/g,
    '<placeholder-field data-name="$1" data-type="$2"></placeholder-field>'
  )
}

// Extrair todos os placeholders do markdown
export function extractPlaceholders(markdown: string): Array<{ name: string; type: string }> {
  const regex = /\{\{([^:]+):([^}]+)\}\}/g
  const placeholders: Array<{ name: string; type: string }> = []
  let match

  while ((match = regex.exec(markdown)) !== null) {
    const [, name, type] = match
    // Evitar duplicatas
    if (!placeholders.find(p => p.name === name && p.type === type)) {
      placeholders.push({ name: name.trim(), type: type.trim() })
    }
  }

  return placeholders
}

// Hook para extrair campos do template
export function useTemplateFields(markdown: string) {
  return extractPlaceholders(markdown)
}