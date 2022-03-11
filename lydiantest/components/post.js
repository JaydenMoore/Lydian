import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import Data from '../Data';
import { updateField } from '../Database';
import { useState, useEffect } from 'react';
const accountIcon = require("../assets/Profile-PNG-Icon.png")

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const PostElement = (post) => {
  const date = new Date(post.date.seconds * 1000).toLocaleString()
  const today = date.substring(0,10) == new Date().toLocaleString('en-US').substring(0,10);

  let msgTime = new Date(post.date.seconds * 1000).toLocaleTimeString()
  let msgDate = new Date(post.date.seconds * 1000).toLocaleDateString().substr(0,5)
  msgTime = msgTime.substring(1,2).includes(":") && !msgTime.includes("M") ? "0" + msgTime: msgTime; 
  msgTime = msgTime.substring(1,2).includes(":") ? "0" + msgTime : msgTime
  msgTime = parseInt(msgTime.substring(0,2)) > 12 ? "0" + (parseInt(msgTime.substring(0,2)) - 12) +  msgTime.substr(2) + " PM" : msgTime
  msgTime = msgTime.includes("M") ? msgTime : msgTime + " AM" 
  msgTime = msgTime.substring(0,5) + msgTime.substring(8, msgTime.length)
  
  let time = msgTime.substr(0, date.length - 2) + msgTime.substr(date.length - 2).toLowerCase();

  const timestamp = !today ? msgDate + " at " + time : "Today at " + time;

  const styles = StyleSheet.create({
    container: {
      padding: post.marg,
      borderRadius: 5,
      backgroundColor: "#FFFFFF",
      borderColor: "#E8E8E8",
      borderWidth: 2,
      marginBottom: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0.5, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 2,
    },
    headerWrapper: {
      flexDirection: "row",
      alignItems: "center"
    },
    image: {
      height: 40, 
      width: 40,
      alignSelf: "center",
      borderWidth: 2,
      borderColor: '#EEEEEE',
      borderRadius: 60,
    },
    postText: {
      marginTop: post.marg
    },
    tag: {
      marginTop: post.marg - 10,
      width:"100%"
    },
    tagText: {
      color: "#3F88C5"
    },
    footer: {
      marginTop: post.marg - 3,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }
  })

  const [color, setColor] = useState("#B1B1B1")
  const [likes, setLikes] = useState(post.likes)
  const [refresh, setRefresh] = useState(false)

  function inverseColor(){
    setColor(color == "#B1B1B1" ? "#E94F37" : "#B1B1B1")
  }

  function handleTagFilter(){
    post.navigation.navigate("Search", {tag: post.tag})
  }

  useEffect(() => {
    if (post.type == "search"){
      return
    }
    db.doc(post.likesRef).get().then((snap) => {
      if (snap.data().users.includes(Data.UserData.username)){
        setColor("#E94F37")
        setLikes(post.likes)
        return
      } else {
        setColor("#B1B1B1")
        setLikes(post.likes)
      }
    })
  }, [post, post.state])

  function handleLike(){
    db.doc(post.likesRef).get().then((snap) => {
      const users = snap.data().users
      if (snap.data().users.includes(Data.UserData.username)){
        users.splice(users.indexOf(Data.UserData.username), 1)
        db.doc(post.likesRef).update({
          users: users
        })
        inverseColor();
        console.log(post.likes, "ae")
        setLikes(likes - 1)
      } else {
        users.unshift(Data.UserData.username)
        db.doc(post.likesRef).update({
          users: users
        })
        inverseColor()
        setLikes(likes + 1)
      }
    })
  }

  const postNavigation = () => {
    post.navigation.navigate("Post", {id: post.id})
  }

  if (post.type == "search"){
    return(
      <TouchableOpacity style={styles.container} onPress={() => {postNavigation()}}>
        <View>
          <View style={styles.headerWrapper}>
            <View style={{ flexDirection: "row", alignContent: "center"}}>
              <Image style={styles.image} source={require('../assets/Profile-PNG-Icon.png')}/>
              <View style={{alignContent: "center", marginLeft: 10}}>
                <Text style={{fontSize: 14}}>{post.author}</Text>
                <Text style={{fontSize: 10}}>{timestamp}</Text>
              </View>
            </View>
          </View>
          <View style={styles.postText}>
            <Text>{post.content}</Text>
          </View>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{post.tag}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (post.type == "entire"){
    return(
    <View style={styles.container}>
      <View>
        <View style={styles.headerWrapper}>
          <View style={{ flexDirection: "row", alignContent: "center"}}>
            <Image style={styles.image} source={require('../assets/Profile-PNG-Icon.png')}/>
            <View style={{alignContent: "center", marginLeft: 10}}>
              <Text style={{fontSize: 14}}>{post.author}</Text>
              <Text style={{fontSize: 10}}>{timestamp}</Text>
            </View>
          </View>
        </View>
        <View style={styles.postText}>
          <Text>{post.content}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.tag} onPress={() => handleTagFilter()}>
        <Text style={styles.tagText}>{post.tag}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity delayPressIn={10000} onPress={() => {handleLike()}}>
            <Image style={{height: 30, width: 30, backgroundColor: color}} source={require('../assets/LikesIcon.png')}/>
          </TouchableOpacity>
          <Text style={{alignSelf: "center", marginLeft: 8}}>{likes}</Text>
        </View>
        <View>
          <Text>{post.comments} {post.comments != 1 ? "Comments" : "Comment"}</Text>
        </View>
      </View>
    </View>
  );
  }
  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {postNavigation()}}>
        <View style={styles.headerWrapper}>
          <View style={{ flexDirection: "row", alignContent: "center"}}>
            <Image style={styles.image} source={require('../assets/Profile-PNG-Icon.png')}/>
            <View style={{alignContent: "center", marginLeft: 10}}>
              <Text style={{fontSize: 14}}>{post.author}</Text>
              <Text style={{fontSize: 10}}>{timestamp}</Text>
            </View>
          </View>
        </View>
        <View style={styles.postText}>
          <Text>{post.content}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tag} onPress={() => handleTagFilter()}>
        <Text style={styles.tagText}>{post.tag}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <View style={{flex: 1, flexDirection: "row"}}>
          <TouchableOpacity delayPressIn={10000} onPress={() => {handleLike()}}>
            <Image style={{height: 25, width: 25, backgroundColor: color}} source={require('../assets/LikesIcon.png')}/>
          </TouchableOpacity>
          <Text style={{alignSelf: "center", marginLeft: 5}}>{likes}</Text>
        </View>
        <TouchableOpacity onPress={() => {postNavigation()}}>
          <Text>{post.comments} {post.comments != 1 ? "Comments" : "Comment"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PostElement;