import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { searchParamsAtom } from "../store/pokemon-atoms";
import { pokemonService } from "../services/pokemonService";
import { graphqlPokemonService } from "../services/graphqlPokemonService";

const USE_GRAPHQL = true;

const QUERY_KEYS = {
  pokemons: (params: Record<string, unknown>) => ["pokemons", params],
  pokemonTypes: () => ["pokemon-types"],
  pokemonDetails: (name: string) => ["pokemon-details", name],
  pokemonSpecies: (name: string) => ["pokemon-species", name],
  favoritePokemons: (ids: number[]) => ["favorite-pokemons", ids],
};

const fetchPokemonDetails = async (nameOrId: string) => {
  const id = parseInt(nameOrId);

  if (!isNaN(id) && USE_GRAPHQL) {
    try {
      return await graphqlPokemonService.getPokemonDetails(id);
    } catch {
      console.warn("GraphQL falhou para detalhes, tentando REST API");
    }
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
    );
    if (response.ok) {
      return response.json();
    }

    if (nameOrId.includes("-")) {
      const baseName = nameOrId.split("-")[0];

      const fallbackResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${baseName}`
      );
      if (fallbackResponse.ok) {
        return fallbackResponse.json();
      }
    }

    throw new Error(`Pokémon "${nameOrId}" não encontrado`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Erro ao buscar Pokémon "${nameOrId}"`;
    toast.error(errorMessage);
    throw error;
  }
};

const fetchPokemonSpecies = async (nameOrId: string) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`
    );
    if (!response.ok) {
      throw new Error(`Espécie "${nameOrId}" não encontrada`);
    }
    return response.json();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Erro ao buscar espécie "${nameOrId}"`;
    toast.error(errorMessage);
    return null;
  }
};

const fetchFavoritePokemons = async (favoriteIds: number[]) => {
  if (favoriteIds.length === 0) return [];

  if (USE_GRAPHQL) {
    try {
      return await graphqlPokemonService.getFavoritePokemons(favoriteIds);
    } catch {
      console.warn("GraphQL falhou para favoritos, tentando REST API");
    }
  }

  try {
    const pokemonPromises = favoriteIds.map(async (id) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(`Pokémon favorito ${id} não encontrado`);
        }

        const pokemon = await response.json();

        const totalStats = pokemon.stats.reduce(
          (sum: number, stat: { base_stat: number }) => sum + stat.base_stat,
          0
        );
        const powerLevel = Math.min(Math.floor(totalStats / 6), 100);

        return {
          id: pokemon.id,
          name: pokemon.name.toLowerCase(),
          sprites: [
            {
              sprites: JSON.stringify({
                other: {
                  "official-artwork": {
                    front_default:
                      pokemon.sprites?.other?.["official-artwork"]
                        ?.front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
                  },
                },
                front_default:
                  pokemon.sprites?.front_default ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
              }),
            },
          ],
          types: pokemon.types.map((typeData: { type: { name: string } }) => ({
            pokemon_v2_type: {
              name: typeData.type.name.toLowerCase(),
            },
          })),
          powerLevel,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(pokemonPromises);
    const validResults = results.filter((pokemon) => pokemon !== null);

    const failedCount = favoriteIds.length - validResults.length;
    if (failedCount > 0) {
      toast.error(
        `Não foi possível carregar ${failedCount} Pokémon${
          failedCount > 1 ? "s" : ""
        } favorito${failedCount > 1 ? "s" : ""}`
      );
    }

    return validResults;
  } catch (error) {
    toast.error("Erro ao carregar Pokémons favoritos");
    throw error;
  }
};

export const usePokemonList = () => {
  const [searchParams] = useAtom(searchParamsAtom);

  return useQuery({
    queryKey: QUERY_KEYS.pokemons(searchParams),
    queryFn: async () => {
      const hasFilters = searchParams.name || searchParams.types;
      const page = hasFilters
        ? 1
        : Math.floor(searchParams.offset / searchParams.limit) + 1;
      const limit = hasFilters ? 300 : searchParams.limit;

      if (USE_GRAPHQL) {
        try {
          const result = await graphqlPokemonService.getPokemonList(
            page,
            limit
          );

          const pokemonList = result.pokemons.map((pokemon) => {
            const mappedPokemon = {
              name: pokemon.name.toLowerCase(),
              sprites: [
                {
                  sprites: JSON.stringify({
                    other: {
                      "official-artwork": {
                        front_default: pokemon.image,
                      },
                    },
                    front_default: pokemon.image,
                  }),
                },
              ],
              types: pokemon.types.map((type) => ({
                pokemon_v2_type: {
                  name: type.toLowerCase(),
                },
              })),
              powerLevel: pokemon.powerLevel,
              id: pokemon.id,
            };

            return mappedPokemon;
          });

          if (searchParams.sort) {
            pokemonList.sort((a, b) => {
              switch (searchParams.sort) {
                case "name-asc":
                  return a.name.localeCompare(b.name);
                case "name-desc":
                  return b.name.localeCompare(a.name);
                case "power-asc":
                  return a.powerLevel - b.powerLevel;
                case "power-desc":
                  return b.powerLevel - a.powerLevel;
                default:
                  return 0;
              }
            });
          } else {
            pokemonList.sort((a, b) => a.powerLevel - b.powerLevel);
          }

          const converted = {
            pokemons: pokemonList,
            pokemon_aggregate: {
              aggregate: {
                count: result.pagination.totalItems,
              },
            },
          };

          return converted;
        } catch {
          console.warn("GraphQL falhou, tentando REST API");
        }
      }

      try {
        const modifiedParams = {
          ...searchParams,
          limit: hasFilters ? 300 : searchParams.limit,
          offset: hasFilters ? 0 : searchParams.offset,
        };
        const result = await pokemonService.getPokemonList(modifiedParams);

        if (searchParams.sort) {
          result.pokemons.sort((a, b) => {
            switch (searchParams.sort) {
              case "name-asc":
                return a.name.localeCompare(b.name);
              case "name-desc":
                return b.name.localeCompare(a.name);
              case "power-asc":
                return a.powerLevel - b.powerLevel;
              case "power-desc":
                return b.powerLevel - a.powerLevel;
              default:
                return 0;
            }
          });
        } else {
          result.pokemons.sort((a, b) => a.powerLevel - b.powerLevel);
        }

        const converted = {
          pokemons: result.pokemons,
          pokemon_aggregate: result.pokemon_aggregate,
        };

        return converted;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao carregar lista de Pokémons";
        toast.error(errorMessage);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePokemonDetails = (nameOrId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.pokemonDetails(nameOrId),
    queryFn: () => fetchPokemonDetails(nameOrId),
    enabled: !!nameOrId,
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("não encontrado")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const usePokemonSpecies = (nameOrId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.pokemonSpecies(nameOrId),
    queryFn: () => fetchPokemonSpecies(nameOrId),
    enabled: !!nameOrId,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });
};

export const useFavoritePokemonDetails = (favoriteIds: number[]) => {
  return useQuery({
    queryKey: QUERY_KEYS.favoritePokemons(favoriteIds),
    queryFn: () => fetchFavoritePokemons(favoriteIds),
    enabled: favoriteIds.length > 0,
    staleTime: 1000 * 60 * 10,
    retry: (failureCount) => failureCount < 2,
  });
};

export const usePokemonTypes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.pokemonTypes(),
    queryFn: async () => {
      if (USE_GRAPHQL) {
        try {
          return await graphqlPokemonService.getPokemonTypes();
        } catch {
          console.warn("GraphQL falhou para tipos, usando lista estática");
        }
      }

      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        if (response.ok) {
          const data = await response.json();
          return {
            pokemon_v2_type: data.results,
          };
        }
      } catch {
        toast.error("Erro ao carregar tipos de Pokémon, usando lista básica");
      }

      const basicTypes = [
        "normal",
        "fire",
        "water",
        "electric",
        "grass",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy",
      ];

      return {
        pokemon_v2_type: basicTypes.map((name) => ({ name })),
      };
    },
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
