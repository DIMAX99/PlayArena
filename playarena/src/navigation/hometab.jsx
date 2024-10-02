import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Turf from "../screens/Turf";
import MyBookings from "../screens/MyBookings";
import HomeBookStack from "./homebookstack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const tab=createBottomTabNavigator();

const HomeTabNav=()=>{
    return(
        <tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'seagreen',tabBarInactiveTintColor:'grey',tabBarStyle:{paddingBottom:2}}} >
            <tab.Screen name={'turfs'} options={{tabBarIcon:({color,size})=>{
                return(
                    <MaterialCommunityIcons name={'map-search-outline'} style={{color:color}} size={size}/>
                );
            },tabBarLabelStyle:{fontSize:12},tabBarLabel:'Turf'}} component={HomeBookStack}/>
            <tab.Screen name={'Bookings'} options={{tabBarIcon:({color,size})=>{
                return(
                    <MaterialCommunityIcons name={'calendar-month'} color={color} size={size}/>
                );
            },tabBarLabelStyle:{fontSize:12},tabBarLabel:'My Bookings'}} component={MyBookings}/>
        </tab.Navigator>
    )
}
export default HomeTabNav;