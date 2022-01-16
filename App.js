import { StyleSheet, Image, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [cats, setCats] = useState([])
  const [favs, setFavs] = useState([])
  const [ViewPage, setPage] = useState('All')

  const getCatsFromApi = async () => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/breeds?limit=20', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'x-api-key': '{$$.env.cb63aaf1-e74b-45a1-ac31-5105138a21ca}'
        }
      })
      const json = await response.json()
      setCats(json)
    } catch (error) {
      return error
    }
  };

  const AddFavourite = useCallback((catObject) => (event) => {
    setFavs([
      ...favs,
      catObject
    ])
  }, [favs])

  const removeFav = useCallback((favCat) => (event) => {
    const newFavs = [...favs]
    const idx = newFavs.findIndex(x => x.id === favCat.id);
    newFavs.splice(idx, 1)
    setFavs(newFavs)
  }, [favs])

  const changeView = (view) => (event) => {
    setPage(view)
  }

  useEffect(() => {
    getCatsFromApi()
  }, [])

  return (
    <>
      {ViewPage == "All" ?
        (
          <View>
            <Text style={styles.heading}>All Cats</Text>
            <FlatList style={styles.listContainer}
              data={cats}
              renderItem={({ item }) => (
                <View style={styles.listItem} >
                  <Image style={styles.catImage} source={{ uri: item.image.url }} />
                  <Text style={styles.catName}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={(favs.find(x => x.id == item.id)) ?
                      removeFav({ 'id': item.id, 'name': item.name, 'img': item.image.url })
                      : AddFavourite({ 'id': item.id, 'name': item.name, 'img': item.image.url })}>
                    <Ionicons
                      name={(favs.find(x => x.id == item.id)) ? 'ios-heart' : 'ios-heart-outline'}
                      size={25}
                      color={(favs.find(x => x.id == item.id)) ? "red" : "black"}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

        ) : (

          <View>
            <Text style={styles.heading}>Cats I Like</Text>
            <FlatList style={styles.FavListContainer}
              data={favs}
              numColumns={2}
              key={(itm, index) => itm + index}
              renderItem={({ item }) => (
                <View style={styles.FavItem}>
                  <Image style={styles.FavCatImage} source={{ uri: item.img }} />
                  <View style={styles.FavListItem}>
                    <Text style={styles.FavCatName}>{item.name}</Text>
                    <TouchableOpacity
                      onPress={removeFav(item)}>
                      <Ionicons name='ios-heart' size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )
      }

      <View style={styles.tabSwitch}>
        <TouchableOpacity
          style={ViewPage == 'All' ? '' : styles.tabButton}
          onPress={changeView('All')}>
          <Image style={styles.tabImage} source={require('./assets/cat.png')} />
          <Text>All Cats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={ViewPage == 'Favourites' ? '' : styles.tabButton}
          onPress={changeView('Favourites')}>
          <Image style={styles.tabImage} source={require('./assets/heart.png')} />
          <Text>Cats I Like</Text>
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({

  tabImage: { width: 40, height: 40, margin: 'auto', },

  tabButton: { opacity: 0.2, },

  likeButton: { marginLeft: 'auto', },

  tabSwitch: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  heading: {
    width: '100%',
    zIndex: 1,
    fontSize: 42,
    padding: 20,
    position: 'fixed',
    backgroundColor: 'white'
  },

  listItem: { flexDirection: 'row', alignItems: 'center', padding: 20, },

  FavListContainer: { marginBottom: 100, marginTop: 100, },

  FavListItem: {
    width: '40vw',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  FavItem: {
    marginTop: 20,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center'
  },

  FavCatImage: { width: '40vw', height: '40vw', borderRadius: 5, },

  FavCatName: { fontSize: 17 },

  listContainer: { marginBottom: 80, marginTop: 80, },

  catImage: { width: 50, height: 50, borderRadius: 10, },

  catName: { fontSize: 20, marginLeft: 20 },

});




