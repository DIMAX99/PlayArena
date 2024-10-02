import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import config from "../connection/config";

const { height, width } = Dimensions.get('screen');

const Register = () => {
    const navigation=useNavigation();
    const [name,setname]=useState('');
    const [dob,setdob]=useState(null);
    const [email,setemail]=useState('');
    const [phonenumber,setphonenumber]=useState('');
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [loading,setloading]=useState(false);
    const doregister= async()=>{
        setloading(true);
        if(name=='' || dob==null || email=='' || phonenumber=='' || username=='' || password==''){
            setloading(false);
            Alert.alert('All Fields Are Required');
        }else{
            try{
                const response= await fetch(`http://${config.ipAddress}:${config.port}/reg`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        name,
                        dob,
                        email,
                        phonenumber,
                        username,
                        password
                    }),
                });
                const data=await response.json();
                if(data.status==1){
                    setloading(false);
                    navigation.replace('Login');
                }
                else{
                    setloading(false);
                    Alert.alert('Registeration Failed');
                }
            }catch(error){
                console.log(error);
                setloading(false);
                Alert.alert("Server Error");
            }
        } 
    }


    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.headertext}>Register</Text>
            </View>
            <View style={styles.maincontainer}>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>Name : </Text>
                    <TextInput style={styles.inputfield} keyboardType='default' value={name} onChangeText={(e)=>setname(e)}/>
                </View>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>Date of Birth : </Text>
                    <TouchableOpacity 
                    style={{flex:3,padding:2/100*width,borderRadius:2/100*width,backgroundColor:'black'}}
                    onPress={()=>{
                        DateTimePickerAndroid.open({
                            value:new Date(),
                            onChange:(event,selectedDate)=>{
                                if(event.type=='dismissed'){
                                    null;
                                }
                                if(event.type=='set'){
                                    setdob({date:selectedDate.getDate(),month:selectedDate.getMonth()+1,year:selectedDate.getFullYear()});
                                }
                            },
                            mode:'date',
                            maximumDate:new Date(),
                            
                        })

                    }}
                    >
                        <Text style={{fontSize:15,color:'white'}}>{dob?`${dob.date}/${dob.month}/${dob.year}`:'Select Date'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>Email : </Text>
                    <TextInput style={styles.inputfield} keyboardType='email-address' value={email} onChangeText={(e)=>setemail(e)}/>
                </View>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>PhoneNumber : </Text>
                    <TextInput style={styles.inputfield} keyboardType='number-pad'  value={phonenumber} onChangeText={(e)=>setphonenumber(e)}/>
                </View>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>Username : </Text>
                    <TextInput style={styles.inputfield} keyboardType='number-pad'  value={username} onChangeText={(e)=>setusername(e)}/>
                </View>
                <View style={styles.inputcontainer}>
                    <Text style={styles.inputlabel}>Password : </Text>
                    <TextInput style={styles.inputfield} keyboardType='number-pad'  value={password} onChangeText={(e)=>setpassword(e)}/>
                </View>
            </View>
            <View style={styles.btncontainer}>
                <TouchableOpacity style={styles.loginbtn}onPress={()=>{
                    doregister();
                }}>
                    <Text style={styles.loginbtntext}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerbtn} onPress={()=>navigation.replace('Login')}>
                    <Text style={styles.regbtntext}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    header:{
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center',
        padding:5/100*width
    },
    headertext:{
        color:'white',
        fontSize:30
    },
    inputfield: {
        flex: 3,
        backgroundColor: 'black',
        borderRadius:2/100*width,
        color:'white'
    },
    inputlabel: {
        flex: 1.5,
        color: 'black',
        fontSize: 16,
    },
    inputcontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin:2/100*width
    },
    maincontainer: {
        padding: 5 / 100 * width,
    },btncontainer:{
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
        color:'white'
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
        color:'white'
    },

})

export default Register;