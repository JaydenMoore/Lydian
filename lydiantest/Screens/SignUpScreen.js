import React, { useState, useRef, useEffect } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, TextInput, Keyboard, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import Data from '../Data';

import { searchDocuments, addDocument, grabCollection} from '../Database';

export default function signUpScreen({ navigation }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [loading, setLoading] = useState();
  
  let activityIndicatorRef = useRef();

  function testInput(input) {
    return input != undefined && input != '' && input.replace(/ /g, '') != '';
  }

  function handleNewUser(){
    if (!testInput(username) && !testInput(password)){
      alert("Username and password have been left blank.");
      return
    } else if (!testInput(username)){
      alert("Username has been left blank.");
      return
    } else if (!testInput(password)){
      alert("Password has been left blank.");
      return
    }

    var special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (special.test(username)){
      alert("Special characters aren't allowed in usernames.");
      setPassword("")
      return
    } else if (username.length < 4){
      alert("Your username cannot be under 4 characters.")
      setPassword("")
      setUsername("")
      return
    } else if (password.length < 8){
      alert("Your password cannot be under 8 characters.");
      setPassword("")
      return
    } else if (username.length > 16){
      alert("Your usernmae cannot be over 16 characters.");
      setPassword("")
      setUsername("")
      return
    }

    searchDocuments("users", "username", "==", username).then((docs) => {
      alert("Username has already been taken.")
      setPassword("")
      setUsername("")
      return
    }).catch(() => {
      grabCollection("users", "username").then((length) => {
        addDocument("users", {password: password, username: username, userid: "" + (length + 1)}).then(() => {
          alert("Account Created! You can now login using your username and password.")
          navigation.navigate("Login");
        })
      })
    })
  }

  return (
    <View style={styles.Screen}>
      <Image
        style={styles.lydianLogo}
        source={require('../assets/LydianIcon.png')}
      />

      {!loading && (
      <View style={styles.inputContainer}> 
        <Text style={{fontSize: 25, marginTop: 30, color: "#00000", marginBottom: 20}}>Sign Up</Text>
        <TextInput
          style={styles.textInput1}
          placeholder={'Username'}
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInput2}
          placeholder={'Password'}
          value={password}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => {
            handleNewUser();
        }}>
          <Text style={styles.signInText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            navigation.navigate("Login")
        }}>
        <Text style={styles.signUpText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 14, marginTop: 70, color: "#00000", marginBottom: 25}}>Version {Data.Version}</Text>
      </View>
      )}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={{ marginTop: 10, color: '#FFFFFF' }}>Loading</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Screen: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lydianLogo: {
    marginTop: 30,
    height: 120,
    width: 120,
  },
  inputContainer: {
    flex: 0.5,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInput1: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    height: 40,
    width: 250,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  textInput2: {
    fontSize: 15,
    padding: 10,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    height: 40,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  signInButton: {
    marginTop: 70,
    backgroundColor: '#E94F37',
    padding: 20,
    width: 110,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  signUpButton: {
    marginTop: 15,
    padding: 20,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  signInText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  signUpText: {
    color: '#E94F37',
  },
  loading: {
    backgroundColor: '#E94F37',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
});