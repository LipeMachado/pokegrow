import { createContext } from "react";
import type {
  PokemonListItem,
  PaginationInfo,
  PokemonDetails,
} from "../types/pokemon";

export interface PokemonContextType {
  pokemons: PokemonListItem[];
  allPokemons: PokemonListItem[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  currentPage: number;
  searchTerm: string;
  searchMode: boolean;
  sortOrder: "asc" | "desc";

  selectedPokemon: PokemonDetails | null;
  modalLoading: boolean;
  isModalOpen: boolean;

  // Tema
  theme: "light" | "dark";

  loadPokemons: (page?: number) => Promise<void>;
  loadAllPokemonsForSearch: () => Promise<void>;
  handleSearch: (term: string) => Promise<void>;
  handleSort: (order: "asc" | "desc") => void;
  handlePageChange: (page: number) => void;

  openModal: (pokemonId: number) => Promise<void>;
  closeModal: () => void;

  // Função para tema
  toggleTheme: () => void;

  imageCache: Map<string, boolean>;
  setImageLoaded: (src: string) => void;
  isImageLoaded: (src: string) => boolean;
}

export const PokemonContext = createContext<PokemonContextType | undefined>(
  undefined
);
