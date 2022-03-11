import React, {useState, useEffect} from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, SafeAreaView, FlatList, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Data from '../Data'

import ConversationElement from '../components/conversation'

import firebase from 'firebase';
import 'firebase/firestore';
import { searchDocuments } from '../Database';

const db = firebase.firestore()

export default function messagesScreen({navigation}) {  
  const [state, setState] = useState()

  function refresh(){
    setState(!state)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => refresh())
    return unsubscribe;
  }, [navigation, refresh]);

  const handleAddConversation = () => {
    navigation.navigate("Start Conversation")
  }

  const renderConversations = (conversation) => {
    const conv = conversation.item
    return (
      <ConversationElement index={conversation.index} messages={conv[1]} user={conv[0]} navigation={navigation} directTo={'Messaging'}/>
    )
  }
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.conversationList}>
        <FlatList
          data={Data.Conversation}
          renderItem={(item) => renderConversations(item)}
          keyExtractor={item => item.index}
          extraData={state, Data}
        />
      </SafeAreaView>
      <View style={{alignItems: "center", justifyContent: "center", marginTop: 'auto'}}>
        <TouchableOpacity style={styles.startConv} onPress={() => {handleAddConversation()}}>
          <Text style={styles.text}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  conversationList: {
    width: '100%'
  },
  startConv: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems:'center', 
    justifyContent: 'center',
    backgroundColor: "#E94F37",
    bottom: 5
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
  }
})