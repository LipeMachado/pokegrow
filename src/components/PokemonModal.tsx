import { X } from 'lucide-react';
import { usePokemon } from '../hooks/usePokemon';
import { OptimizedImage } from './OptimizedImage';

export function PokemonModal() {
  const {
    selectedPokemon,
    modalLoading,
    isModalOpen,
    closeModal
  } = usePokemon();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isModalOpen) return null;

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

  if (modalLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-900 border border-white/20 rounded-3xl p-8">
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-white">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPokemon) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-gray-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-scroll">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {selectedPokemon.name}
          </h2>
          <span className="text-gray-400 font-medium">
            #{selectedPokemon.id.toString().padStart(3, '0')}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-40 h-40">
            <OptimizedImage
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-full h-full"
              fallbackSrc="https://via.placeholder.com/160x160/374151/9CA3AF?text=?"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {selectedPokemon.types.map((type) => (
            <span
              key={type}
              className={`px-4 py-2 rounded-full text-white font-medium ${getTypeColor(type)}`}
            >
              {type}
            </span>
          ))}
        </div>

        <div className="text-center mb-6">
          <span className="text-gray-400 text-sm font-medium">Power Level</span>
          <div className="text-yellow-400 font-bold text-2xl">
            {selectedPokemon.powerLevel}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-bold text-lg mb-3">Abilities</h3>
          <div className="space-y-2">
            {selectedPokemon.abilities.map((ability, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/20 rounded-xl p-3"
              >
                <span className="text-white font-medium">{ability}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-3">Base Stats</h3>
          <div className="space-y-3">
            {Object.entries(selectedPokemon.stats).map(([statName, value]) => (
              <div key={statName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 capitalize">
                    {statName === 'hp' ? 'HP' :
                      statName === 'attack' ? 'Attack' :
                        statName === 'defense' ? 'Defense' :
                          statName === 'specialAttack' ? 'Sp. Atk' :
                            statName === 'specialDefense' ? 'Sp. Def' :
                              statName === 'speed' ? 'Speed' : statName}
                  </span>
                  <span className="text-white font-medium">{value}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((value / 255) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 