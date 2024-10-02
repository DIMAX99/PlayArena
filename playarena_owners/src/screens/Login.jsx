
import { useNavigation } from "@react-navigation/native";
import config from "../config";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

const Login = () => {
    const navigation=useNavigation();
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [loading,setloading]=useState(false);
    

    const loginowner=async()=>{
        setloading(true);
        setTimeout(async()=>{
            try{
                const response=await fetch(`http://${config.ipAddress}:8003/api/owner/login`,{
                  method:'POST',
                  headers:{
                    'Content-Type':'application/json',
                  },
                  body:JSON.stringify({
                    email:email,
                    password:password,
                  }),
                });
                const data=await response.json();
                if(data.status==1){
                  AsyncStorage.setItem('token',data.data);
                  AsyncStorage.setItem("isLoggedIn",'true');
                  setloading(false);
                  navigation.replace('Homescreen');
                }else{
                  Alert.alert(data.message);
                }
              }catch(e){
                console.log(e);
              }finally{
                  setloading(false);
              }
        },1000);
      }
      if(loading){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}} >
                <ActivityIndicator size={'large'} color={'#ffffff'}/>
            </View>
        );
      }
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View style={styles.regheadcon}>
                <Text style={styles.reghead}>Login</Text>
                <Text style={styles.regheadsmall}>Turn Your Turf Into a Must-Play Destination!</Text>
            </View>
            <View style={styles.regformcon}>
                <View style={styles.inputcon}>
                    <Text style={styles.inputlab}>Email :</Text>
                    <TextInput style={styles.input} placeholder='Email' keyboardType='email-address' value={email} onChangeText={(v)=>setemail(v)} />
                </View>
                <View style={styles.inputcon}>
                    <Text style={styles.inputlab}>Password :</Text>
                    <TextInput style={styles.input} placeholder='Password'value={password} onChangeText={(v)=>setpassword(v)} />
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.nextbtn}onPress={()=>{loginowner();}} >
                    <Text style={{ color: 'white', fontSize: 20 }}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'black',fontSize:20}}>Or</Text>
                <Text style={{color:'black',fontSize:15}}>Not A Partner?</Text>
                <TouchableOpacity style={styles.nextbtn} onPress={()=>navigation.navigate('Register')}>
                    <Text style={{ color: 'white', fontSize: 15 }}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    regheadcon: {
        backgroundColor: 'black',
        padding: 20,
    },
    reghead: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Roboto-Regular',
    },
    regheadsmall: {
        color: 'grey',
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
    },
    regformcon: {
        padding: 20,
    },
    inputcon: {
        flexDirection: 'row',
    },
    inputlab: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
    },
    input: {
        flex: 3,
        color: 'black',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    nextbtn: {
        backgroundColor: 'black',
        padding: 15,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    }

});
export default Login;