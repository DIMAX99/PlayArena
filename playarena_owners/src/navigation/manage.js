import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Manage1 from "../screens/manageturf/managehome";
import Manage2 from "../screens/manageturf/managehome2";
const tab=createBottomTabNavigator();

const ManageNav=({id})=>{
    return(
        <tab.Navigator screenOptions={{headerShown:false}}>
            <tab.Screen name="Timings" component={Manage1} initialParams={{id:id}}/>
            <tab.Screen name="Details" component={Manage2} initialParams={{id:id}}/>
        </tab.Navigator>
    );
}
export default ManageNav;