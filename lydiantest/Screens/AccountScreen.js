import React, {useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, SafeAreaView, Image} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import Data from '../Data'

import ButtonElement from '../components/button'

const accountIcon = require("../assets/Profile-PNG-Icon.png")

const buttons = [
  {
    name: 'Change Username',
    directTo: 'Settings',
    id: 1,
  },
  {
    name: 'Change Password',
    directTo: 'Settings',
    id: 2,
  },
]

export default function aboutScreen({navigation}) {
  const renderButtons = (button) => {
    return (
      <ButtonElement name={button.name} navigation={navigation} directTo={button.directTo} type={button.type}/>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.section}>
        <Text style={styles.title}>{Data.UserData.username}</Text>
        <Image style={styles.image} source={accountIcon}/>
      </View>
      <Text style={styles.title}>Account Settings</Text>
      <SafeAreaView style={styles.buttonList1}>
        <FlatList
          data={buttons}
          renderItem={({item: button}) => renderButtons(button)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonList}>
        <ButtonElement name={'Delete Account'} navigation={navigation} directTo={'Login'} color={'#F52727'} bold={true} type={"delete"}/>
      </SafeAreaView>
      </View>
  );
}

const styles = new StyleSheet.create({
  screen: {
    width: "100%",
    length: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  section: {
    borderRadius: 6,
    paddingTop: 20,
    alignContent:"center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF"
  },
  title: {
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  image: {
    marginTop: 20,
    height: 120, 
    width: 120,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: '#EEEEEE',
    borderRadius: 60,
    marginBottom: 40
  },
  buttonList: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 10
  },
  buttonList1: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 10
  },
})