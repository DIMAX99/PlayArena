import { NavigationContainer, useRoute } from "@react-navigation/native";
import React from "react";
import { View,Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ManageNav from "../../navigation/manage";






const Manage=({navigation})=>{
    const router=useRoute();
    const id=router.params.id || '';
    // console.log(id);
    return(
        <ManageNav id={id}/>
    );
}

export default Manage;