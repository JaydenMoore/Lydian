import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, ScrollView, KeyboardAvoidingView, TextInput, Keyboard} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import PostElement from '../components/post'
import CommentElement from '../components/comment'

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import Data from '../Data'

import {updateField, addDocument} from '../Database'

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

function grabPost(document, post, newMessage){
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    db.doc("posts/" + document).get().then(doc => {
      const dbData = doc.data()
      if (doc.exists){
        db.doc(dbData.likes).get().then((snap1) => {
          dbData.curLikes = (snap1.data().users.length)
          db.doc(dbData.comments).get().then((snap2) => {
            const snap2Data = snap2.data().messages
            let ran = 1
            if (snap2Data.length == 0) {
              dbData.curComments = snap2Data
              setData(dbData)
              setLoading(false)
            }
            snap2Data.map((comment) => {
              db.doc(comment.likes).get().then((snap3) => {
                comment.curLikes = (snap3.data().users.length)
                dbData.curComments = (snap2Data)
                if (ran == snap2Data.length){
                  setData(dbData)
                  setLoading(false)
                }
                ran++
              })
            })
          })
        })
      } else {
        alert("Error fetching post.")
      }
    })
  }, [document, post, newMessage])
  
  return {loading, data}
}

export default function postScreen({navigation}) {
  const post = useRoute().params;
  const [message, setMessage] = useState();
  const [newMessage, setNewMessage] = useState(false);
  const {loading, data} = grabPost(post.id, useRoute().params, newMessage)
  let postData = data ? data.curComments : []

  const handleAddComment = () => {
    addDocument("likes", {users: []}).then((id) => {
      updateField(data.comments, {message: message, date: new Date(), author: Data.UserData.username, likes: "likes/" + id}).then(() => {
        setMessage("")
        Keyboard.dismiss();
        setNewMessage(!newMessage)
      })
    })
  }

  const renderComment = (comment) => {
    return(
      <CommentElement content={comment.message} author={comment.author} created={comment.date} likes={comment.curLikes} likesRef={comment.likes}/>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.postContainer}>
      {data && (
        <PostElement date={data.date} content={data.content} likes={data.curLikes} likesRef={data.likes} author={data.author} comments={data.curComments.length} navigation={navigation} marg={20} type={"entire"} tag={data.tag}/>
      )}
        {!data && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color= "#E94F37" />
          <Text style={{ marginTop: 10, color: '#00000' }}>Loading</Text>
        </View>
        )}
        {data && (
        <SafeAreaView>
          <FlatList
            style={styles.commentList}
            data={postData}
            renderItem={({item: comment}) => renderComment(comment)}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
        )}
      </ScrollView>

      {data && (
      <KeyboardAvoidingView behavior={"height"} style={styles.createMessageWrapper}>
        <TextInput 
          style={styles.input} 
          placeholder={'Comment'} 
          value={message} 
          onChangeText={(text) => {
            setMessage(text)
          }}
        />

        <TouchableOpacity onPress={() => {handleAddComment()}}>
          <View style={styles.addWrapper}>
            <Ionicons name="send-sharp" color={"#FFFFFF"} size={20} />
          </View>
        </TouchableOpacity>
    </KeyboardAvoidingView>
    )}
    </View>
  );
}

const styles = new StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    width: "100%",
    length: "100%",
    padding: 0,
    flexDirection: "column",
    flex: 1
  },
  loading: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  commentList: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  createMessageWrapper: {
    marginTop: 'auto',
    paddingTop: 20,
    bottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
},
  input: {
    flex: 0.9,
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffff',
    borderRadius: 20,
    borderColor: '#E8E8E8',
    borderWidth: 1
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#E94F37',
    borderRadius: 60,
    justifyContent: 'center',
    flexdirection: "row",
    alignItems: 'center',
    borderColor: '#E8E8E8',
    borderWidth: 1
  },
  addText: {
    marginBottom: 3,
    color: '#ffff',
    fontSize: 30,
  },
})