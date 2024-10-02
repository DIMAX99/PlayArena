/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Registeration from './src/navigation/Registration';
import HomeScreen from './src/screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';


const stack=createStackNavigator();

function App(): React.JSX.Element {
  const [islogged,setislogged]=useState('false');
  const [loading,setloading]=useState(true);
  useEffect(()=>{
    const fetchdata=async()=>{
      try{
      const checklog=await AsyncStorage.getItem('isLoggedIn');
      setislogged(checklog??'');
      }catch(error){
        console.log(error);
      }finally{
        setloading(false);
      }
    }
    // const checksdata=fetchdata();
    // console.log(checksdata);
    fetchdata();
  },[]);
  if(loading){
    return(
      <View style={{backgroundColor:'black',height:'100%',alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:45,color:'white'}}>PlayArena</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown:false}} initialRouteName={islogged==='true'?'Homescreen':'Login'}>
        <stack.Screen name='Login' component={Login}/>
        <stack.Screen name='Register' component={Register}/>
        <stack.Screen name='Homescreen' component={HomeScreen}/>
      </stack.Navigator> 
    </NavigationContainer>
  );
}


export default App;