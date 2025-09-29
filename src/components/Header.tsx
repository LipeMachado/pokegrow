import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { usePokemonFavorites, usePokemonFilters } from '../hooks/usePokemonAtoms'

export function Header() {
  const { favorites } = usePokemonFavorites()
  const { showOnlyFavorites, setShowOnlyFavorites } = usePokemonFilters()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto py-3 px-8 xl:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-white font-bold text-3xl">
                Pokegrow
              </span>
            </motion.div>
          </div>

          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`relative p-3 rounded-xl border border-white/20 transition-colors duration-200 ${showOnlyFavorites
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white/10 hover:bg-white/20'
                }`}
            >
              <Heart className={`h-5 w-5 ${showOnlyFavorites ? 'text-white fill-current' : 'text-red-400'}`} />
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                >
                  {favorites.length}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
