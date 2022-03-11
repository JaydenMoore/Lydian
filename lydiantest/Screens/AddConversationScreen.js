import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, SafeAreaView, FlatList, ScrollView} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';

import UserElement from '../components/user'
import Data from '../Data';

import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore();

export default function addConversationScreen({navigation}) {
  const [username, setUsername] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    db.collection("users").orderBy("username").onSnapshot((snapshot) => {
      const dbData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setData(dbData)
      return
    })
    setData()
  }, [username])

  const renderUsers = (user) => {
    if (username == undefined || !user.username.toLowerCase().includes(username.toLowerCase()) || username == "" || user.username == Data.UserData.username){
      return
    }
    
    return(
      <UserElement username={user.username} navigation={navigation}/>
    )
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.textInput1}
        placeholder={'Search Username'}
        value={username}
        onChangeText={(username) => setUsername(username)}
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
  },
  flatListStyle: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  }
})