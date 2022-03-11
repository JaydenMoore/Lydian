import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import PostElement from '../components/post'
import Data from '../Data';

import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore();

export default function addConversationScreen({navigation}) {
  const params = useRoute().params
  const [refresh, setRefresh] = useState(params)
  const [search, setSearch] = useState(params ? params.tag : search);
  const [data, setData] = useState([]);
  const [color, setColor] = useState(params && !params.tag.includes("#") ? "#000000" : "#3F88C5");
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => setRefresh())
    setSearch(params ? params.tag : search)
    setColor("#3F88C5")
    return unsubscribe;
  }, [navigation, params]);

  const styles = StyleSheet.create({
    screen: {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      padding: 15,
      alignItems: "center",
    },
    textInput1: {
      padding: 5,
      paddingHorizontal: 10,
      backgroundColor: '#FFFFFF',
      height: 45,
      width: "95%",
      shadowColor: '#000',
      shadowOffset: { width: 0.5, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 2,
      fontSize: 16,
      color: color
    },
    flatListStyle: {
      width: "100%",
      height: "100%",
      marginTop: 20,
    }
  })

  useEffect(() => {
    db.collection("posts").orderBy("date").onSnapshot((snapshot) => {
      const dbData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setData(dbData)
    })
  }, [search, navigation])

  const handleSearch = (searchText) => {
    if (searchText.charAt(0) == "#" && color != "#3F88C5"){
      setColor("#3F88C5")
    } else if ( searchText.charAt(0) != "#" && color != "#000000") {
      setColor("#000000")
    }
    setSearch(searchText)
  }

  const renderUsers = (query) => {
    if (search ==  undefined || search == '' || search == "#"){
      return
    }

    if (query.author.includes(search) || query.tag.includes(search)){
      return(
        <PostElement date={query.date} content={query.content} author={query.author} id={query.id} navigation={navigation} marg={10} tag={query.tag} type={"search"}/>
      )
    }
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.textInput1}
        placeholder={'Search by Tag/Author'}
        value={search}
        onChangeText={(searchText) => handleSearch(searchText)}
      />
      <ScrollView style={styles.flatListStyle} showsVerticalScrollIndicator={true}>
        <FlatList 
          data={data}
          renderItem={({item: elem}) =>  renderUsers(elem)}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </View>
  );
}