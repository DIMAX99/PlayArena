import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import React, { useState } from "react";
import { View,Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import HomeDrawer from "./homedrawer";
import Home from "../screens/Home";


const stack=createNativeStackNavigator();

const Login_register_nav=()=>{
    return(
        <stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
            <stack.Screen name={'Login'} component={Login}/>
            <stack.Screen name={'Register'} component={Register}/>
            <stack.Screen name={'HomeDrawer'} component={HomeDrawer}/>
        </stack.Navigator>
    );
   
}

export default Login_register_nav;