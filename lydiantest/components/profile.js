import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'

const ProfileElement = (user) => {
  return(
    <View style={styles.profileBackground}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePicture}>
          <TouchableOpacity onPress={() => {
              alert("This button will change your profile picture")
          }}>
            <Image style={{height: 73, width: 73, borderRadius: 60}} source={require('../assets/Profile-PNG-Icon.png')}/>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.profileName}>{user.Username}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileBackground: {
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center'
  },
  profileContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  profilePicture: {
    borderRadius: 60,
    height: 75,
    width: 75,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    marginLeft: 40,
    fontSize: 18
  }
})

export default ProfileElement;