import {Dimensions, Platform, StatusBar, StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';


export default function App() {
  const [cats, setCats] = useState([])
  const [favs, setFavs] = useState([])
  const [ViewPage, setPage] = useState('All')

  const getCatsFromApi = async () => {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/breeds?limit=30', {
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
        <View>
          <Text style={styles.heading}>All Cats</Text>
          <FlatList style={styles.listContainer}
            data={cats}
            renderItem={({ item }) => (

              <TouchableOpacity
                onPress={(favs.find(x => x.id == item.id)) ?
                  removeFav({ 'id': item.id, 'name': item.name, 'img': item.image.url })
                  : AddFavourite({ 'id': item.id, 'name': item.name, 'img': item.image.url })}>
                <View style={styles.listItem} >
                  <Image style={styles.catImage} source={{ uri: item.image.url }} />
                  <Text style={styles.catName}>{item.name}</Text>
                  <View style={styles.likeButton}>
                    <Ionicons
                      name={(favs.find(x => x.id == item.id)) ? 'ios-heart' : 'ios-heart-outline'}
                      size={20}
                      color={(favs.find(x => x.id == item.id)) ? "red" : "black"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        :
        <View>
          <Text style={styles.heading}>Cats I Like</Text>
          <FlatList style={styles.listContainer}
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
      }

      <View style={styles.tabSwitch}>
        <TouchableOpacity
          onPress={changeView('All')}>
          <View style={ViewPage == 'All' ? styles.tabButton : styles.tabButtonFade}>
            <Image style={styles.tabImage} source={require('./assets/cat.png')} />
            <Text>All Cats</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={changeView('Favourites')}>
          <View style={ViewPage == 'Favourites' ? styles.tabButton : styles.tabButtonFade}>
            <Image style={styles.tabImage} source={require('./assets/heart.png')} />
            <Text>Cats I Like</Text>
          </View>
        </TouchableOpacity>

      </View>
    </>
  );

}

const styles = StyleSheet.create({

  tabImage: { width: 25, height: 25 },

  tabButton: { opacity: 1, alignItems: 'center' },
  tabButtonFade: { opacity: 0.2, alignItems: 'center' },

  likeButton: { marginLeft: 'auto', },

  tabSwitch: {
    ...Platform.select({
      android: {
        position: 'absolute'
      },
      ios: {
        position: 'absolute'
      },
      default: {
        position: 'fixed'
      }
    }),
    // position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  heading: {
    width: '100%',
    fontSize: 25,
    padding: 10,
    alignContent: 'center',
    marginTop: StatusBar.currentHeight,
    position: 'relative',
    backgroundColor: StatusBar.color,
  },

  listItem: { flexDirection: 'row', alignItems: 'center', padding: 10, },

  FavListItem: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  FavItem: {
    width: '50%',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center'
  },

  FavCatImage: { width: '95%', height: Dimensions.get('screen').height/5, borderRadius: 5, },

  FavCatName: { fontSize: 17 },

  listContainer: { marginBottom: 110 + StatusBar.currentHeight, },

  catImage: { width: 50, height: 50, borderRadius: 10, },

  catName: { fontSize: 20, marginLeft: 20 },

});
