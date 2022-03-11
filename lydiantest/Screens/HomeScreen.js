import React, {useState, useEffect} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import PostElement from '../components/post'

import { useCollection } from '../Database';

import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

function grabPosts(navigation, state){
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    useCollection("posts", "date", "desc").then((dbData) => {
      let ran = 1
      dbData.map(async (doc) => {
        db.doc(doc.likes).get().then(async (snap1) => {
          doc.curLikes = snap1.data().users.length
          db.doc(doc.comments).get().then((snap2) => {
            doc.curComments = (snap2.data().messages.length)
            if (ran == dbData.length){
              setData(dbData)
              setLoading(false)
            }
            ran++
          })
        })
      })      
    })
  }, [navigation, state])
  
 return {loading, data}
}

export default function homeScreen({navigation}) {  
  const [state, setState] = useState(true)
  let {loading, data} = grabPosts(navigation, state)

  function refresh(){
    setState(!state)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => refresh())
    return unsubscribe;
  }, [navigation, data, loading]);

  const renderPosts = (post) => {
    return (
      <PostElement date={post.date} content={post.content} likes={post.curLikes} likesRef={post.likes} author={post.author} comments={post.curComments} id={post.id} navigation={navigation} marg={10} state={state} tag={post.tag}/>
    )
  }
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={true}>
      <SafeAreaView style={styles.buttonList}>
        <FlatList
          data={data}
          renderItem={({item: post}) => renderPosts(post)}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#E94F37" />
          <Text style={{ marginTop: 10, color: '#00000' }}>Loading</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = new StyleSheet.create({
  screen: {
    width: "100%",
    length: "100%",
    padding: 10,
    flexDirection: "column",
    flex: 1
  },
  section: {
    alignContent:"center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  text: {
    marginTop: 5,
    fontSize: 16,
    textAlign: "center"
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
})