import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'

const ConversationElement = (Conversation) => {
  return(
    <TouchableOpacity style={styles.profileBackground} onPress={() => {
      Conversation.navigation.navigate(Conversation.directTo, {index: Conversation.index, messages: Conversation.messages, author: Conversation.author});
    }}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePicture}>
          <Image style={{height: 45, width: 45, borderRadius: 60}} source={require('../assets/Profile-PNG-Icon.png')}/>
        </View>
        <View>
          <Text style={styles.profileName}>{Conversation.user}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileBackground: {
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    width: '100%'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profilePicture: {
    marginLeft: 10,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginLeft: 30,
    paddingVertical: 8,
    fontSize: 18
  }
})

export default ConversationElement;