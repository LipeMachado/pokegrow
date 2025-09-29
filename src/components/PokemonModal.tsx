import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Zap, Shield, Sword, AlertTriangle } from 'lucide-react'
import { usePokemonModal, usePokemonFavorites } from '../hooks/usePokemonAtoms'
import { usePokemonDetails } from '../hooks/usePokemonQuery'
import { OptimizedImage } from './OptimizedImage'
import { CircularProgress } from './CircularProgress'

const typeColors: { [key: string]: string } = {
  normal: 'from-gray-400 to-gray-600',
  fire: 'from-red-500 to-orange-600',
  water: 'from-blue-500 to-cyan-600',
  electric: 'from-yellow-400 to-yellow-600',
  grass: 'from-green-500 to-emerald-600',
  ice: 'from-cyan-300 to-blue-400',
  fighting: 'from-red-700 to-red-900',
  poison: 'from-purple-500 to-purple-700',
  ground: 'from-yellow-600 to-amber-700',
  flying: 'from-indigo-400 to-blue-500',
  psychic: 'from-pink-500 to-purple-600',
  bug: 'from-green-600 to-lime-700',
  rock: 'from-yellow-800 to-amber-900',
  ghost: 'from-purple-700 to-indigo-800',
  dragon: 'from-indigo-700 to-purple-800',
  dark: 'from-gray-800 to-black',
  steel: 'from-gray-500 to-slate-600',
  fairy: 'from-pink-300 to-rose-400',
  unknown: 'from-gray-600 to-gray-800',
}

export function PokemonModal() {
  const { selectedPokemonId, isModalOpen, closeModal } = usePokemonModal()
  const { isFavorite, toggleFavorite } = usePokemonFavorites()

  const { data: pokemonDetails, isLoading, error } = usePokemonDetails(selectedPokemonId?.toString() || '')

  if (!isModalOpen || !selectedPokemonId) return null

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando detalhes...</p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (error || !pokemonDetails) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">Pokémon não encontrado</p>
            <p className="text-gray-400 text-sm mb-6">Este Pokémon pode não estar disponível na API</p>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const primaryType = pokemonDetails.types[0]?.type?.name || 'unknown'
  const gradientClass = typeColors[primaryType] || typeColors.unknown
  const isUnknownPokemon = primaryType === 'unknown'

  const stats = [
    { name: 'HP', value: pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'hp')?.base_stat || 0, max: 255, color: 'text-red-400', icon: Heart },
    { name: 'Ataque', value: pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'attack')?.base_stat || 0, max: 190, color: 'text-orange-400', icon: Sword },
    { name: 'Defesa', value: pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'defense')?.base_stat || 0, max: 230, color: 'text-blue-400', icon: Shield },
    { name: 'Velocidade', value: pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'speed')?.base_stat || 0, max: 180, color: 'text-yellow-400', icon: Zap },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
        >
          <div className={`h-32 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20" />

            {isUnknownPokemon && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Pokémon Especial
                </div>
              </div>
            )}

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={() => toggleFavorite(selectedPokemonId)}
                className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors duration-150"
              >
                <Heart className={`h-6 w-6 ${isFavorite(selectedPokemonId) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={closeModal}
                className="p-3 bg-black/30 hover:bg-black/50 rounded-full transition-colors duration-150"
              >
                <X className="h-6 w-6 text-white" />
              </motion.button>
            </div>

            <div className="absolute top-4 left-6 z-10">
              <span className="text-white/80 text-sm font-medium">#{selectedPokemonId.toString().padStart(3, '0')}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <OptimizedImage
                      src={pokemonDetails.sprites.other?.['official-artwork']?.front_default ||
                        pokemonDetails.sprites.front_default ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemonId}.png`}
                      alt={pokemonDetails.name}
                      className="w-36 h-36 sm:w-48 sm:h-48 object-contain mx-auto"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-white capitalize mb-2">
                    {pokemonDetails.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {pokemonDetails.types.map((typeData: { type: { name: string } }) => (
                      <span
                        key={typeData.type.name}
                        className={`px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${typeColors[typeData.type.name] || typeColors.unknown} ${typeData.type.name === 'unknown' ? 'opacity-80' : ''}`}
                      >
                        {typeData.type.name === 'unknown' ? 'Especial' : typeData.type.name.charAt(0).toUpperCase() + typeData.type.name.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Altura</p>
                    <p className="text-white text-xl font-bold">{(pokemonDetails.height / 10).toFixed(1)}m</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Peso</p>
                    <p className="text-white text-xl font-bold">{(pokemonDetails.weight / 10).toFixed(1)}kg</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Experiência</p>
                    <p className="text-white text-xl font-bold">{pokemonDetails.base_experience || 'N/A'}</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">Nível de Força</p>
                    <p className="text-yellow-300 text-xl font-bold">
                      {(() => {
                        const hp = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'hp')?.base_stat || 0;
                        const attack = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'attack')?.base_stat || 0;
                        const defense = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'defense')?.base_stat || 0;
                        const specialAttack = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'special-attack')?.base_stat || 0;
                        const specialDefense = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'special-defense')?.base_stat || 0;
                        const speed = pokemonDetails.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === 'speed')?.base_stat || 0;

                        return Math.floor(
                          (hp * 0.15) +
                          (attack * 0.2) +
                          (defense * 0.15) +
                          (specialAttack * 0.2) +
                          (specialDefense * 0.15) +
                          (speed * 0.15)
                        );
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => {
                      const IconComponent = stat.icon
                      return (
                        <div key={stat.name} className="flex flex-col items-center">
                          <CircularProgress
                            value={stat.value}
                            max={stat.max}
                            size={60}
                            strokeWidth={4}
                            className="sm:w-20 sm:h-20"
                          />
                          <div className="mt-2 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <IconComponent className={`h-4 w-4 ${stat.color}`} />
                              <span className="text-white font-medium text-sm">{stat.name}</span>
                            </div>
                            <span className="text-gray-400 text-sm">{stat.value}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Habilidades</h3>
                  <div className="space-y-2">
                    {pokemonDetails.abilities.map((abilityData: { ability: { name: string }, is_hidden: boolean }) => (
                      <div
                        key={abilityData.ability.name}
                        className="bg-white/5 rounded-xl p-3 flex items-center justify-between"
                      >
                        <span className="text-white font-medium capitalize">
                          {abilityData.ability.name === 'unknown' ? 'Habilidade Especial' : abilityData.ability.name.replace('-', ' ')}
                        </span>
                        {abilityData.is_hidden && (
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                            Oculta
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {isUnknownPokemon && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <p className="text-yellow-300 text-sm">
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                        Este é um Pokémon especial ou forma alternativa que pode não ter todos os dados disponíveis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 