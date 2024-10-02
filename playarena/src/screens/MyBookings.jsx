import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "../connection/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Entypo from 'react-native-vector-icons/Entypo';
import { Share } from "react-native";
const MyBookings=()=>{
    const [mybookingarr,setmybookingarr]=useState([]);
    const formattedtime = (time) => {
        try {
            let hours = new Date(time).getHours();
            let minutes = new Date(time).getMinutes().toString().padStart(2, '0');
            let ampm = hours >= 12 ? 'PM' : 'AM';


            hours = hours % 12;
            hours = hours ? hours : 12;

            return `${hours}:${minutes} ${ampm}`;
        } catch (e) {
            console.log(time, e);
        }
    }
    useFocusEffect(useCallback(()=>{
        const getbookings=async()=>{
            const token=await AsyncStorage.getItem('token');
            try{
                const response=await fetch(`http://${config.ipAddress}:${config.port}/api/player/my_bookings`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        token:token,
                    }),
                });
                const data=await response.json();
                if(data.status===1){
                    setmybookingarr(data.bookings);
                }else{
                    null
                }
            }catch(error){
                console.log(error);
            }   
        }
        getbookings();
    },[]));
    
    const onshare=async(bookingId,turfdet,item)=>{
        const slotDetails=Object.entries(item.bookings).map(([key,value])=>{
            const Dateinfo=`Date : ${value[0].date}/${value[0].month}/${value[0].year}\n`;
            const slotinfo=value.map((item,index)=>
                `Slot ${index+1} : ${formattedtime(item.start)} - ${formattedtime(item.end)}\n`
            ).join('');
            return `${Dateinfo}\n${slotinfo}`;
        }).join('\n\n');


        const message=`Welcome to PlayArena!\n\n` +
      `We are excited to confirm your booking at our facility. Below are your booking details:\n\n` +
      `**Booking ID**: ${bookingId}\n` +
      `**Turf Name**: ${turfdet.turfname}\n` +
      `**Slots Booked**:\n${slotDetails}\n` +
      `**Turf Address**: \n${turfdet.turfaddress}\n\n`+
      `Thank you for choosing PlayArena for your sports activities. Enjoy your game!\n` +
      `Visit us again at: https://playarena.com`;
        try{
            const response =await Share.share({
                title:'PlayArena',
                message:message,
            });
        }catch(error){
            console.log(error);
        }
    }

    const getTurfname=async(turfid)=>{
        try{
            const response=await fetch(`http://${config.ipAddress}:${config.port}/api/player/get_turf_name`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    turfid:turfid,
                }),
            });
            const data=await response.json();
            if(data.status===1){
                return {turfname:data.turfname,turfaddress:data.turfaddress}
            }
        }catch(error){
            return {turfname:'',turfaddress:''}
        }
    }
    return(
        <View style={{backgroundColor:'#f9f6f5',flex:1,padding:10}}>
            <ScrollView contentContainerStyle={{flex:1}}>
            {mybookingarr.length>0?mybookingarr.map((item,index)=>
            {
                const bookingDate=new Date(item.created_at);
                return(
                <View style={{backgroundColor:'white',marginTop:10,elevation:10,padding:10,borderRadius:5}} key={index}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'black',fontWeight:'bold'}}>Booking Id : </Text>
                        <Text style={{color:'black'}}>{item._id}</Text>
                    </View>  
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'black',fontWeight:'bold'}}>Payment Date : </Text>
                        <Text style={{color:'black'}}>{`${bookingDate.getDate()}/${bookingDate.getMonth()}/${bookingDate.getFullYear()}  ${formattedtime(bookingDate)}`}</Text>
                    </View> 
                    <View  style={{flexDirection:'row'}}>
                        <Text style={{color:'black',fontWeight:'bold'}}>Price : </Text>  
                        <Text style={{color:'black'}}>{item.total_price}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <TouchableOpacity style={{backgroundColor:'#ddf7dd',padding:5,borderRadius:5}} onPress={async()=>{
                            const turf_det=await getTurfname(item.turf_id);
                            onshare(item._id,turf_det,item);
                        }}>
                            <Entypo name={'share'} size={25} color={'green'}/>  
                        </TouchableOpacity>
                    </View>
                </View>
                );
            }):<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'black'}}>No Bookings</Text>
                </View>}
            </ScrollView>
        </View>
    );

}
export default MyBookings;