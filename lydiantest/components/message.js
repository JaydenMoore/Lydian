import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

const MessageElement = (message) => {
  const date = new Date(message.Created.seconds * 1000).toLocaleString()
  const today = date.substring(0,10) == new Date().toLocaleString('en-US').substring(0,10);

  let msgTime = new Date(message.Created.seconds * 1000).toLocaleTimeString()
  let msgDate = new Date(message.Created.seconds * 1000).toLocaleDateString().substr(0,5)
  msgTime = msgTime.substring(1,2).includes(":") && !msgTime.includes("M") ? "0" + msgTime: msgTime; 
  msgTime = msgTime.substring(1,2).includes(":") ? "0" + msgTime : msgTime
  msgTime = parseInt(msgTime.substring(0,2)) > 12 ? "0" + (parseInt(msgTime.substring(0,2)) - 12) +  msgTime.substr(2) + " PM" : msgTime
  msgTime = msgTime.includes("M") ? msgTime : msgTime + " AM" 
  msgTime = msgTime.substring(0,5) + msgTime.substring(8, msgTime.length)
  
  let time = msgTime.substr(0, date.length - 2) + msgTime.substr(date.length - 2).toLowerCase();

  const timestamp = !today ? msgDate + " at " + time : "Today at " + time;
    return (
        <View style={{backgroundColor: message.Color ? message.Color : "#E94F37", padding: 10, borderRadius: 10,marginBottom: 15}}>
            <View style={styles.messageContainer}>
                <View style={styles.profilePicture}>
                    <TouchableOpacity></TouchableOpacity>
                </View>
                <View style={styles.messageTextContainer}>
                    <View style={styles.messageHeader}>
                        <Text style={styles.messageSender}>{message.SenderUsername}</Text>
                        <Text style={{color: '#ffff', fontSize: 12}}>{timestamp}</Text>
                    </View>
                    <Text style={styles.messageText}>{message.Text}</Text>
                </View>                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageTextContainer: {
        paddingLeft: 10,
        flex: 1,
    },
    profilePicture: {
        width: 40,
        height: 40,
        backgroundColor: '#ffff',
        borderRadius: 40
    },
    messageSender: {
        color: '#ffff',
        fontSize: 14,
        fontWeight: 'bold',
        flex: 0.99
    },
    messageText: {
        paddingTop: 4,
        color: '#ffff',
        fontSize: 14,
    },
    messageHeader: {
      flex: 1,
      flexDirection: "row"
    }
    
})

export default MessageElement;