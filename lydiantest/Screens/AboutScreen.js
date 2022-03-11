import React, {useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

import Data from '../Data'

import dependencies from '../dependencies.js'

export default function aboutScreen({navigation}) {
  const depends = [...dependencies]
  
  const renderItems = (item) => {
    return <Text style={styles.text}>{item.item.name}</Text>
  }

  return (
    <View style={styles.screen}>
     <View style={styles.section}>
        <Text style={styles.title}>Lydian</Text>
        <Text style={styles.text}>Version {Data.Version}</Text>
      </View>
    <View style={styles.section}>
        <Text style={styles.title}>Purpose</Text>
        <Text style={styles.text}>Social media app designed to connect composers/producers to each other. Lydian also serves the additional purpose of connecting music creators to developers and/or programmers.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Last Updated</Text>
        <Text style={styles.text}>10/28/21</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Dependencies</Text>
        <SafeAreaView style={styles.conversationList}>
          <FlatList
            data={depends}
            renderItem={(item) => renderItems(item)}
            keyExtractor={item => item}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = new StyleSheet.create({
  screen: {
    width: "100%",
    length: "100%",
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
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
  }
})