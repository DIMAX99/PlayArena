import 'react-native-gesture-handler';
import 'react-native-reanimated'
import 'react-native-screens'
import React, { useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TurfBooking from '../screens/TurfBooking';
import Turf from '../screens/Turf';
import { useNavigation } from '@react-navigation/native';
import Checkout from '../screens/Checkout';
import Turf_detail from '../screens/Turf_detail';

const stack=createNativeStackNavigator();



const HomeBookStack=()=>{
    return(
        <stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Turflist'>
            <stack.Screen name='Turflist' component={Turf}/>
            <stack.Screen name='Turf_Detail' component={Turf_detail}/>
            <stack.Screen name="Booking_Turf" component={TurfBooking} options={{headerShown:false,}}/>
            <stack.Screen name='Checkout' component={Checkout}/>
        </stack.Navigator>
    );
}
export default HomeBookStack;