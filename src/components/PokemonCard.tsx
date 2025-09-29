import { motion } from 'framer-motion'
import { OptimizedImage } from './OptimizedImage'

interface PokemonCardProps {
  pokemon: {
    name: string
    sprites: Array<{
      sprites: string
    }>
    types: Array<{
      pokemon_v2_type: {
        name: string
      }
    }>
  }

  pokemonId: number
  index: number

  powerLevel: number
  onClick: () => void
}

const typeColors: { [key: string]: string } = {
  'normal': 'bg-gray-400',
  'fire': 'bg-red-500',
  'water': 'bg-blue-500',
  'electric': 'bg-yellow-400',
  'grass': 'bg-green-500',
  'ice': 'bg-cyan-300',
  'fighting': 'bg-red-700',
  'poison': 'bg-purple-500',
  'ground': 'bg-yellow-600',
  'flying': 'bg-indigo-400',
  'psychic': 'bg-pink-500',
  'bug': 'bg-green-600',
  'rock': 'bg-yellow-800',
  'ghost': 'bg-purple-700',
  'dragon': 'bg-indigo-700',
  'dark': 'bg-gray-800',
  'steel': 'bg-gray-500',
  'fairy': 'bg-pink-300'
}

export function PokemonCard({ pokemon, pokemonId, index, powerLevel, onClick }: PokemonCardProps) {

  const sprites = JSON.parse(pokemon.sprites[0]?.sprites || '{}')
  const imageUrl = sprites?.other?.['official-artwork']?.front_default ||
    sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="absolute top-4 right-4 text-xs font-mono text-white/70 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
          #{pokemonId.toString().padStart(3, '0')}
        </div>

        <div className="flex justify-center mb-4 mt-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <OptimizedImage
              src={imageUrl}
              alt={pokemon.name}
              className="relative z-10 w-24 h-24 object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

        <h3 className="text-white font-bold text-center mb-3 text-lg capitalize">
          {pokemon.name}
        </h3>

        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {pokemon.types.map((typeData) => (
            <span
              key={typeData.pokemon_v2_type.name}
              className={`px-3 py-1 text-xs rounded-full text-white font-medium shadow-lg border border-white/20 ${typeColors[typeData.pokemon_v2_type.name] || 'bg-gray-400'
                }`}
            >
              {typeData.pokemon_v2_type.name.charAt(0).toUpperCase() + typeData.pokemon_v2_type.name.slice(1)}
            </span>
          ))}
        </div>

        <div className="text-center">
          <span className="text-gray-400 text-xs font-medium">Nível de Força</span>
          <div className="text-yellow-400 font-bold text-xl">
            {powerLevel}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 