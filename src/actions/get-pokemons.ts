// Función asincrónica para obtener una lista de pokemones 
import { pokeApi } from "../api/pokeApi";
import { Pokemon } from "../domain/entities/pokemons";
import { PokemonMapper } from "../infraestructure/mappers/pokemon.mapper";
import { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../infraestructure/interfaces/pokepi.interfaces";

export const getPokemons = async (
  page: number, // número de la página
  limit: number = 20 // límite de resultados por página
): Promise<Pokemon[]> => { // retorna un arreglo de objetos de tipo Pokemon
  try {
    // Construyendo la URL para paginar los resultados

const url = `/pokemon?offset=${page * limit}&limit=${limit}`;

    // Hace la solicitud a la API y extrae la data de la respuesta
    const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url);

    // Mapeas los resultados para obtener el detalle de cada pokemon
    const pokemonPromises = data.results.map(info => {
      return pokeApi.get<PokeAPIPokemon>(info.url);
    });

    // Esperas todos los detalles de cada Pokémon
    const pokeApiPokemons = await Promise.all(pokemonPromises);

    // Mapeas cada respuesta al modelo de entidad de dominio
    const pokemonsPromises = pokeApiPokemons.map(item =>
      PokemonMapper.pokeApiPokemonToEntity(item.data)
    );

    // Retorna el array final de Pokémons convertidos
    return await Promise.all(pokemonsPromises);

  } catch (error) {
    console.log(error);
    throw new Error('Error getting pokemons');
  }
};
