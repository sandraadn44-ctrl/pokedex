import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pokemon } from '../domain/entities/pokemons';
import { RootStackParams } from '../navigator/StackNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';

interface Props {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => navigation.navigate('PokemonScreen', { pokemonId: pokemon.id })}
    >
      <Card style={[styles.cardContainer, { backgroundColor: pokemon.color }]}>
        <Text style={styles.name}>
          {pokemon.name}
          {'\n#' + pokemon.id}
        </Text>

        <View style={styles.pokeballContainer}>
          <Image
            source={require('../assets/pokeball-light.png')}
            style={styles.pokeball}
          />
        </View>

        <Image source={{ uri: pokemon.avatar }} style={styles.pokemonImage} />

        <Text style={styles.typeText}>{pokemon.types[0]}</Text>
      </Card>
    </Pressable>
  );
};

export default PokemonCard;

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10,
    backgroundColor: 'grey',
    height: 120,
    flex: 0.5,
    marginBottom: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    color: 'white',
    top: 10,
    left: 10,
    fontWeight: 'bold',
  },
  typeText: {
    color: 'white',
    marginTop: 35,
    left: 10,
  },
  pokeball: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    right: 5,
    bottom: 5,
    zIndex: 1,
  },
  pokeballContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
});
