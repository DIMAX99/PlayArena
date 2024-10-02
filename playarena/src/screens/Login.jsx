import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View,Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { TextInput } from "react-native";
import config from "../connection/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const {height,width}=Dimensions.get('screen');

const Login=()=>{
    const navigation=useNavigation();
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [loading,setloading]=useState(false);
    const dologin= async()=>{
        if(username=='' || password==''){
            Alert.alert('All Field Are Required');
        }
        else{
            setloading(true);
            try{
                const response=await fetch(`http://${config.ipAddress}:${config.port}/log`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        username,
                        password
                    }),
                });
                const data=await response.json();
                if(data.status==1){
                    setloading(false);
                    AsyncStorage.setItem('token',data.data);
                    AsyncStorage.setItem('isLogged','true');
                    AsyncStorage.setItem('id',data.id);
                    navigation.replace('HomeDrawer');
                }else{
                    setloading(false);
                    Alert.alert('Invalid Details');
                }
            }catch(error){
                console.log(error);
                setloading(false);
                Alert.alert('Server Error');
            }
        }
    }

    useEffect(()=>{
        const checkedlog=async()=>{
            try{
                setloading(true);
                const islogged=await AsyncStorage.getItem('isLogged') || null;
                if(islogged==='true'){
                    // console.log(islogged);
                    setloading(false);
                    navigation.replace('HomeDrawer');
                }else{
                    setloading(false);
                }
            }catch(error){
                // console.log(error);
                setloading(false);
                Alert.alert('Token Error');
            }
        }
        checkedlog();
    },[]);






    if(loading){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                <ActivityIndicator size={'large'} color={'black'}/>
            </View>
        );
    }
    return(
        <View style={{flex:1}}>
        <View style={loginstyle.header}>
                <Text style={[loginstyle.headertext,{fontFamily:"Poppins-Regular"}]}>PlayArena</Text>
        </View>
        <View style={{flex:1,backgroundColor:'offwhite'}}>
            <View style={{padding:10,marginTop:7/100*height,left:42/100*width,zIndex:999,backgroundColor:'white',borderColor:"black",position:'absolute',borderWidth:2,borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'black',fontSize:17,fontFamily:"Poppins-Regular"}}>Login</Text>
            </View>
            <View style={[loginstyle.logincon]}>
                <View style={loginstyle.inputcontainer}>
                    <Text style={[loginstyle.label,{fontFamily:"Poppins-Regular"}]}>Username : </Text>
                    <TextInput 
                    style={loginstyle.inputfield} 
                    keyboardAppearance='default' 
                    keyboardType='default'
                    placeholder="username"
                    value={username}
                    placeholderTextColor={'white'}
                    onChangeText={(e)=>setusername(e)} 
                    cursorColor={'white'}/>
                </View>
                <View style={loginstyle.inputcontainer}>
                    <Text style={loginstyle.label}>Password : </Text>
                    <TextInput 
                    style={loginstyle.inputfield} 
                    keyboardAppearance='default' 
                    keyboardType='default' 
                    placeholder="password"                
                    value={password}
                    placeholderTextColor={'white'}
                    onChangeText={(e)=>setpassword(e)}
                    cursorColor={'white'}/>
                </View>
                <View style={[{alignItems:"center"}]}>
                <TouchableOpacity style={{backgroundColor:'black',width:20/100*width,padding:10,justifyContent:'center',alignItems:'center',margin:10,borderRadius:5}} onPress={()=>{dologin()}}>
                    <Text style={{color:'white',fontSize:15,fontFamily:"Poppins-Regular"}}>Login</Text>
                </TouchableOpacity>
                <Text style={{color:'black',fontSize:20}}>OR</Text>
                <TouchableOpacity style={{backgroundColor:'black',width:25/100*width,padding:10,justifyContent:'center',alignItems:'center',margin:10,borderRadius:5}} onPress={()=>navigation.navigate('Register')}>
                    <Text style={{color:'white',fontSize:15,fontFamily:"Poppins-Regular"}}>Register</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </View>
    );
}

const loginstyle=StyleSheet.create({
    header:{
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center',
        padding:5/100*width
    },
    headertext:{
        color:'white',
        fontSize:30,
        fontFamily:"Poppins-Regular",
    },
    logincon:{
        padding:5/100*width,
        paddingTop:9/100*width,
        borderColor:'black',
        borderWidth:2,
        borderRadius:5,
        marginTop:10/100*height,
        marginLeft:10/100*width,
        marginRight:10/100*width

    },
    inputcontainer:{
        flexDirection:'row',
        margin:1/100*width,
        alignItems:'center',
        justifyContent:'center',
    },
    label:{
        flex:1.6,
        alignItems:'center',
        justifyContent:'center',
        color:'black',
        fontSize:13,
        fontFamily:"Poppins-Regular",
    },
    inputfield:{
        flex:3,
        backgroundColor:'black',
        color:'white',
        borderRadius:1/100*width,
        padding:6,marginLeft:5,fontFamily:"Poppins-Regular"
    },
    btncontainer:{
        flexDirection:'row',
    },
    loginbtn:{
        backgroundColor:'black',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:2/100*width,
        margin:3/100*width
    },
    loginbtntext:{
        color:'white',
        fontFamily:"Poppins-Regular"
    },
    registerbtn:{
        backgroundColor:'black',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:2/100*width,
        margin:3/100*width
    },
    regbtntext:{
        color:'white',
        fontFamily:"Poppins-Regular"
    },
    
})



export default Login;