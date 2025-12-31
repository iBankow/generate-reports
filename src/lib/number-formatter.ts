/**
 * Formata um número conforme o tipo especificado
 * @param value - Valor a ser formatado
 * @param format - Tipo de formatação: 'simple', 'currency', 'document'
 * @returns Número formatado
 */
export function formatNumber(value: string | number, format: string = 'simple'): string {
  const numValue = String(value).replace(/\D/g, '')

  switch (format) {
    case 'currency':
      return formatCurrency(numValue)
    case 'document':
      return formatDocument(numValue)
    case 'simple':
    default:
      return numValue
  }
}

/**
 * Formata como moeda brasileira (R$ 1.234,56)
 */
function formatCurrency(value: string): string {
  if (!value) return ''

  // Remove zeros à esquerda
  const numValue = parseInt(value, 10)

  // Converte para centavos e formata
  const cents = numValue % 100
  const reais = Math.floor(numValue / 100)

  const formatted = reais.toLocaleString('pt-BR') + ',' + cents.toString().padStart(2, '0')
  return `R$ ${formatted}`
}

/**
 * Formata como documento (CPF: 123.456.789-00 ou CNPJ: 12.345.678/0001-99)
 */
function formatDocument(value: string): string {
  if (!value) return ''

  // Remove tudo que não é número
  const numValue = value.replace(/\D/g, '')

  // CPF: 11 dígitos
  if (numValue.length <= 11) {
    return numValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  // CNPJ: 14 dígitos
  if (numValue.length <= 14) {
    return numValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return numValue
}

/**
 * Remove formatação de um número
 * @param value - Valor formatado
 * @returns Número sem formatação
 */
export function unformatNumber(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Valida um CPF/CNPJ
 */
export function isValidDocument(value: string): boolean {
  const numValue = value.replace(/\D/g, '')

  if (numValue.length === 11) {
    return isValidCPF(numValue)
  }

  if (numValue.length === 14) {
    return isValidCNPJ(numValue)
  }

  return false
}

function isValidCPF(cpf: string): boolean {
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  let remainder

  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(9, 10), 10)) return false

  sum = 0
  // Segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cpf.substring(10, 11), 10)) return false

  return true
}

function isValidCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (String(result) !== digits.charAt(0)) return false

  size = size + 1
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (String(result) !== digits.charAt(1)) return false

  return true
}
