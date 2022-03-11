import React, {useState} from 'react';
import { View, TouchableOpacity, Text} from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

export default function portFolioScreen({navigation}) {
  return (
    <View style={{alignItems:'center', justifyContent: 'center', backgroundColor: '#EEEEEE'}}>
      <TouchableOpacity>
        <Text>Portfolio</Text>
      </TouchableOpacity>
    </View>
  );
}