import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Register from "../screens/Register";
import Login from "../screens/Login";
import HomeScreen from "../screens/Home";

const stack=createStackNavigator();

const Registeration=()=>{
    return(
        <NavigationContainer >
            <stack.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name='Login' component={Login}/>
                <stack.Screen name='Register1' component={Register}/>
                <stack.Screen name='HomeScreen' component={HomeScreen}/>
            </stack.Navigator>
        </NavigationContainer>
    );
}

export default Registeration;