import React, { useCallback, useEffect, useState } from "react";
import { View,Text, Dimensions, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import config from "../../config";
import { useFocusEffect } from "@react-navigation/native";
import { Linking } from "react-native";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ShowBookModal=(prop)=>{
    const formattedtime = (time_unresolved) => {
        const time=new Date(time_unresolved);
        try {
            let hours = time.getHours();
            let minutes = time.getMinutes().toString().padStart(2, '0');
            let ampm = hours >= 12 ? 'PM' : 'AM';


            hours = hours % 12;
            hours = hours ? hours : 12;

            return `${hours}:${minutes} ${ampm}`;
        } catch (e) {
            return `00:00 Am/Pm`;
        }
    }
    const bookingid=prop.prop.booking_Id || '';
    const customer_name=prop.prop.customer_name || '';
    const customer_number=prop.prop.customer_number || '';
    const date_of_booking=`${prop.prop.date}/${prop.prop.month}/${prop.prop.year}`;
    const start_time=formattedtime(prop.prop.start);
    const end_time=formattedtime(prop.prop.end);
    const isowner_booked=prop.prop.owner_booked;
    const price=prop.prop.price;
    const [user,setuser]=useState({
        name:'',
        number:'',
        dob:''
    });        
        useFocusEffect(useCallback(()=>{
           
            const get_user_info=async()=>{  
                if(isowner_booked){null}else{
                    try{
                        console.log('in tyry');
                        const user_det=await fetch(`http://${config.ipAddress}:${config.port}/api/owner/bookings/get_user_info`,{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json',
                            },
                            body:JSON.stringify({
                                userid:prop.prop.user_id,
                            }),
                        });
                        const user_info=await user_det.json();
                        console.log('....');
                        if(user_info.status==1){
                            console.log(user_info);
                            setuser({
                                name:user_info.name,
                                number:user_info.phone,
                                dob:user_info.dob
                            });
                        }else{
                            console.log('serror')
                        }
                    }catch(error){
                        console.log(error);
                    }

                }
            }
            get_user_info();
        },[]));
        




  
    const {height,width}=Dimensions.get('screen');
    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.5)'}} on>
            <View style={{backgroundColor:'white',borderRadius:10,padding:20,width:85/100*width}}>
                <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
                    <Text style={styles.infolabel}>Date : </Text>
                    <Text style={styles.info}>{date_of_booking}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
                    <Text style={styles.infolabel}>Slot : </Text>
                    <Text style={styles.info}>{`${start_time} - ${end_time}`}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
                    <Text style={styles.infolabel}>Customer Name : </Text>
                    <Text style={styles.info}>{isowner_booked?customer_name:user.name}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',margin:5}}>
                    <Text style={styles.infolabel}>Customer Number : </Text>
                    <Text style={styles.info}>{isowner_booked?customer_number:user.number}</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',margin:5}}>
                    <TouchableOpacity style={{flexDirection:'row',borderRadius:5,alignItems:'center',justifyContent:'center',backgroundColor:'green',padding:10}} onPress={()=>{
                        const url=`tel:${isowner_booked?customer_number:user.number}`;
                        Linking.openURL(url).catch(error=>null);
                    }}>
                        <MaterialIcon name="call" color={'white'} size={15}/>
                        <Text style={{color:'white',marginLeft:5}}>Call</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    infolabel:{
        color:'black'
    },
    info:{
        color:'blue'
    }
})


export default ShowBookModal;