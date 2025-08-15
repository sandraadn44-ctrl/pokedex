import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPokemons } from '../../actions/get-pokemons';
import PokeballBg from '../../components/PokeballBg';
import { PokemonCard } from '../../components/PokemonCard';
import { globalStyles } from '../../theme/global.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigator/StackNavigator';
import { useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper';

type NavigationProp = StackNavigationProp<RootStackParams, 'SearchScreen'>;

export const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp>();

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['pokemons', 'infinite'],
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60, // 60 minutes
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(pokemon => {
        queryClient.setQueryData(['pokemon', pokemon.id], pokemon);
      });
      return pokemons;
    },
    getNextPageParam: (lastPage, pages) => pages.length,
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={globalStyles.globalMargin}>
        <PokeballBg style={styles.imgPosition} />

        <FlatList
          data={data?.pages.flat() ?? []}
          keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
          numColumns={2}
          style={{ paddingTop: top + 20 }}
          ListHeaderComponent={() => (
            <Text style={styles.header}>Pokédex</Text>
          )}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
          onEndReachedThreshold={0.6}
          onEndReached={() => fetchNextPage()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FAB
        icon="magnify"
        style={styles.fab}
        onPress={() => navigation.navigate('SearchScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top: -100,
    right: -100,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#E91E63',
  },
});

export default HomeScreen;
