# Generate Reports - Sistema de Templates de Relatórios

Uma aplicação completa para criação e preenchimento de templates de relatórios técnicos usando placeholders dinâmicos.

## 🚀 Stack Tecnológica

- **React 19** + **TypeScript**
- **Vite** para build e desenvolvimento
- **Tailwind CSS v4** para estilização
- **shadcn/ui** para componentes
- **TanStack Router** para roteamento
- **TipTap** como editor rich text
- **Zustand** para gerenciamento de estado
- **Lucide Icons** para ícones

## ✨ Funcionalidades

### 📝 Editor de Templates (modo criação)
- Editor TipTap com barra de ferramentas completa
- Node customizado `placeholder` para campos dinâmicos
- Modal para adicionar campos com tipos específicos
- Conversão automática HTML → Markdown
- Sistema de salvamento local (localStorage)

### 📋 Preenchimento de Templates (modo uso)
- Carregamento dinâmico de templates salvos
- Parse automático de placeholders `{{nome:tipo}}`
- Geração de formulários dinâmicos baseados nos tipos:
  - **texto**: input text
  - **numero**: input number  
  - **data**: input date
  - **imagem**: upload de arquivo com preview
  - **lista_imagens**: lista dinâmica de imagens + descrições
  - **lista**: lista dinâmica de strings
- Preview em tempo real
- Download do relatório preenchido em Markdown

### 🎨 Interface e UX
- Design minimalista e responsivo
- Navegação intuitiva com sidebar
- Componentes shadcn/ui com tema consistente
- Layout adaptável para desktop e mobile

## 🏗️ Arquitetura

```
src/
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── AddFieldDialog.tsx      # Modal para adicionar campos
│   ├── DynamicField.tsx        # Campos dinâmicos do formulário
│   └── TipTapEditor.tsx        # Editor rich text
├── lib/
│   ├── placeholder/
│   │   ├── node.ts            # TipTap placeholder node
│   │   ├── parse.ts           # Conversores MD/HTML
│   │   └── PlaceholderFieldComponent.tsx
│   └── utils.ts               # Utilitários Tailwind
├── routes/
│   └── templates/
│       ├── editor.tsx         # Página do editor
│       ├── fill.tsx          # Página de preenchimento
│       └── index.tsx         # Lista de templates
├── store/
│   └── templateStore.ts       # Store Zustand
├── router.tsx                 # Configuração do router
└── main.tsx                   # Entry point
```

## 🚦 Como usar

### Desenvolvimento

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Criando Templates

1. Acesse `/templates/editor`
2. Digite o nome do template
3. Escreva o conteúdo usando o editor TipTap
4. Clique em "Adicionar Campo" para inserir placeholders dinâmicos
5. Selecione nome e tipo do campo
6. Salve o template

### Preenchendo Templates

1. Acesse `/templates`
2. Clique em "Preencher" no template desejado
3. Preencha os campos do formulário gerado
4. Use "Preview" para ver o resultado
5. Baixe o arquivo Markdown final

## 🔧 Tipos de Campo Suportados

| Tipo | Descrição | Input Gerado |
|------|-----------|--------------|
| `texto` | Texto simples | `<input type="text">` |
| `numero` | Números | `<input type="number">` |
| `data` | Datas | `<input type="date">` |
| `imagem` | Upload de imagem | File input + preview |
| `lista_imagens` | Lista de imagens | Repeatable group |
| `lista` | Lista de strings | Dynamic string list |

## 📄 Formato de Placeholders

Os placeholders seguem o formato: `{{nome:tipo}}`

Exemplos:
- `{{cliente_nome:texto}}`
- `{{data_inspecao:data}}`
- `{{fotos_equipamento:lista_imagens}}`
- `{{itens_verificados:lista}}`

## 💾 Armazenamento

- Templates são salvos no **localStorage** do navegador
- Estrutura JSON com metadados (nome, data criação, etc.)
- Conteúdo armazenado em formato Markdown
- System de conversão bidirecional HTML ↔ Markdown

## 🎯 Template de Exemplo

O projeto inclui um template de exemplo em `public/template-exemplo.md` demonstrando todos os tipos de campo disponíveis.

## 🌐 URLs da Aplicação

- `/` - Home page
- `/templates` - Lista de templates
- `/templates/editor` - Editor de templates
- `/templates/:id/preencher` - Preenchimento de template

## 🛠️ Desenvolvimento

### Adicionando Novos Tipos de Campo

1. Atualize o array `fieldTypes` em `AddFieldDialog.tsx`
2. Implemente o caso no switch de `DynamicField.tsx`
3. Atualize a lógica de preview em `TemplateFillPage.tsx`

### Personalizando o Editor

O TipTap pode ser estendido com mais funcionalidades:
- Novos nodes personalizados
- Extensões de formatação
- Plugins de colaboração
- Auto-save

## 📦 Entregáveis

✅ **package.json** configurado com todas as dependências  
✅ **Setup completo do Tailwind CSS v4** com configuração personalizada  
✅ **Setup shadcn/ui** com componentes essenciais  
✅ **Setup TanStack Router** com roteamento funcional  
✅ **TipTap funcionando** com placeholder node customizado  
✅ **Página completa de editor** de templates  
✅ **Página de preenchimento dinâmica** com formulários automáticos  
✅ **Armazenamento local** de templates em JSON  
✅ **Scripts de build e dev** funcionando perfeitamente  

## 🚀 Deploy

Para fazer deploy da aplicação:

```bash
# Build
npm run build

# Os arquivos estáticos estarão em ./dist
# Faça upload para seu provedor de hosting
```

A aplicação é uma SPA (Single Page Application) e pode ser hospedada em qualquer servidor que sirva arquivos estáticos (Vercel, Netlify, AWS S3, etc.).