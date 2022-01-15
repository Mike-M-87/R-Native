import { StyleSheet, Image, FlatList, Text, View } from 'react-native';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
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
      console.log(error);
    }
  };

  const AddFavourite = useCallback((catObject) => (event) => {
    if (!(favs.find(x => x.id === catObject.id))) {
      setFavs([
        ...favs,
        {
          id: catObject.id,
          name: catObject.name,
          img: catObject.image.url
        },
      ])
    }
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
    <View>
      
      {
        ViewPage == "All" ?
          (
            <View>
              <h1 className='bg-light p-4 fixed-top'>All Cats</h1>
              <FlatList style={styles.listContainer}
                data={cats}
                renderItem={({ item }) => (
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <Image style={styles.catImage} source={{ uri: item.image.url }} />
                    <Text style={styles.catName}>{item.name}</Text>
                    <a  style={{cursor:'pointer'}}
                       onClick={(favs.find(x => x.id == item.id)) ? removeFav({ 'id': item.id, 'name': item.name, 'img': item.image.url }) : AddFavourite(item)} >
                      <Ionicons name={(favs.find(x => x.id == item.id)) ? 'heart' : 'heart-outline'} size={25} color="red" />
                    </a>
                  </div>
                )}
              />
            </View>
          ) : (
            <View>
              <h1 className='p-4 bg-light fixed-top'>Cats i like</h1>
              <FlatList style={styles.listContainer}
                data={favs}
                renderItem={({ item }) => (
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <Image style={styles.catImage} source={{ uri: item.img }} />
                    <Text style={styles.catName}>{item.name}</Text>
                    <a style={{cursor:'pointer'}}
                      onClick={removeFav(item)}>
                      <Ionicons name='heart' size={25} color="red" />
                    </a>
                  </div>
                )}
              />
            </View>
          )
      }
      <div className='fixed-bottom bg-light p-4 d-flex justify-content-around'>
        <button onClick={changeView('All')} className='btn  btn-primary'>All</button>
        <button onClick={changeView('Favourites')} className='btn btn-primary'>Fav</button>
      </div>
    </View>
  );
}



const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 70,
    marginTop: 70,
  },

  catImage: {
    width: '50px',
    height: '50px',
    borderRadius: '5px',
    // marginRight: '1rem',
  },
  catItem: {
    padding: '20%',
  },
  catName: {
    fontSize: 'larger',
  },

});
