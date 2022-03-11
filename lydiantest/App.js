import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import directory from './directory'

const defaultOption = {
  headerStyle: {
    backgroundColor: '#E94F37'
  },
  headerTitleStyle: {
    fontSize: 24,
    align: 'center',
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
  headerTintColor: '#fff',
  headerShown: true,
}

const defaultOption1 = {
  headerStyle: {
    backgroundColor: '#E94F37'
  },
  headerTitleStyle: {
    fontSize: 0,
  },
  headerTintColor: '#fff',
  headerShown: true,
  tabBarOptions:{
    style:{
      backgroundColor: '#000000'
    }
  }
}

const HomeNavigation = () => {
  return (
    <Tab.Navigator tabBarOptions={{keyboardHidesTabBar: true}} screenOptions={defaultOption}>
      <Tab.Screen name="Home" component={directory.homeScreen}
      options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" color={color} size={size} />
      )}}
      />
      <Tab.Screen name="Search" component={directory.searchScreen}
      options={{
      tabBarIcon: ({ color, size }) => (
        <FontAwesome name="search" color={color} size={size} />
      )}}
      />
      <Tab.Screen name="Create Post" component={directory.createScreen}
      options={{
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="create" color={color} size={size} />
      ),
      }}
      />
      <Tab.Screen name="Messages" component={directory.messagesScreen} 
      options={{
      tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="message" color={color} size={size} />
      )}}
      />
      <Tab.Screen name="Profile" component={directory.profileScreen}
      options={{
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="person" color={color} size={size} />
      )}}
      />
    </Tab.Navigator>
  );
}

const Screens = () => {
  return(
      <Stack.Navigator>
      
      {
      //{Login Screen}
        <Stack.Screen 
          name="Login" 
          component={directory.loginScreen}
          options={{headerShown: false}}
        />
      }
      {/*Home Screen*/}
        <Stack.Screen
          name="Home"
          component={HomeNavigation}
          options={{headerShown: false}}
        />
      
      {/*Messaging Screen*/}
        <Stack.Screen 
          name="Messaging" 
          component={directory.messagingScreen}
          options={defaultOption}
        />

      {/*Settings Screen*/}
        <Stack.Screen 
          name="Settings" 
          component={directory.settingsScreen}
          options={defaultOption}
        />
      
      {/*AddConversations Screen*/}
        <Stack.Screen 
          name="Start Conversation" 
          component={directory.addConversationScreen}
          options={defaultOption}
        />

      {/*SignUp Screen*/}
        <Stack.Screen 
          name="Sign up" 
          component={directory.signUpScrsen}
          options={{headerShown: false}}
        />

      {/*About Screen*/}
        <Stack.Screen 
          name="About" 
          component={directory.aboutScreen}
          options={defaultOption}
        />
      {/*Portfolio Screen*/}
        <Stack.Screen 
          name="Portfolio" 
          component={directory.portfolioScreen}
          options={defaultOption}
        />
      {/*Account Screen*/}
        <Stack.Screen 
          name="Account" 
          component={directory.accountScreen}
          options={defaultOption}
        />
      {/*Post Screen*/}
        <Stack.Screen 
          name="Post" 
          component={directory.postScreen}
          options={defaultOption}
        />
      </Stack.Navigator>
  );
}

export default function App() {
  return(
    <NavigationContainer>
      <Screens/>
    </NavigationContainer>
  )
}