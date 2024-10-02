import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { View,Text,TextInput } from "react-native";
const Home=()=>{
    const token=AsyncStorage.getItem('token');
    
    return(
        <View>
            <Text>in home</Text>
        </View>
    );
}
export default Home;