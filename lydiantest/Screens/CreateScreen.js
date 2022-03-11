import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';

import Data from '../Data';

import {addDocument} from '../Database'

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

export default function createScreen({navigation}) {
  const [post, setPost] = useState("");
  const [tag, setTag] = useState("");
  const [color, setColor] = useState("#000000")
  let sending = false

  const styles = StyleSheet.create({
    screen: {
      width: "100%",
      height: "100%",
      flexDirection: "column",
    },
    textInput1: {
      padding: 10,
      textAlignVertical: "top",
      paddingTop: 12,
      backgroundColor: '#FFFFFF',
      height: 50,
      width: "100%",
      fontSize: 16,
      borderBottomWidth: 2,
      borderBottomColor: "#E8E8E8",
      alignItems: "flex-start",
      color: color
    },
    textInput2: {
      textAlignVertical: "top",
      padding: 10,
      flex: 1,
      paddingTop: 12,
      backgroundColor: '#FFFFFF',
      width: "100%",
      fontSize: 16,
    },
    footer: {
      marginTop: "auto",
      flexDirection: "row",
      alignItems: "center",
    },
    create: {
      flex: 1,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#E94F37",
    },
    createText: {
      color: "#FFFFFF",
      fontWeight: "bold"
    }
  })

  const handlePost = (text) => {
    setPost(text)
    if (text.length == 250) {
      alert("Your post message cannot be over 250 characters!")
    }
  }

  const handleTag = (tagText) => {
    if (tagText.charAt(0) == "#" && color != "#3F88C5"){
      setColor("#3F88C5")
    } else if (tagText.charAt(0) != "#" && color != "#000000") {
      setColor("#000000")
    }
    setTag(tagText)
    if (tagText.length == 16) {
      alert("Your tag cannot be over 16 characters!")
    }
  }

  const handleNewPost = () => {
    if (!tag.includes("#")){
      alert("Your tag must begin with a '#'")
      setTag("")
      return
    } else if (post ==  undefined || post == '' || post.replace(/ /g, "") == "") {
      alert("Your post text is empty")
      return
    } else if (post.length < 16) {
      alert("Your post is too short!")
      return
    }

    if (sending == false){
      sending = true
      addDocument("likes", {users: []}).then((likeId) => {
        addDocument("comments", {messages: []}).then((commentId) => {
          addDocument("posts", {author: Data.UserData.username, comments: "comments/" + commentId, content: post, date: new Date(), likes: "likes/" + likeId, tag: tag}).then(() => {
            alert("Your post has been created!")
            navigation.navigate("Home")
          })
        })
      })
    }
    
  }

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.textInput1}
        maxLength={16}
        placeholder={'#Tag (Optional)'}
        value={tag}
        onChangeText={(tagText) => handleTag(tagText)}
      />
      
      <TextInput
        multiline={true}
        numberOfLines={10}
        style={styles.textInput2}
        maxLength={250}
        placeholder={'Type your post message here'}
        value={post}
        onChangeText={(text) => handlePost(text)}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.create} onPress={() => handleNewPost()}>
          <Text style={styles.createText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}