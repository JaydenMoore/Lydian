import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform} from 'react-native'

import Data from '../Data';
import { addDocument, searchDocuments } from '../Database';

import { updateData } from '../Data';

const UserElement = (user) => {
  const finishUpdate = (d1, d2) => {
    updateData(d1, d2).then(() => {
      user.navigation.navigate("Messages")
    })
  }

  const showAlert = async () => new Promise ((Resolve) => {
    if (Platform.OS == "web"){
      alert("Starting a conversation with " + user.username + "!")
      Resolve(true)
    }
    Alert.alert(
      'Hey There!',
      'Are you sure you want to start a conversation with ' + user.username + "?",
      [
        {text: 'No', onPress: () => Resolve(false), style: 'cancel'},
        {text: 'Yes', onPress: () => Resolve(true)},
      ],
      { 
        cancelable: true 
      }
    )
  });

  const handleNewConversation = async () => {
    for (var i = 0; i < Data.Conversation.length; i++){
      if (user.username == Data.Conversation[i][0]){
        alert("You already have a conversation with this user!")
        return
      }
    }

    const complete = await showAlert()
    if (!complete) {
      return;
    }
    
    let dataOne = [];
    let dataTwo = [];
    const username = Data.UserData.username

    addDocument("messages", {messages: []}).then((id) => {
      addDocument("conversations", {recipientOne: Data.UserData.username, recipientTwo: user.username, conversation: "messages/" + id}).then(() => {
        searchDocuments('conversations', 'recipientOne', '==', username).then((data) => {
          dataOne = ([...data.map((element)=> [element.recipientTwo, element.conversation])]);
          searchDocuments('conversations', 'recipientTwo', '==', username).then((data1) => {
            dataTwo = ([...data1.map((element)=> [element.recipientOne, element.conversation])]);
            finishUpdate(dataOne, dataTwo);
          }).catch(() => {
            finishUpdate(dataOne, dataTwo);
          });
        }).catch(() => {
          searchDocuments('conversations', 'recipientTwo', '==', username).then((data2) => {
            dataTwo = ([...data2.map((element)=> [element.recipientOne, element.conversation])]);
            finishUpdate(dataOne, dataTwo);
          }).catch((err) => {
            finishUpdate(dataOne, dataTwo);
          });
        });
      }) 
    })
    
    console.log(Data.UserData.username, user.username)
  }

  return(
    <TouchableOpacity style={styles.container} onPress={() => {handleNewConversation()}}>
      <View style={{flex: 0.3,}}>
        <Image style={{height: 40, width: 40, borderRadius: 60}} source={require('../assets/Profile-PNG-Icon.png')}/>
      </View>
      <Text style={{flex: 0.7, fontSize: 18}}>{user.username}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E8E8",
    borderWidth: 2,
    marginBottom: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-around"
  },
})

export default UserElement;