import React, { useState, useRef, useEffect } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, TextInput, Keyboard, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import Data from '../Data';

import { updateData } from '../Data';

import { searchDocuments, getFromRef } from '../Database';

export default function loginScreen({ navigation }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [querying, setQuerying] = useState(false);

  const [loading, setLoading] = useState();
  
  let activityIndicatorRef = useRef();

  function reset() {
    setUsername('');
    setPassword('');
    setQuerying(false)
  }

  function testInput(input) {
    return input != undefined && input != '' && input.replace(/ /g, '') != '';
  }

  function finishLogin(d1, d2) {
    updateData(d1, d2).then(() => {
      Data.UserData.username = username;
      Data.UserData.userId = '1';
      setLoading('true');
      reset();
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 2000);
    });
  }

  const handleUserAndPass = () => {
    if (querying){
      return
    }

    let dataOne = {}
    let dataTwo = {}

    Keyboard.dismiss();
    if (testInput(username) && testInput(password)) {
      searchDocuments('users', 'username', '==', username).then((data) => {
        if (data[0].password == password) {
          searchDocuments('conversations', 'recipientOne', '==', username).then((data) => {
            dataOne = ([...data.map((element)=> [element.recipientTwo, element.conversation])]);
            searchDocuments('conversations', 'recipientTwo', '==', username).then((data1) => {
              dataTwo = [...data1.map((element)=> [element.recipientOne, element.conversation])];
              finishLogin(dataOne, dataTwo);
            }).catch(() => {
              finishLogin(dataOne, dataTwo);
            });
          }).catch(() => {
            searchDocuments('conversations', 'recipientTwo', '==', username).then((data2) => {
              dataTwo = ([...data2.map((element)=> [element.recipientOne, element.conversation])]);
              finishLogin(dataOne, dataTwo);
            }).catch((err) => {
              finishLogin(dataOne, dataTwo)
            });
          });
        } else {
          alert('Incorrect Password!');
          reset();
        }
      }).catch((err) => {
        alert('Username does not exist!');
        reset();
      });
    } else if (!testInput(password) && !testInput(username)){
      alert("Your Username and password have been left blank.")
      reset();
      return
    } else if (testInput(password)) {
      console.log("ae")
      alert('Your username was left blank.');
      reset();
      return;
    } else if (testInput(username)) {
      console.log("ae")
      alert('Your password was left blank.');
      reset();
      return;
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        style={styles.lydianLogo}
        source={require('../assets/LydianIcon.png')}
      />

      {!loading && (
      <View style={styles.inputContainer}>
        <Text style={{fontSize: 25, marginTop: 30, marginBottom: 20, color: "#00000"}}>Login</Text>
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
            handleUserAndPass();
        }}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            navigation.navigate("Sign up")
        }}>
        <Text style={styles.signUpText}>Sign up</Text>
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
  screen: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  lydianLogo: {
    marginTop: 30,
    height: 120,
    width: 120
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
    zIndex: 1
  },
  signUpButton: {
    marginTop: 15,
    padding: 20,
    width: 110,
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