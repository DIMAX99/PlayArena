
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState ,useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text,Button, TextInput } from 'react-native';
import Login_register_nav from './src/navigation/loginandreg';







function App(): React.JSX.Element {

  return (
   <NavigationContainer>
    <Login_register_nav/>
   </NavigationContainer>
  );
}


export default App;
