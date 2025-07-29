import { useEffect, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { usePokemon } from '../hooks/usePokemon';
import { OptimizedImage } from './OptimizedImage';
import { Pagination } from './Pagination';
import { ITEMS_PER_PAGE } from '../constants/pokemon';

const sortOptions = [
  { label: 'Força: Menor → Maior', value: 'asc' },
  { label: 'Força: Maior → Menor', value: 'desc' }
] as const;

export function PokemonList() {
  const {
    pokemons,
    allPokemons,
    loading,
    error,
    pagination,
    currentPage,
    searchTerm,
    searchMode,
    sortOrder,
    loadPokemons,
    handleSearch,
    handleSort,
    handlePageChange,
    openModal
  } = usePokemon();

  useEffect(() => {
    loadPokemons(currentPage);
  }, [currentPage, loadPokemons]);

  const filteredAndSortedPokemons = useMemo(() => {
    const pokemonList = searchMode ? allPokemons : pokemons;

    const filtered = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sorted = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.powerLevel - b.powerLevel;
      }
      return b.powerLevel - a.powerLevel;
    });

    return sorted;
  }, [pokemons, allPokemons, searchTerm, sortOrder, searchMode]);

  const filteredPagination = useMemo(() => {
    if (!searchMode) {
      return pagination;
    }

    const totalItems = filteredAndSortedPokemons.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      hasNextPage: endIndex < totalItems,
      hasPreviousPage: currentPage > 1
    };
  }, [filteredAndSortedPokemons, currentPage, searchMode, pagination]);

  const currentPagePokemons = useMemo(() => {
    if (!searchMode) {
      return filteredAndSortedPokemons;
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPokemons.slice(startIndex, endIndex);
  }, [filteredAndSortedPokemons, currentPage, searchMode]);

  const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      'Normal': 'bg-gray-400',
      'Fire': 'bg-red-500',
      'Water': 'bg-blue-500',
      'Electric': 'bg-yellow-400',
      'Grass': 'bg-green-500',
      'Ice': 'bg-cyan-300',
      'Fighting': 'bg-red-700',
      'Poison': 'bg-purple-500',
      'Ground': 'bg-yellow-600',
      'Flying': 'bg-indigo-400',
      'Psychic': 'bg-pink-500',
      'Bug': 'bg-green-600',
      'Rock': 'bg-yellow-800',
      'Ghost': 'bg-purple-700',
      'Dragon': 'bg-indigo-700',
      'Dark': 'bg-gray-800',
      'Steel': 'bg-gray-500',
      'Fairy': 'bg-pink-300'
    };
    return typeColors[type] || 'bg-gray-400';
  };

  if (loading && !searchMode) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-4 text-gray-400">Carregando Pokémons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button
          onClick={() => loadPokemons(1)}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Pokédex
        </h1>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all relative z-0"
          />
        </div>

        <div className="flex justify-center gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSort(option.value)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${sortOrder === option.value
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                }`}
            >
              {option.value === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm">
          {filteredAndSortedPokemons.length} Pokémon{filteredAndSortedPokemons.length !== 1 ? 's' : ''} encontrado{filteredAndSortedPokemons.length !== 1 ? 's' : ''}
          {searchMode && (
            <span className="block text-blue-400 mt-1">
              Busca em todos os 151 Pokémons
            </span>
          )}
        </p>
      </div>

      {loading && searchMode && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Carregando resultados...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentPagePokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => {
              openModal(pokemon.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer"
          >
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4 transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="absolute top-3 right-3 text-xs font-bold text-white/60">
                #{pokemon.id.toString().padStart(3, '0')}
              </div>

              <div className="flex justify-center mb-3">
                <OptimizedImage
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-14 h-14"
                />
              </div>

              <h3 className="text-white font-bold text-center mb-2 text-base">
                {pokemon.name}
              </h3>

              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className={`px-2 py-1 text-xs rounded-full text-white font-medium ${getTypeColor(type)} shadow-sm`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium">Power</span>
                <div className="text-yellow-400 font-bold text-lg">
                  {pokemon.powerLevel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPagination && filteredPagination.totalPages > 1 && (
        <Pagination
          pagination={filteredPagination}
          onPageChange={handlePageChange}
        />
      )}

      {filteredAndSortedPokemons.length === 0 && searchTerm && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Nenhum Pokémon encontrado para "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
} 