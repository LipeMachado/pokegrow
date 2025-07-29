import { useAtom } from "jotai";
import {
  searchTermAtom,
  selectedTypesAtom,
  sortOrderAtom,
  currentPageAtom,
  itemsPerPageAtom,
  selectedPokemonIdAtom,
  isModalOpenAtom,
  themeAtom,
  favoritePokemonsAtom,
  showOnlyFavoritesAtom,
} from "../store/pokemon-atoms";

export const usePokemonFilters = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [selectedTypes, setSelectedTypes] = useAtom(selectedTypesAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);
  const [showOnlyFavorites, setShowOnlyFavorites] = useAtom(
    showOnlyFavoritesAtom
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTypes("");
    setSortOrder("power-asc");
    setShowOnlyFavorites(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    sortOrder,
    setSortOrder,
    showOnlyFavorites,
    setShowOnlyFavorites,
    resetFilters,
  };
};

export const usePokemonPagination = () => {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [itemsPerPage, setItemsPerPage] = useAtom(itemsPerPageAtom);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
  };
};

export const usePokemonModal = () => {
  const [selectedPokemonId, setSelectedPokemonId] = useAtom(
    selectedPokemonIdAtom
  );
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);

  const openModal = (pokemonId: number) => {
    setSelectedPokemonId(pokemonId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemonId(null);
  };

  return {
    selectedPokemonId,
    isModalOpen,
    openModal,
    closeModal,
  };
};

export const usePokemonTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
};

export const usePokemonFavorites = () => {
  const [favorites, setFavorites] = useAtom(favoritePokemonsAtom);

  const isFavorite = (pokemonId: number) => {
    return favorites.includes(pokemonId);
  };

  const toggleFavorite = (pokemonId: number) => {
    setFavorites((prev) =>
      prev.includes(pokemonId)
        ? prev.filter((id) => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  const addFavorite = (pokemonId: number) => {
    if (!favorites.includes(pokemonId)) {
      setFavorites((prev) => [...prev, pokemonId]);
    }
  };

  const removeFavorite = (pokemonId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== pokemonId));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
};
