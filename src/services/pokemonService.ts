import axios from "axios";
import type {
  PokemonListItem,
  PaginationInfo,
  PokemonDetails,
} from "../types/pokemon";

const API_BASE_URL = "https://pokeapi.co/api/v2";

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface ApiPokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

const calculatePowerLevel = (stats: PokemonStat[]): number => {
  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  return Math.round(totalStats / 6);
};

const getPokemonImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

const formatTypeName = (typeName: string): string => {
  return typeName.charAt(0).toUpperCase() + typeName.slice(1);
};

const formatAbilityName = (abilityName: string): string => {
  return abilityName.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const pokemonService = {
  async getPokemonList(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    pokemons: PokemonListItem[];
    pagination: PaginationInfo;
  }> {
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get<ApiPokemonResponse>(
        `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
      );

      const pokemonList = await Promise.all(
        response.data.results.map(
          async (pokemon: { name: string; url: string }, index: number) => {
            const id = offset + index + 1;
            const detailResponse = await axios.get(pokemon.url);
            const data = detailResponse.data;

            const powerLevel = calculatePowerLevel(data.stats);

            return {
              id,
              name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
              image: getPokemonImageUrl(id),
              types: data.types.map((type: PokemonType) =>
                formatTypeName(type.type.name)
              ),
              powerLevel,
            };
          }
        )
      );

      const totalItems = response.data.count;
      const totalPages = Math.ceil(totalItems / limit);

      const pagination: PaginationInfo = {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: !!response.data.next,
        hasPreviousPage: !!response.data.previous,
      };

      return {
        pokemons: pokemonList,
        pagination,
      };
    } catch (error) {
      console.error("Erro ao buscar lista de Pokémons:", error);
      throw error;
    }
  },

  async getAllPokemonForSearch(): Promise<PokemonListItem[]> {
    try {
      const response = await axios.get<ApiPokemonResponse>(
        `${API_BASE_URL}/pokemon?limit=151`
      );
      const pokemonList = await Promise.all(
        response.data.results.map(
          async (pokemon: { name: string; url: string }, index: number) => {
            const id = index + 1;
            const detailResponse = await axios.get(pokemon.url);
            const data = detailResponse.data;

            const powerLevel = calculatePowerLevel(data.stats);

            return {
              id,
              name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
              image: getPokemonImageUrl(id),
              types: data.types.map((type: PokemonType) =>
                formatTypeName(type.type.name)
              ),
              powerLevel,
            };
          }
        )
      );

      return pokemonList;
    } catch (error) {
      console.error("Erro ao buscar todos os Pokémons:", error);
      throw error;
    }
  },

  async getPokemonDetails(id: number): Promise<PokemonDetails> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);
      const data = response.data;

      const powerLevel = calculatePowerLevel(data.stats);

      return {
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        image: getPokemonImageUrl(data.id),
        types: data.types.map((type: PokemonType) =>
          formatTypeName(type.type.name)
        ),
        abilities: data.abilities.map((ability: PokemonAbility) =>
          formatAbilityName(ability.ability.name)
        ),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
        powerLevel,
        height: data.height / 10, // Convert to meters
        weight: data.weight / 10, // Convert to kg
        description: `Um Pokémon ${data.types
          .map((type: PokemonType) => formatTypeName(type.type.name))
          .join("/")} com poder total de ${powerLevel}.`,
      };
    } catch (error) {
      console.error("Erro ao buscar detalhes do Pokémon:", error);
      throw error;
    }
  },
};
