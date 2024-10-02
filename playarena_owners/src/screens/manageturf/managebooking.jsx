import { NavigationContainer, useRoute } from "@react-navigation/native";
import React from "react";
import { View,Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ManageNav from "../../navigation/manage";
import ManageBook from "../../navigation/booknav";






const Managebookingsnav=({navigation})=>{
    const router=useRoute();
    const id=router.params.id || '';
    return(
        <ManageBook id={id}/>
    );
}

export default Managebookingsnav;