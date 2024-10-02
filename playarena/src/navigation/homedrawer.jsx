import 'react-native-gesture-handler';
import 'react-native-reanimated'
import 'react-native-screens'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import React ,{useEffect}from "react";
import HomeTabNav from "./hometab";
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import config from '../connection/config';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import Profile from '../screens/Profile';

const drawer=createDrawerNavigator();

const Demo1=()=>{
    return(
        <View>
            <Text>Hello in drawer</Text>
        </View>
    );
}


const HomeDrawer=()=>{
    const navigation=useNavigation();
    const [name,setname]=useState('');
    useEffect(()=>{
        const getdet=async()=>{
            try{
            const token=await AsyncStorage.getItem('token');
            const response=await fetch(`http://${config.ipAddress}:${config.port}/getusername`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    token,
                }),
            });
            const data=await response.json(); 
            if(data.status==1){
                setname(data.name);
            }else{
                Alert.alert('Something went wrong');
            }
            }catch(error){
                console.log(error);
                Alert.alert('Server Error');
            }
        }
        getdet();
    },[])

    const Drawerstyle=(props)=>{
        return(
            <SafeAreaView style={{flex:1,paddingBottom:20}}>
                <View style={{padding:20}}>
                    <View style={{borderColor:'darkblue',borderTopWidth:10,borderLeftWidth:10,borderRightWidth:10,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:10,fontFamily:'Poppins-Regular'}}></Text>
                    </View>
                    <View style={{alignItems:"center",marginTop:5,marginBottom:5,justifyContent:'center',borderColor:'darkblue',borderLeftWidth:10,borderRightWidth:10,}}>
                        <Text style={{color:'black',fontSize:30,fontFamily:'Poppins-Regular'}}>PlayArena</Text>
                    </View>
                    <View style={{borderColor:'darkblue',borderBottomWidth:10,borderLeftWidth:10,borderRightWidth:10,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:10,fontFamily:'Poppins-Regular'}}></Text>
                    </View>
                </View>
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props}/>
                </DrawerContentScrollView>
                <View>
                <DrawerItem
                    icon={({color,size})=><Entypo name={'log-out'} color={'white'} size={size}/>}
                    label={'Sign Out'}
                    labelStyle={{color:'white',alignItems:'center'}}
                    onPress={async()=>{
                        try {
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('isLogged');
                            navigation.dispatch(
                                navigation.reset({
                                    index:0,
                                    routes:[{name:'Login'}],
                                })
                            )
                          } catch (error) {
                            console.error(error);
                          } 
                    }}
                    inactiveBackgroundColor='#00d1f3'
                    />
                </View>
            </SafeAreaView>
        );
    }

    return(
        <drawer.Navigator 
        screenOptions={{headerTitle:name?`Hi, ${name}`:'Hi'}} 
        initialRouteName='Home'
        drawerContent={props=><Drawerstyle{...props}/>}
        >
            <drawer.Screen name="Home" component={HomeTabNav}/>
            <drawer.Screen name="Profile" component={Profile}/>
        </drawer.Navigator>
    );
}
export default HomeDrawer;