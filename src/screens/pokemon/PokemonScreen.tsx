import { StackScreenProps } from '@react-navigation/stack';
import { FlatList, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { getPokemonById } from '../../actions/get-pokemon-by-id';
import { Formatter } from '../../helpers/formatter';
import { FullScreenLoader } from '../../components/FullScreenLoader';
import { RootStackParams } from '../../navigator/StackNavigator';

interface Props extends StackScreenProps<RootStackParams, 'PokemonScreen'> {}

export const PokemonScreen = ({ route }: Props) => {
  const { isDark } = useContext(ThemeContext);
  const { top } = useSafeAreaInsets();
  const { pokemonId } = route.params;

  const pokeballImg = isDark
    ? require('../../assets/pokeball-light.png')
    : require('../../assets/pokeball-dark.png');

  const { data: pokemon } = useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => getPokemonById(pokemonId),
    staleTime: 1000 * 60 * 60,
  });

  if (!pokemon) return <FullScreenLoader />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: pokemon.color }} bounces={false} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={{ ...styles.pokemonName, top: top + 5 }}>
          {Formatter.capitalize(pokemon.name) + '\n'}#{pokemon.id}
        </Text>
        <Image source={pokeballImg} style={styles.pokeball} />
        <Image source={{ uri: pokemon.avatar }} style={styles.pokemonImage} />
      </View>

      {/* Types */}
      <View style={styles.row}>
        {pokemon.types.map(type => (
          <View key={type} style={styles.chip}>
            <Text style={styles.chipText}>{type}</Text>
          </View>
        ))}
      </View>

      {/* Sprites */}
      <FlatList
        data={pokemon.sprites}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20, height: 100 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width: 100, height: 100, marginHorizontal: 5 }} resizeMode="contain" />
        )}
      />

      {/* Abilities */}
      <Text style={styles.subTitle}>Abilities</Text>
      <FlatList
        data={pokemon.abilities}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{Formatter.capitalize(item)}</Text>
          </View>
        )}
      />

      {/* Stats */}
      <Text style={styles.subTitle}>Stats</Text>
      <FlatList
        data={pokemon.stats}
        keyExtractor={item => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.statsContainer}>
            <Text style={{ flex: 1, color: 'white' }}>{Formatter.capitalize(item.name)}</Text>
            <Text style={{ color: 'white' }}>{item.value}</Text>
          </View>
        )}
      />

      {/* Moves */}
      <Text style={styles.subTitle}>Moves</Text>
      <FlatList
        data={pokemon.moves}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.statsContainer}>
            <Text style={{ flex: 1, color: 'white' }}>{Formatter.capitalize(item.name)}</Text>
            <Text style={{ color: 'white' }}>lvl {item.level}</Text>
          </View>
        )}
      />

      {/* Games */}
      <Text style={styles.subTitle}>Games</Text>
      <FlatList
        data={pokemon.games}
        horizontal
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{Formatter.capitalize(item)}</Text>
          </View>
        )}
      />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 370,
    zIndex: 999,
    alignItems: 'center',
    borderBottomRightRadius: 1000,
    borderBottomLeftRadius: 1000,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pokemonName: {
    color: 'white',
    fontSize: 40,
    alignSelf: 'flex-start',
    left: 20,
  },
  pokeball: {
    width: 250,
    height: 250,
    bottom: -20,
    opacity: 0.7,
  },
  pokemonImage: {
    width: 240,
    height: 240,
    position: 'absolute',
    bottom: -40,
  },
  subTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'column',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    flexWrap: 'wrap',
  },
});