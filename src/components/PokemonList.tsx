import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import { usePokemonList, usePokemonTypes, useFavoritePokemonDetails } from '../hooks/usePokemonQuery'
import { usePokemonFilters, usePokemonPagination, usePokemonModal, usePokemonFavorites } from '../hooks/usePokemonAtoms'
import { Pagination } from './Pagination'
import { PokemonCard } from './PokemonCard'

interface Pokemon {
  id: number
  name: string
  sprites: Array<{ sprites: string }>
  types: Array<{ pokemon_v2_type: { name: string } }>
  powerLevel: number
}

const sortOptions = [
  { label: 'Força: Maior → Menor', value: 'power-desc' },
  { label: 'Força: Menor → Maior', value: 'power-asc' },
  { label: 'Nome A-Z', value: 'name-asc' },
  { label: 'Nome Z-A', value: 'name-desc' }
]

export function PokemonList() {
  const { data: pokemonData, isLoading, error, refetch } = usePokemonList()
  const { data: typesData } = usePokemonTypes()
  const {
    searchTerm, setSearchTerm,
    selectedTypes, setSelectedTypes,
    sortOrder, setSortOrder,
    showOnlyFavorites,
    resetFilters
  } = usePokemonFilters()
  const { currentPage, setCurrentPage } = usePokemonPagination()
  const { openModal } = usePokemonModal()
  const { favorites } = usePokemonFavorites()

  const { data: favoritePokemons, isLoading: favoritesLoading } = useFavoritePokemonDetails(favorites)

  const pokemons = pokemonData?.pokemons || []
  const totalCount = pokemonData?.pokemon_aggregate.aggregate.count || 0
  const types = typesData?.pokemon_v2_type || []

  const filteredPokemons = showOnlyFavorites
    ? (favoritePokemons || [])
    : pokemons

  useEffect(() => {
    if (!showOnlyFavorites) {
      setCurrentPage(1)
    }
  }, [searchTerm, selectedTypes, sortOrder, showOnlyFavorites, setCurrentPage])

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-400 text-lg mb-4">Erro ao carregar os Pokémons</p>
        <p className="text-gray-400 text-sm mb-4">{error?.message || 'Erro desconhecido'}</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center flex flex-col items-center justify-center"
      >
        <div>
          <img src="/logo.png" alt="Pokefy" className="w-52 h-32 object-contain" />
        </div>
        <p className="text-2xl md:text-3xl text-gray-400 max-w-2xl mx-auto font-semibold">
          Gotta Catch 'Em All
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 w-full lg:min-w-[200px]">
            <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2.5 lg:py-3 text-sm lg:text-base bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={showOnlyFavorites}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedTypes}
                onChange={(e) => setSelectedTypes(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 lg:py-3 text-sm lg:text-base bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg lg:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none lg:min-w-[150px]"
                disabled={showOnlyFavorites}
              >
                <option value="">Todos os tipos</option>
                {types.map((type: { name: string }) => (
                  <option key={type.name} value={type.name} className="bg-gray-900">
                    {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'name-asc' | 'name-desc' | 'power-asc' | 'power-desc' | '')}
              className="w-full sm:flex-1 lg:w-auto px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg lg:rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none lg:min-w-[150px]"
            >
              <option value="">Força: Menor → Maior</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base bg-gray-600 hover:bg-gray-700 text-white rounded-lg lg:rounded-xl transition-colors duration-200 sm:min-w-[80px]"
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {(isLoading || (showOnlyFavorites && favoritesLoading)) ? 'Carregando...' : `${filteredPokemons.length} Pokémon${filteredPokemons.length !== 1 ? 's' : ''} ${showOnlyFavorites ? 'favorito' : 'encontrado'}${filteredPokemons.length !== 1 ? 's' : ''}`}
        </div>
      </motion.div>

      {(isLoading || (showOnlyFavorites && favoritesLoading)) && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-400">Carregando Pokémons...</span>
        </div>
      )}

      {!isLoading && !showOnlyFavorites && totalCount > 20 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <Pagination
            pagination={{
              currentPage,
              totalPages: Math.ceil(totalCount / 20),
              totalItems: totalCount,
              itemsPerPage: 20,
              hasNextPage: currentPage < Math.ceil(totalCount / 20),
              hasPreviousPage: currentPage > 1,
            }}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}

      {!isLoading && !favoritesLoading && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {filteredPokemons.map((pokemon: Pokemon, index: number) => {
            const pokemonId = pokemon.id

            return (
              <PokemonCard
                key={`${pokemon.id}-${pokemon.name}`}
                pokemon={pokemon}
                pokemonId={pokemonId}
                index={index}
                powerLevel={pokemon.powerLevel || 0}
                onClick={() => {
                  openModal(pokemonId);
                }}
              />
            )
          })}
        </motion.div>
      )}

      {!isLoading && !favoritesLoading && filteredPokemons.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">
            {showOnlyFavorites ? '💔' : '🔍'}
          </div>
          <p className="text-gray-400 text-lg">
            {showOnlyFavorites
              ? 'Nenhum Pokémon favorito encontrado'
              : 'Nenhum Pokémon encontrado'
            }
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
          >
            {showOnlyFavorites ? 'Ver Todos' : 'Mostrar Todos'}
          </button>
        </motion.div>
      )}

      {!isLoading && !showOnlyFavorites && totalCount > 20 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mt-8"
        >
          <Pagination
            pagination={{
              currentPage,
              totalPages: Math.ceil(totalCount / 20),
              totalItems: totalCount,
              itemsPerPage: 20,
              hasNextPage: currentPage < Math.ceil(totalCount / 20),
              hasPreviousPage: currentPage > 1,
            }}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      )}


    </div>
  )
} 