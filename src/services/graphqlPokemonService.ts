import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "content-type": "application/json",
    accept: "*/*",
  },
});

const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int!, $offset: Int!) {
    pokemon(
      limit: $limit
      offset: $offset
      where: { is_default: { _eq: true } }
    ) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
    pokemon_aggregate(where: { is_default: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }, limit: 1) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
      pokemonabilities {
        is_hidden
        ability {
          name
        }
      }
    }
  }
`;

const GET_POKEMON_TYPES = gql`
  query GetPokemonTypes {
    type(order_by: { name: asc }) {
      name
    }
  }
`;

interface SpritesData {
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
  };
  front_default?: string;
}

interface GraphQLPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  pokemonsprites: Array<{
    sprites: string;
  }>;
  pokemontypes: Array<{
    type: {
      name: string;
    };
  }>;
  pokemonstats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  pokemonabilities?: Array<{
    is_hidden: boolean;
    ability: {
      name: string;
    };
  }>;
}

interface GraphQLResponse {
  pokemon: GraphQLPokemon[];
  pokemon_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export class GraphQLPokemonService {
  async getPokemonList(page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const data = await client.request<GraphQLResponse>(GET_POKEMON_LIST, {
        limit,
        offset,
      });

      if (!data.pokemon || data.pokemon.length === 0) {
        throw new Error("Nenhum Pokémon encontrado");
      }

      const pokemons = data.pokemon.map((pokemon: GraphQLPokemon) => {
        const stats = pokemon.pokemonstats.reduce((acc, stat) => {
          acc[stat.stat.name] = stat.base_stat;
          return acc;
        }, {} as Record<string, number>);

        const hp = stats.hp || 0;
        const attack = stats.attack || 0;
        const defense = stats.defense || 0;
        const specialAttack = stats["special-attack"] || 0;
        const specialDefense = stats["special-defense"] || 0;
        const speed = stats.speed || 0;

        const totalPower = Math.floor(
          hp * 0.15 +
            attack * 0.2 +
            defense * 0.15 +
            specialAttack * 0.2 +
            specialDefense * 0.15 +
            speed * 0.15
        );

        const sprites = pokemon.pokemonsprites[0]?.sprites;
        let parsedSprites: SpritesData = {};

        if (sprites) {
          try {
            if (typeof sprites === "string") {
              parsedSprites = JSON.parse(sprites) as SpritesData;
            } else if (typeof sprites === "object" && sprites !== null) {
              parsedSprites = sprites as SpritesData;
            }
          } catch {
            parsedSprites = {};
          }
        }

        const imageUrl =
          parsedSprites?.other?.["official-artwork"]?.front_default ||
          parsedSprites?.front_default ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

        const finalImageUrl =
          imageUrl ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

        return {
          id: pokemon.id,
          name: pokemon.name,
          image: finalImageUrl,
          types: pokemon.pokemontypes.map((t) => t.type.name),
          powerLevel: totalPower,
          stats: {
            hp,
            attack,
            defense,
            specialAttack,
            specialDefense,
            speed,
          },
        };
      });

      const totalCount = data.pokemon_aggregate.aggregate.count;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        pokemons,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro GraphQL: ${error.message}`);
      }
      throw new Error("Erro desconhecido na API GraphQL");
    }
  }

  async getPokemonDetails(id: number) {
    try {
      const data = await client.request<{ pokemon: GraphQLPokemon[] }>(
        GET_POKEMON_DETAILS,
        { id }
      );

      if (!data.pokemon || data.pokemon.length === 0) {
        throw new Error(`Pokémon ${id} não encontrado`);
      }

      const pokemon = data.pokemon[0];

      const sprites = pokemon.pokemonsprites[0]?.sprites;
      let parsedSprites: SpritesData = {};

      if (sprites) {
        try {
          if (typeof sprites === "string") {
            parsedSprites = JSON.parse(sprites) as SpritesData;
          } else if (typeof sprites === "object" && sprites !== null) {
            parsedSprites = sprites as SpritesData;
          }
        } catch {
          parsedSprites = {};
        }
      }

      return {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        base_experience: pokemon.base_experience,
        sprites: {
          front_default:
            parsedSprites?.front_default ||
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
          other: {
            "official-artwork": {
              front_default:
                parsedSprites?.other?.["official-artwork"]?.front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
            },
          },
        },
        types: pokemon.pokemontypes.map((t) => ({
          type: {
            name: t.type.name,
          },
        })),
        stats: pokemon.pokemonstats.map((s) => ({
          base_stat: s.base_stat,
          stat: {
            name: s.stat.name,
          },
        })),
        abilities:
          pokemon.pokemonabilities?.map((a) => ({
            ability: {
              name: a.ability.name,
            },
            is_hidden: a.is_hidden,
          })) || [],
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar detalhes: ${error.message}`);
      }
      throw new Error(`Erro ao buscar detalhes do Pokémon ${id}`);
    }
  }

  async getPokemonTypes() {
    try {
      const data = await client.request<{ type: Array<{ name: string }> }>(
        GET_POKEMON_TYPES
      );

      if (!data.type || data.type.length === 0) {
        throw new Error("Nenhum tipo encontrado");
      }

      return {
        pokemon_v2_type: data.type,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar tipos: ${error.message}`);
      }
      throw new Error("Erro ao buscar tipos de Pokémon");
    }
  }

  async getFavoritePokemons(favoriteIds: number[]) {
    if (favoriteIds.length === 0) return [];

    try {
      const favoriteDetailsQuery = gql`
        query GetFavoritePokemons($ids: [Int!]!) {
          pokemon(where: { id: { _in: $ids } }) {
            id
            name
            height
            weight
            base_experience
            pokemonsprites {
              sprites
            }
            pokemontypes {
              type {
                name
              }
            }
            pokemonstats {
              base_stat
              stat {
                name
              }
            }
          }
        }
      `;

      const data = await client.request<{ pokemon: GraphQLPokemon[] }>(
        favoriteDetailsQuery,
        { ids: favoriteIds }
      );

      if (!data.pokemon) {
        throw new Error("Erro ao buscar Pokémons favoritos");
      }

      return data.pokemon.map((pokemon: GraphQLPokemon) => {
        const totalStats = pokemon.pokemonstats.reduce(
          (sum, stat) => sum + stat.base_stat,
          0
        );
        const powerLevel = Math.min(Math.floor(totalStats / 6), 100);

        const sprites = pokemon.pokemonsprites[0]?.sprites;
        let parsedSprites: SpritesData = {};

        if (sprites) {
          try {
            if (typeof sprites === "string") {
              parsedSprites = JSON.parse(sprites) as SpritesData;
            } else if (typeof sprites === "object" && sprites !== null) {
              parsedSprites = sprites as SpritesData;
            }
          } catch {
            parsedSprites = {};
          }
        }

        return {
          id: pokemon.id,
          name: pokemon.name.toLowerCase(),
          sprites: [
            {
              sprites: JSON.stringify({
                other: {
                  "official-artwork": {
                    front_default:
                      parsedSprites?.other?.["official-artwork"]
                        ?.front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
                  },
                },
                front_default:
                  parsedSprites?.front_default ||
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
              }),
            },
          ],
          types: pokemon.pokemontypes.map((t) => ({
            pokemon_v2_type: {
              name: t.type.name.toLowerCase(),
            },
          })),
          powerLevel,
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar favoritos: ${error.message}`);
      }
      throw new Error("Erro ao buscar Pokémons favoritos");
    }
  }
}

export const graphqlPokemonService = new GraphQLPokemonService();
