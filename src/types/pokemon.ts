export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  powerLevel: number;
}

export interface PokemonListItem {
  id: number;
  name: string;
  image: string;
  types: string[];
  powerLevel: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonDetails extends Pokemon {
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStats;
  description: string;
  evolutionChain?: {
    evolvesFrom?: string;
    evolvesTo?: string[];
  };
}
