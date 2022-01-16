import { StyleSheet, Image, FlatList, Text, View, TouchableOpacity,Dimensions,Alert } from 'react-native';
import { useEffect, useState, createContext,useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const initialState = {
  favourites: []
}

const GlobalFavContext = createContext(initialState);

//will be used for caching favourite images
const FAVOURITE_KEY = 'mycoolcatsstore'

const getCatsFromApi = async () => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds?limit=20&q=sib', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error);
    return []
  }
};

const PetsListComponent = (props) => {
  const [cats, setCats] = useState([])

  useEffect(async () => {
    setCats(await getCatsFromApi())
  }, [])



  let {favouritesList,setFavouriteArr} = useContext(GlobalFavContext)
  const AddFavourite =  (catObject) => {
    const isFavorite = favouritesList.find(x => x.id === catObject.id)
    if (isFavorite) {
      showFavouritesAlert(catObject)
      return
    }

    let newFavs = [...favouritesList, {
        id: catObject.id,
        name: catObject.name,
        img: catObject.image.url
      }]
      console.log(newFavs)
    setFavouriteArr(newFavs)

  }

  const RemoveFavourite = (favCat)  => {
    let newArr = favouritesList.filter(x => x.id !== favCat.id)
    setFavouriteArr(newArr)
  }


  const showFavouritesAlert = (item) =>
  Alert.alert(
    "Remove Favorite",
    "Are you sure you want to remove this favorite?",[
      { text: "Accept", onPress: () => RemoveFavourite(item) },
      { text: "Decline",  onPress: () => {}},
    ]
  );

  const checkIfInFavorite = (catObject) => {
    if(catObject != undefined){
      return favouritesList.find(x => x.id === catObject.id)
    }
    return false
  }

  const renderCatItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      AddFavourite(item)
    }}>
      <View style={styles.listFlex}>
        <Image style={styles.catImage} source={{ uri: item.image.url }} />
        <Text style={styles.catName}>{item.name}</Text>
        <View style={styles.details}>
          <Ionicons name={checkIfInFavorite(item) ? 'heart':'heart-outline'} size={20} color={checkIfInFavorite(item)?"red":"grey"} style={styles.heartIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.catsTab}>
      <FlatList
        data={cats}
        renderItem={renderCatItem}
        style={styles.listContainer}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const PetsGridComponent = (props) => {
  const {favouritesList,setFavouriteArr} = useContext(GlobalFavContext)

  const RemoveFav = (favCat) => (event) => {
    setFavouriteArr(favouritesList.filter(x => x.id !== favCat.id))
  }

  return (
    <View style={styles.catsTab}>
      <FlatList style={styles.listContainer}
        data={favouritesList}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.catTile}>
            <Image style={styles.gridImage} source={{ uri: item.img }} />
            <View style={styles.gridLabel}>
              <Text style={styles.catName}>{item.name}</Text>
              <TouchableOpacity onPress={RemoveFav(item)}>
                  <Ionicons name='heart' size={20} color="red" style={styles.gridHeart} />
              </TouchableOpacity>
            </View>
          </View>
        )} />
    </View>
  )
}

const Tab = createBottomTabNavigator()

export default function App() {
  const [favouritesList, setFavouriteArr] = useState([]);

  return (
      <NavigationContainer>
          <GlobalFavContext.Provider value={{favouritesList,setFavouriteArr}}>
        <Tab.Navigator>
            <Tab.Screen name="All Cats" component={PetsListComponent}
              options={{
                headerTitleAlign: "left",
                headerShadowVisible: false,
                tabBarActiveTintColor: "black",
                tabBarIcon: ({ focused, size }) => (
                  <Ionicons name="logo-octocat" size={size * 1.2} color={focused ? "black" : "grey"} />
                ),
              }
              }
            />
            <Tab.Screen name="Cats I like" component={PetsGridComponent}
              options={{
                headerTitleAlign: ()=>{return <View style={styles.catsTab}></View>},
                headerShadowVisible: false,
                tabBarActiveTintColor: "black",
                tabBarIcon: ({ focused, size }) => (
                  <Ionicons name="heart" size={size * 1.2} color={focused ? "black" : "grey"} />
                ),
              }
              }
            />
        </Tab.Navigator>
        </GlobalFavContext.Provider>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  catsTab: {
    backgroundColor: "white",
    width:"100%",
    height:"100%",
  },

  listContainer: {
  },

  catImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  catItem: {
    padding: 20,
  },

  catName: {
    fontSize: 18,
    marginLeft: 10,
  },

  listFlex: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "center",
  },

  details: {
    flex: 2,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: "center",
  },

  heartIcon: {
    marginRight: 20,
  },

  gridImage:{
    alignSelf:'center',
    width: 170,
    height:170,
    borderRadius: 10,
    marginBottom:10,
  },
  
  gridHeart:{

  },

  gridLabel:{
    display: 'flex',
    flexDirection: "row",
    justifyContent:"space-between",
  },

  catTile:{
    padding: 10,
    margin:1,
    justifyContent:'center',
    flexDirection: 'column',
    width: Dimensions.get('window').width / 2
  }
});
