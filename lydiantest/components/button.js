import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert} from 'react-native'
import * as Updates from 'expo-updates';
const portfolioIcon = require("../assets/PortfolioIcon.png")
const accountIcon = require("../assets/Profile-PNG-Icon.png")
const logOutIcon = require("../assets/LogOutIcon.png")
const aboutIcon = require("../assets/AboutIcon.png")
const deleteIcon = require("../assets/DeleteAccountIcon.png")

import Data from '../Data'

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

function searchDocuments(collection, field, comparison, value){
  return new Promise((Resolve, Reject) => {
    db.collection(collection).where(field, comparison, value).get().then(snapshot => {
      if(!snapshot.empty){
        if (collection == "conversations"){
          db.doc(snapshot.docs[0].data().conversation).delete();
        }
        for (var i = 0; i < snapshot.size; i++){
          db.doc(collection + "/" + snapshot.docs[i].id).delete();
        }
        Resolve(true)
      } else {
        Reject(false)
      }
    })
  });
}

const showAlert = async () => new Promise ((Resolve) => {
  if (Platform.OS == "web"){
    alert("Are you sure you want to delete you account? Restart the app otherwise!")
    Resolve(true)
  }
  Alert.alert(
    'Alert!',
    'Are you sure you want to delete your account?',
    [
      {text: 'No', onPress: () => Resolve(false), style: 'cancel'},
      {text: 'Yes', onPress: () => Resolve(true)},
    ],
    { 
      cancelable: true 
    }
  )
});

async function handleDelete(button){
  const complete = await showAlert()
  if (!complete) {
    return;
  }
  
  const username = Data.UserData.username
  await searchDocuments("users", "username", "==", username).then(() => {
    searchDocuments('conversations', 'recipientOne', '==', username).then(() => {
      searchDocuments('conversations', 'recipientTwo', '==', username)
    }).catch(async () => {
      await searchDocuments('conversations', 'recipientTwo', '==', username)
    })
  })
  alert("Account Deleted!")
  button.navigation.navigate("Login")
}

const ButtonElement = (button) => {
  return (
    <TouchableOpacity style={styles.container} onPress = { async () => {
      if (button.type == "log out"){
        await Updates.reloadAsync().catch(() => {
          throw new Error("Error logging out, please restart the app.");
        })
      } else if (button.type == "delete") {
        handleDelete(button)
      } else {
        button.navigation.navigate(button.directTo)
      }
    }}>
      <View style={styles.buttonContainer}>
      {button.type == "portfolio" &&
        <Image style={{height: 20, width: 25}} source={portfolioIcon}/>
      }
      {button.type == "account" &&
        <Image style={{height: 25, width: 25}} source={accountIcon}/>
      }
      {button.type == "log out" &&
        <Image style={{height: 20, width: 25}} source={logOutIcon}/>
      }
      {button.type == "about" &&
        <Image style={{height: 25, width: 25}} source={aboutIcon}/>
      }
      {button.type == "delete" &&
        <Image style={{height: 25, width: 25}} source={deleteIcon}/>
      }
      {button.type != "portfolio" && button.type != "account" && button.type != "log out" && button.type != "about" && button.type != "delete" &&
        <View style={{
          width: 25,
          height: 25,
          backgroundColor: button.color ? button.color : '#000000',
          borderRadius: 60
        }}/>
      }
        <View>
          <Text style={{
            marginLeft: 20,
            color: button.color ? button.color : '#000000',
            fontSize: 18,
            fontWeight: button.bold ? 'bold' : undefined
          }}>{button.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center'
  },
  buttonContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default ButtonElement;