# Pokéfy - Sistema de Listagem de Pokémons

Uma aplicação moderna de Pokédex construída com React, TypeScript e Tailwind CSS, desenvolvida como teste técnico para demonstrar habilidades de desenvolvimento frontend.

## Funcionalidades Implementadas

### **Requisitos Atendidos**

- **✅ Listagem de Pokémons**: Exibe lista paginada com nome, imagem e nível de força
- **✅ Ordenação**: Funcionalidade para ordenar por nível de força (ascendente/descendente)
- **✅ Modal de Detalhes**: Ao clicar, exibe nome, imagem, tipos, nível de força e habilidades
- **✅ Interface Responsiva**: Funciona perfeitamente em desktop e mobile

### **Funcionalidades Extras**

- **Busca por Nome**: Localização rápida de Pokémons
- **Filtros por Tipo**: Filtrar por qualquer tipo de Pokémon
- **Sistema de Favoritos**: Marcar Pokémons como favoritos
- **Design Moderno**: Interface glassmorphism com animações suaves
- **GraphQL + REST**: API GraphQL com fallback para REST
- **Imagens Otimizadas**: Carregamento lazy e fallback automático

### **Tecnologias Utilizadas**

- **React 19**: Framework principal com hooks modernos
- **Jotai**: Gerenciamento de estado atômico
- **React Query**: Cache e sincronização de dados
- **Framer Motion**: Animações fluidas e interativas
- **Lucide React**: Ícones modernos e consistentes

## Como Executar Localmente

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn

### **Instruções de Instalação**

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd pokefy

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## Funcionalidades Detalhadas

### **1. Listagem Principal**

- Exibe até 20 Pokémons por página
- Cards com nome, imagem e nível de força calculado
- Paginação funcional
- Grid responsivo (1-6 colunas conforme dispositivo)

### **2. Sistema de Ordenação**

- **Força Crescente** (padrão)
- **Força Decrescente**
- **Nome A-Z**
- **Nome Z-A**

### **3. Modal de Detalhes**

Exibe todas as informações solicitadas:

- Nome do Pokémon
- Imagem em alta qualidade
- Tipos com cores características
- **Nível de força calculado**
- **Lista completa de habilidades**
- Estatísticas individuais (HP, Ataque, Defesa, Velocidade)
- Informações físicas (altura, peso, experiência)

### **4. Busca e Filtros**

- Busca por nome em tempo real
- Filtro por tipos de Pokémon
- Visualização apenas de favoritos

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Cabeçalho com controles
│   ├── PokemonList.tsx # Lista principal
│   ├── PokemonCard.tsx # Card individual
│   ├── PokemonModal.tsx # Modal de detalhes
│   ├── Pagination.tsx  # Paginação
│   └── ...
├── hooks/              # Custom hooks
│   ├── usePokemonQuery.ts    # React Query hooks
│   └── usePokemonAtoms.ts    # Jotai state hooks
├── services/           # Camada de serviços
│   ├── graphqlPokemonService.ts # GraphQL API
│   └── pokemonService.ts        # REST API fallback
├── store/              # Gerenciamento de estado
│   └── pokemon-atoms.ts # Átomos Jotai
└── types/              # Definições TypeScript
    └── pokemon.ts      # Tipos dos dados
```

## APIs Utilizadas

- **PokeAPI GraphQL**: `https://pokeapi.co/docs/graphql` (Principal)
- **PokeAPI REST**: `https://pokeapi.co/api/v2` (Fallback)
- **Sprites GitHub**: `https://raw.githubusercontent.com/PokeAPI/sprites/master/`
