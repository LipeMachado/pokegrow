const API_BASE_URL = "https://pokeapi.co/api/v2";

interface PokemonSprites {
  front_default: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
  };
}

interface PokemonStat {
  base_stat: number;
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
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  species: {
    name: string;
    url: string;
  };
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export class PokemonService {
  async getPokemonList(searchParams: {
    name: string;
    types: string;
    sort: string;
    limit: number;
    offset: number;
  }) {
    const limit = searchParams.limit || 20;
    const offset = searchParams.offset || 0;

    const response = await fetch(
      `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
    const data: PokemonListResponse = await response.json();

    const pokemonPromises = data.results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData: ApiPokemonResponse = await pokemonResponse.json();

      const totalStats = pokemonData.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0
      );
      const powerLevel = Math.min(Math.floor(totalStats / 6), 100);

      return {
        id: pokemonData.id,
        name: pokemonData.name.toLowerCase(),
        sprites: [
          {
            sprites: JSON.stringify(pokemonData.sprites),
          },
        ],
        types: pokemonData.types.map((t) => ({
          pokemon_v2_type: {
            name: t.type.name.toLowerCase(),
          },
        })),
        powerLevel,
      };
    });

    const pokemons = await Promise.all(pokemonPromises);

    return {
      pokemons,
      pokemon_aggregate: {
        aggregate: {
          count: data.count,
        },
      },
    };
  }

  async getAllPokemonWithTypes() {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=100000`);
    const data: PokemonListResponse = await response.json();

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        try {
          const pokemonResponse = await fetch(pokemon.url);
          if (!pokemonResponse.ok) {
            return null;
          }
          const pokemonData: ApiPokemonResponse = await pokemonResponse.json();

          const totalStats = pokemonData.stats.reduce(
            (sum, stat) => sum + stat.base_stat,
            0
          );
          const powerLevel = Math.min(Math.floor(totalStats / 6), 100);

          return {
            id: pokemonData.id,
            name: pokemonData.name.toLowerCase(),
            sprites: [
              {
                sprites: JSON.stringify(pokemonData.sprites),
              },
            ],
            types: pokemonData.types.map((t) => ({
              pokemon_v2_type: {
                name: t.type.name.toLowerCase(),
              },
            })),
            powerLevel,
          };
        } catch {
          return null;
        }
      })
    );

    return pokemonDetails.filter((pokemon) => pokemon !== null);
  }

  async getPokemonTypes() {
    const response = await fetch(`${API_BASE_URL}/type`);
    const data = await response.json();

    return {
      pokemon_v2_type: data.results,
    };
  }
}

export const pokemonService = new PokemonService();
