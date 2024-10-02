import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Booking from "../screens/manageturf/booking";
import Earnings from "../screens/manageturf/earning";

const tab=createBottomTabNavigator();

const ManageBook=({id})=>{
    return(
        <tab.Navigator screenOptions={{headerShown:false}}>
            <tab.Screen name="Bookings" component={Booking} initialParams={{id:id}}/>
            <tab.Screen name="Collection" component={Earnings} initialParams={{id:id}}/>
        </tab.Navigator>
    );
}
export default ManageBook;