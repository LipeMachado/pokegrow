import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { pokemonService } from '../services/pokemonService';
import { ITEMS_PER_PAGE } from '../constants/pokemon';
import { PokemonContext, type PokemonContextType } from './PokemonContextTypes';
import type { PokemonDetails } from '../types/pokemon';

interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [pokemons, setPokemons] = useState<PokemonContextType['pokemons']>([]);
  const [allPokemons, setAllPokemons] = useState<PokemonContextType['allPokemons']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PokemonContextType['pagination']>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tema
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [imageCache] = useState(new Map<string, boolean>());

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('pokefy-theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else {
      // Definir tema padrão baseado na preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Aplicar tema ao documento
  useEffect(() => {
    localStorage.setItem('pokefy-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    loadPokemons(1);
  }, []);

  const loadPokemons = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      if (searchMode && searchTerm) {
        return;
      }

      const result = await pokemonService.getPokemonList(page, ITEMS_PER_PAGE);
      setPokemons(result.pokemons);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Erro ao carregar os Pokémons. Tente novamente.');
      console.error('Erro ao carregar Pokémons:', err);
    } finally {
      setLoading(false);
    }
  }, [searchMode, searchTerm]);

  const loadAllPokemonsForSearch = useCallback(async () => {
    if (allPokemons.length === 0) {
      try {
        setLoading(true);
        const allPokemonList = await pokemonService.getAllPokemonForSearch();
        setAllPokemons(allPokemonList);
      } catch (err) {
        console.error('Erro ao carregar todos os Pokémons para busca:', err);
      } finally {
        setLoading(false);
      }
    }
  }, [allPokemons.length]);

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);

    if (term.trim()) {
      setSearchMode(true);
      setCurrentPage(1);

      if (allPokemons.length === 0) {
        await loadAllPokemonsForSearch();
      }
    } else {
      setSearchMode(false);
      setCurrentPage(1);
      loadPokemons(1);
    }
  }, [allPokemons.length, loadAllPokemonsForSearch, loadPokemons]);

  const handleSort = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openModal = useCallback(async (pokemonId: number) => {
    try {
      setModalLoading(true);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';

      const details = await pokemonService.getPokemonDetails(pokemonId);
      setSelectedPokemon(details);
    } catch (err) {
      console.error('Erro ao carregar detalhes do Pokémon:', err);
    } finally {
      setModalLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
    document.body.style.overflow = 'unset';
  }, []);

  const setImageLoaded = useCallback((src: string) => {
    imageCache.set(src, true);
  }, [imageCache]);

  const isImageLoaded = useCallback((src: string) => {
    return imageCache.has(src);
  }, [imageCache]);

  // Função para tema
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const value: PokemonContextType = {
    pokemons,
    allPokemons,
    loading,
    error,
    pagination,
    currentPage,
    searchTerm,
    searchMode,
    sortOrder,

    selectedPokemon,
    modalLoading,
    isModalOpen,

    // Tema
    theme,

    loadPokemons,
    loadAllPokemonsForSearch,
    handleSearch,
    handleSort,
    handlePageChange,

    openModal,
    closeModal,

    // Função para tema
    toggleTheme,

    imageCache,
    setImageLoaded,
    isImageLoaded,
  };

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
} 