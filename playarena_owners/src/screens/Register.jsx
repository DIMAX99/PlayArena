import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import config from "../config";


const Register=({navigation})=>{
  const [companyname,setcompanyname] = useState('');
  const [email,setemail] = useState('');
  const [phonenumber,setphonenumber] = useState('');
  const [password,setpassword] = useState('');

  const registerowner=async()=>{
    try{
      const response=await fetch(`http://${config.ipAddress}:8003/api/owner/register`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          CompanyName:companyname,
          email:email,
          phonenumber:phonenumber,
          password:password,
        }),
      });
      const data=await response.json();
      if(data.status==1){
        Alert.alert('Registered Successfully');
        navigation.navigate('Login');
      }else{
        Alert.alert('Registeration failed');
      }
    }catch(e){
      console.log(e);
    }
  }



  return (
    <View style={{backgroundColor:'white',height:'100%'}}>
      <View style={styles.regheadcon}>
        <Text style={styles.reghead}>Register Account</Text>
        <Text style={styles.regheadsmall}>Turn Your Turf Into a Must-Play Destination!</Text>
      </View>
      <View style={styles.regformcon}>
        <View style={styles.inputcon}>
          <Text style={styles.inputlab}>Company Name :</Text>
          <TextInput style={styles.input} placeholder='Full Name' value={companyname} onChangeText={(v)=>setcompanyname(v)}/>
        </View>
        <View style={styles.inputcon}>
          <Text style={styles.inputlab}>Email :</Text>
          <TextInput style={styles.input} placeholder='Email' keyboardType='email-address' value={email} onChangeText={(v)=>setemail(v)}/>
        </View>
        <View style={styles.inputcon}>
          <Text style={styles.inputlab}>Phone :</Text>
          <TextInput style={styles.input} placeholder='Phone Number' inputMode='numeric' value={phonenumber} onChangeText={(v)=>setphonenumber(v)}/>
        </View>
        <View style={styles.inputcon}>
          <Text style={styles.inputlab}>Password :</Text>
          <TextInput style={styles.input} placeholder='Password'  value={password} onChangeText={(v)=>setpassword(v)}/>
        </View>
      </View>
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity style={styles.nextbtn} onPress={()=>{registerowner();}}>
            <Text style={{color:'white',fontSize:15}} >Register</Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text>Login</Text>
        <TouchableOpacity style={styles.nextbtn} onPress={()=>navigation.navigate("Login")}>
            <Text style={{color:'white',fontSize:16}} >Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
    regheadcon:{
      backgroundColor:'black',
      padding:20,
    },
    reghead:{
      color:'white',
      fontSize:20,
      fontFamily:'Roboto-Regular',
    },
    regheadsmall:{
      color:'grey',
      fontSize:15,
      fontFamily:'Roboto-Regular',
    },
    regformcon:{
      padding:20,
    },
    inputcon:{
      flexDirection:'row',
    },
    inputlab:{
      flex:1,
      textAlign:'center',
      textAlignVertical:'center',
      color:'black',
      fontSize:15,
      fontFamily:'Roboto-Regular',
    },
    input:{
      flex:3,
      color:'black',
      borderBottomColor:'black',
      borderBottomWidth:1,
    },
    nextbtn:{
      backgroundColor:'black',
      padding:12,
      width:80,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:12,
    }

});


export default Register;