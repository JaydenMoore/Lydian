import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { useState, useEffect } from 'react';
const accountIcon = require("../assets/Profile-PNG-Icon.png")

import Data from '../Data'

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const CommentElement = (comment) => {
  const date = new Date(comment.created.seconds * 1000).toLocaleString()
  const today = date.substring(0,10) == new Date().toLocaleString('en-US').substring(0,10);

  let msgTime = new Date(comment.created.seconds * 1000).toLocaleTimeString()
  let msgDate = new Date(comment.created.seconds * 1000).toLocaleDateString().substr(0,5)
  msgTime = msgTime.substring(1,2).includes(":") && !msgTime.includes("M") ? "0" + msgTime: msgTime; 
  msgTime = msgTime.substring(1,2).includes(":") ? "0" + msgTime : msgTime
  msgTime = parseInt(msgTime.substring(0,2)) > 12 ? "0" + (parseInt(msgTime.substring(0,2)) - 12) +  msgTime.substr(2) + " PM" : msgTime
  msgTime = msgTime.includes("M") ? msgTime : msgTime + " AM" 
  msgTime = msgTime.substring(0,5) + msgTime.substring(8, msgTime.length)
  
  let time = msgTime.substr(0, date.length - 2) + msgTime.substr(date.length - 2).toLowerCase();

  const timestamp = !today ? msgDate + " at " + time : "Today at " + time;

  const [color, setColor] = useState("#B1B1B1")
  const [likes, setLikes] = useState(comment.likes)
  const [liked, setLiked] = useState(false)

  function inverseColor(num){
    setColor(color == "#B1B1B1" ? "#E94F37" : "#B1B1B1")
    setLikes(likes - num)
    setLiked(num ? false : liked)
  }

  useEffect(() => {
    db.doc(comment.likesRef).get().then((snap) => {
      if (snap.data().users.includes(Data.UserData.username)){
        setColor("#E94F37")
        setLikes(comment.likes)
        return
      } else {
        setColor("#B1B1B1")
      }
    })
  }, [comment])

  function handleLike(){
    if (liked == false){
      setLiked(true)
      db.doc(comment.likesRef).get().then((snap) => {
        const users = snap.data().users
        if (snap.data().users.includes(Data.UserData.username)){
          users.splice(users.indexOf(Data.UserData.username), 1)
          db.doc(comment.likesRef).update({
            users: users
          })
          inverseColor(1);
          
          return
        } else {
          users.unshift(Data.UserData.username)
          db.doc(comment.likesRef).update({
            users: users
          })
          inverseColor(-1)
        }
      })
    }
  }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <Image style={styles.image} source={require('../assets/Profile-PNG-Icon.png')}/>
            <Text style={styles.messageSender}>{comment.author}</Text>
            <Text style={{color: '#000000', fontSize: 10}}>{timestamp}</Text>              
        </View>
        <Text style={styles.messageText}>{comment.content}</Text> 
        <View style={styles.footer}>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity delayPressIn={10000} onPress={() => {handleLike()}}>
            <Image style={{height: 20, width: 20, backgroundColor: color}} source={require('../assets/LikesIcon.png')}/>
          </TouchableOpacity>
          <Text style={{alignSelf: "center", marginLeft: 5, fontSize: 12}}>{likes} {likes == 1 ? "Like" : "Likes"}</Text>
        </View>
      </View>
      </View>
    );
}

/*
return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <View style={styles.profilePicture}/>
                <View style={styles.messageTextContainer}>
                    <View style={styles.messageHeader}>
                        <Text style={styles.messageSender}>{comment.author}</Text>
                        <Text style={{color: '#000000', fontSize: 10}}>{timestamp}</Text>
                    </View>
                    <Text style={styles.messageText}>{comment.content}</Text>
                </View>                
            </View>
        </View>
    );*/

const styles = StyleSheet.create({
    container: {
      shadowColor: '#000',
      shadowOffset: { width: 0.5, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 2,
      backgroundColor: "#FFFFFF", 
      padding: 10, 
      borderRadius: 10,
      marginBottom: 15
    },
    header: {
      flexDirection: "row",
    },
    image: {
      height: 30, 
      width: 30,
      alignSelf: "center",
      borderWidth: 2,
      borderColor: '#EEEEEE',
      borderRadius: 60,
    },
    messageSender: {
      color: '#000000',
      fontSize: 14,
      marginLeft: 10,
      flex: 1
    },
    messageText: {
      paddingTop: 4,
      color: '#000000',
      fontSize: 14,
    },
    footer: {
      marginTop: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }
})

export default CommentElement;