import { Pokemon } from "../domain/entities/pokemons";
import { pokeApi } from "../api/pokeApi"; 
import { PokeAPIPokemon } from "../infraestructure/interfaces/pokepi.interfaces"; 
import { PokemonMapper } from "../infraestructure/mappers/pokemon.mapper";

export const getPokemonById = async (id: number): Promise<Pokemon> => {
    try {
        const { data } = await pokeApi.get<PokeAPIPokemon>(`/pokemon/${id}`);

        const pokemon = PokemonMapper.pokeApiPokemonToEntity(data);
        return pokemon;

    } catch (error) {
        throw new Error(`Error getting pokemon by id: ${id}`);
    }
};
