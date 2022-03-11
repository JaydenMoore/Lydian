import React, {useRef} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, FlatList, ScrollView, Image} from 'react-native';

import Data from '../Data'

import ProfileElement from '../components/profile'
import ButtonElement from '../components/button'

const buttons = [
  {
    name: 'Portfolio',
    directTo: 'Portfolio',
    id: 1,
    type: "portfolio"
  },
  {
    name: 'Notifications',
    directTo: 'Settings',
    id: 2
  },
  {
    name: 'Account',
    directTo: 'Account',
    id: 3,
    type: "account"
  },
  {
    name: 'Privacy',
    directTo: 'Settings',
    id: 4
  },
  {
    name: 'Theme',
    directTo: 'Settings',
    id: 5
  },
  {
    name: 'Settings',
    directTo: 'Settings',
    id: 6
  },
  {
    name: 'About',
    directTo: 'About',
    id: 7,
    type: "about"
  }
]

export default function friendScreen({navigation}) {
  const renderButtons = (button) => {
    return (
      <ButtonElement name={button.name} navigation={navigation} directTo={button.directTo} type={button.type}/>
    )
  }
  return (
  <View style={styles.Screen}>
    <ScrollView showsVerticalScrollIndicator={true}>
      <ProfileElement Username={Data.UserData.username}/>
      <SafeAreaView style={styles.buttonList}>
        <FlatList
          data={buttons}
          renderItem={({item: button}) => renderButtons(button)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttonList}>
        <ButtonElement name={'Log out'} navigation={navigation} directTo={'Login'} color={'#F52727'} bold={true} type={"log out"}/>
      </SafeAreaView>
      <View style={styles.bottom}/>
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
    Screen: {
      flex: 1,
      backgroundColor: '#EEEEEE',
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    buttonList: {
      backgroundColor: '#FFFFFF',
      marginTop: 10,
      justifyContent: "center",
      alignContent: "center",
      borderRadius: 10,
      paddingLeft: 10,
    },
    bottom: {
      marginBottom: 10,
    }
})