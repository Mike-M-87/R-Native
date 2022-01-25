import { Dimensions, Platform, StatusBar, StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

let apiurl = "https://api.thecatapi.com/v1/breeds?limit=20"


export default function App() {
  const [cats, setCats] = useState([])
  const [favs, setFavs] = useState([])
  const [ViewPage, setPage] = useState('All')

  async function getCatsFromApi(path) {
    try {
      const response = await fetch(path, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()
      setCats(data)
    } catch (error) {
      console.log(error);
    }
  };

  const AddFavourite = useCallback((catObject) => (event) => {
    if (favs.find(x => x.id === catObject.id) !== undefined) {
      setFavs(favs.filter(x => x.id !== catObject.id))
    } else {
      setFavs([
        {
          "id": catObject.id,
          "name": catObject.name,
          "img": catObject.image.url
        },
        ...favs
      ])
    }
  }, [favs])

  const removeFav = (favCat) => (event) => {
    setFavs(favs.filter(x => x.id !== favCat.id))
  }

  const changeView = (view) => (event) => {
    setPage(view)
  }

  function checkFavourite(favCat) {
    if (favs.find(x => x.id === favCat.id)) {
      return true
    }
    return false
  }

  useEffect(() => {
    getCatsFromApi(apiurl)
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
                onPress={AddFavourite(item)}>
                <View style={styles.listItem}>
                  <Image style={styles.catImage} source={{ uri: item.image.url }} />
                  <Text style={styles.catName}>{item.name}</Text>
                  <View style={styles.likeButton}>
                    <Ionicons
                      name={checkFavourite(item) ? 'heart' : 'heart-outline'}
                      size={20}
                      color={checkFavourite(item) ? "red" : "grey"}
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
                <View style={styles.FavDetails}>
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
            <Ionicons name="logo-octocat" size={25} />
            <Text>All Cats</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={changeView('Favourites')}>
          <View style={ViewPage == 'Favourites' ? styles.tabButton : styles.tabButtonFade}>
            <Ionicons name='heart' size={25} />
            <Text>Cats I Like</Text>
          </View>
        </TouchableOpacity>

      </View>
    </>
  );

}


const styles = StyleSheet.create({
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
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  heading: {
    width: '100%',
    fontSize: 25,
    padding: 10,
    marginTop: StatusBar.currentHeight,
  },

  listItem: { flexDirection: 'row', alignItems: 'center', padding: 10, },

  FavDetails: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },

  FavItem: {
    width: '50%',
    marginTop: 10,
    alignItems: 'center'
  },

  FavCatImage: { width: '95%', height: 150, borderRadius: 5, },
  FavCatName: { fontSize: 17 },

  listContainer: { marginBottom: 130 },

  catImage: { width: 50, height: 50, borderRadius: 10, },

  catName: { fontSize: 20, marginLeft: 20 },

});
