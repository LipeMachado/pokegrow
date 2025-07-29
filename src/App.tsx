import { PokemonProvider } from './contexts/PokemonContext';
import { Header } from './components/Header';
import { PokemonList } from './components/PokemonList';
import { PokemonModal } from './components/PokemonModal';

function App() {
  return (
    <PokemonProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-x-hidden">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <PokemonList />
          <PokemonModal />
        </div>
      </div>
    </PokemonProvider>
  );
}

export default App;
