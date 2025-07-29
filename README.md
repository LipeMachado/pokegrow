# 🎯 Pokéfy - Pokédex Interativa

Uma aplicação moderna e interativa de Pokédex construída com React, TypeScript e Tailwind CSS. Demonstra habilidades de desenvolvimento front-end com funcionalidades essenciais.

## ✨ Funcionalidades Principais

### 🎮 **Funcionalidades Básicas**

- 📱 **Lista de Pokémon**: Visualização paginada dos 151 primeiros Pokémon
- 🔍 **Busca Inteligente**: Busca por nome ou tipo de Pokémon
- 📊 **Ordenação**: Ordenação por força (crescente/decrescente)
- 🖼️ **Imagens Otimizadas**: Carregamento lazy e fallback para imagens
- 📱 **Design Responsivo**: Funciona perfeitamente em todos os dispositivos
- 🎨 **Tema Claro/Escuro**: Alternância entre temas com persistência

### 🎯 **Header Inteligente**

- 📱 **Sticky Header**: Sempre visível durante scroll
- 🎛️ **Controles Centralizados**: Botão de alternância de tema
- 🎨 **Backdrop Blur**: Efeito visual moderno

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- ⚛️ **React 19**: Framework principal com hooks modernos
- 🔷 **TypeScript**: Tipagem estática e melhor DX
- 🎨 **Tailwind CSS**: Framework CSS utility-first
- 🎯 **Lucide React**: Ícones modernos e consistentes

### **Gerenciamento de Estado**

- 🔄 **Context API**: Estado global bem estruturado
- 💾 **LocalStorage**: Persistência de preferências do usuário
- ⚡ **useMemo/useCallback**: Otimizações de performance

### **APIs e Serviços**

- 🌐 **PokeAPI**: Dados oficiais dos Pokémon
- 📡 **Axios**: Cliente HTTP para requisições
- 🖼️ **GitHub Raw**: Imagens oficiais dos Pokémon

## 🚀 Como Executar

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pokefy.git
cd pokefy

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.tsx      # Header com controles
│   ├── PokemonList.tsx # Lista principal
│   ├── PokemonModal.tsx # Modal de detalhes
│   └── Pagination.tsx  # Componente de paginação
├── contexts/           # Context API
│   ├── PokemonContext.tsx # Contexto principal
│   └── PokemonContextTypes.ts # Tipos do contexto
├── hooks/              # Custom hooks
│   └── usePokemon.ts   # Hook principal
├── services/           # Serviços e APIs
│   └── pokemonService.ts # Serviço da PokeAPI
├── types/              # Definições de tipos
│   └── pokemon.ts      # Tipos dos Pokémon
└── constants/          # Constantes
    └── pokemon.ts      # Constantes do projeto
```

## 🎯 Pontos de Destaque para Entrevista

### **Arquitetura e Design Patterns**

- ✅ **Componentização**: Código modular e reutilizável
- ✅ **Separation of Concerns**: Separação clara de responsabilidades
- ✅ **TypeScript**: Tipagem forte e bem estruturada
- ✅ **Context API**: Gerenciamento de estado global eficiente

### **Performance e Otimização**

- ✅ **Lazy Loading**: Carregamento otimizado de imagens
- ✅ **Memoização**: useMemo e useCallback para performance
- ✅ **Debouncing**: Busca otimizada
- ✅ **Code Splitting**: Carregamento sob demanda

### **UX/UI e Acessibilidade**

- ✅ **Design Responsivo**: Funciona em todos os dispositivos
- ✅ **Animações Suaves**: Transições e micro-interações
- ✅ **Feedback Visual**: Estados de loading e erro
- ✅ **Keyboard Navigation**: Navegação por teclado

### **Funcionalidades Avançadas**

- ✅ **Persistência Local**: Preferências salvas no navegador
- ✅ **Tema Dinâmico**: Claro/escuro com detecção automática

### **Qualidade de Código**

- ✅ **Error Handling**: Tratamento robusto de erros
- ✅ **Type Safety**: TypeScript em todo o projeto
- ✅ **Clean Code**: Código limpo e bem documentado
- ✅ **Testing Ready**: Estrutura preparada para testes

## 🎨 Screenshots

_Adicione screenshots da aplicação aqui_

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
