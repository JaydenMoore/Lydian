import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Keyboard, FlatList, SafeAreaView, SectionList} from 'react-native';
import MessageElement from '../components/message.js'
import { NavigationContainer } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import firebase from 'firebase';
import 'firebase/firestore';

import { updateField } from '../Database';

import Data from '../Data'

const User = Data.UserData

const db = firebase.firestore()

function useCollection(collection, doc){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection(collection).doc(doc).onSnapshot((snapshot) => {
      setData(snapshot.data())
      setLoading(false)
    })
  }, [collection, doc])

return {loading, data}
}

export default function messagingScreen({navigation}) {
  const params = useRoute().params;
  const [message, setMessage] = useState();
  const flatListRef = useRef();
  let {loading, data} = useCollection("messages", params.messages.substring(9), flatListRef);

  //Adds message to table then react auto refreshes
  const handleAddMessage = () => {
    Keyboard.dismiss();
    if (message !=  undefined && message != '' && message.replace(/ /g, "") != ""){
      updateField(params.messages, {message: message, created: new Date(), author: User.username, index: data.messages.length}).then(() => {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({animated: false})
        })
      })
    }
    setMessage('');
  }

  const renderMessages = (message) => {
    const userIsClient = message.author == User.username;
      return(
        <MessageElement key={message.id} Text={message.message} SenderUsername={userIsClient ? "Me" : message.author} Color={(!userIsClient) ? "#c72e16" : undefined} Created={message.created}/>
      )
    }  

  return (
    <View style={styles.Screen}>
      {/*Message Formatting*/}
      <View style={styles.emptyConversation}>
           {data.messages != undefined && data.messages.length == 0 && <Text style={{fontSize: 20}}>No message history :(</Text>}
        </View>
      <View style={styles.messagesWrapper}>
      {/*Contains list of messages*/}
        <View style={styles.messageList}>
          <SafeAreaView style={styles.container}>
            { 
              <FlatList 
                  ref={flatListRef}
                  style={styles.FlatListStyle} showsVerticalScrollIndicator={false}
                  data={data.messages}
                  renderItem={({item: message}) =>  renderMessages(message)}
                  keyExtractor={item => item.id}
                  extraData={data}
              />
            }
          </SafeAreaView>
        </View>
      </View>
      
      <KeyboardAvoidingView behavior={"height"} style={styles.createMessageWrapper}>
        <TextInput 
          style={styles.input} 
          placeholder={'Message'} 
          value={message} 
          onChangeText={(text) => {
            setMessage(text)
          }}
          onFocus={() => {
            setTimeout(() => {
              flatListRef.current.scrollToEnd({animated: true})
            }, 400)
          }}
        />

        <TouchableOpacity onPress={() => {handleAddMessage()}}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>&gt;</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  messagesWrapper: {
    paddingHorizontal: 20
  },
  messageList: {
    paddingTop: 20,
    padding: 5,
    marginBottom: 50
  },
  FlatListStyle: {
    marginBottom: 25
  },
  createMessageWrapper: {
    position: 'absolute',
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
    alignItems: 'center',
    borderColor: '#E8E8E8',
    borderWidth: 1
  },
  addText: {
    marginBottom: 3,
    color: '#ffff',
    fontSize: 30,
  },
  emptyConversation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '88%',
    width: "100%"
  }
});