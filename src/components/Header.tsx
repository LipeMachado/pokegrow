import { usePokemon } from '../hooks/usePokemon';
import { Sun, Moon } from 'lucide-react';

export function Header() {
  const {
    theme,
    toggleTheme
  } = usePokemon();

  return (
    <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Pokédex
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tema */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 