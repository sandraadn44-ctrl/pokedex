// Importa el tipo 'Pokemon' desde el dominio de entidades
import type { Pokemon } from '../../domain/entities/pokemons';

// Importa la interfaz 'PokeAPIPokemon' que representa la estructura de los datos recibidos desde la PokeAPI
import { PokeAPIPokemon } from '../interfaces/pokepi.interfaces';

// Se define la clase 'PokemonMapper' responsable de transformar datos de la API a la entidad de dominio
export class PokemonMapper {
 
  // Método estático que transforma un objeto 'PokeAPIPokemon' en un objeto del tipo 'Pokemon'
  static async pokeApiPokemonToEntity(data: PokeAPIPokemon): Promise<Pokemon> {
   
    // Obtiene los sprites del Pokémon desde los datos de la API
    const sprites = PokemonMapper.getSprites(data);

    // Construye la URL del avatar del Pokémon usando su ID
    const avatar = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

    // const color = await getColorFromImage(avatar); <-- QUITADO (opcional, fue comentado)

    // Retorna un objeto que representa la entidad 'Pokemon'
    return {
      id: data.id, // ID del Pokémon
      name: data.name, // Nombre del Pokémon
      avatar: avatar, // URL del avatar
      sprites: sprites, // Lista de sprites del Pokémon

      // Extrae los tipos del Pokémon desde el arreglo 'types'
      types: data.types.map(type => type.type.name),

      // Color asignado manualmente o puedes usar 'null' si no se usa
      color: '#A8A77A', // o null

      // Extrae los nombres de los juegos en los que aparece el Pokémon
      games: data.game_indices.map(game => game.version.name),

      // Extrae las estadísticas del Pokémon
      stats: data.stats.map(stat => ({
        name: stat.stat.name, // Nombre de la estadística (ej. "hp", "attack")
        value: stat.base_stat, // Valor base de la estadística
      })),

      // Extrae las habilidades del Pokémon
      abilities: data.abilities.map(ability => ability.ability.name),

      // Extrae los movimientos y el nivel en que los aprende, luego los ordena por nivel
      moves: data.moves
        .map(move => ({
          name: move.move.name, // Nombre del movimiento
          level: move.version_group_details[0].level_learned_at, // Nivel en que se aprende
        }))
        .sort((a, b) => a.level - b.level), // Ordena los movimientos por nivel ascendente
    };
  }

  // Método auxiliar para obtener todos los sprites disponibles del Pokémon
  static getSprites(data: PokeAPIPokemon): string[] {
    // Inicializa un arreglo con los sprites por defecto y shiny (adelante y atrás)
    const sprites: string[] = [
      data.sprites.front_default,
      data.sprites.back_default,
      data.sprites.front_shiny,
      data.sprites.back_shiny,
    ];

    // Agrega sprites adicionales si existen en otras secciones del objeto

    if (data.sprites.other?.home.front_default)
      sprites.push(data.sprites.other?.home.front_default);

    if (data.sprites.other?.['official-artwork'].front_default)
      sprites.push(data.sprites.other?.['official-artwork'].front_default);

    if (data.sprites.other?.['official-artwork'].front_shiny)
      sprites.push(data.sprites.other?.['official-artwork'].front_shiny);

    if (data.sprites.other?.showdown.front_default)
      sprites.push(data.sprites.other?.showdown.front_default);

    if (data.sprites.other?.showdown.back_default)
      sprites.push(data.sprites.other?.showdown.back_default);

    // Retorna el arreglo completo de URLs de sprites
    return sprites;
  }
}