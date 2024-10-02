import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import config from "../connection/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Checkout = () => {
    const route = useRoute();
    const navigation=useNavigation();
    const cart = route.params.cart;
    const id=route.params.id;
    const [modalvisible,setmodalvisible]=useState(false);
    const [success,setsuccess]=useState(false);
    const [bookingId,setbookingId]=useState('');
    const [Loading,setLoading]=useState(false);
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
    var Total_Cart_price=0;
    var Total_slots=0;

    const bookslots=async()=>{
        const useremail=await AsyncStorage.getItem('token');
        try{
            const response=await fetch(`http://${config.ipAddress}:${config.port}/api/player/checkout/bookturf`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    userid:useremail,
                    turfid:id,
                    selected_slots:cart,
                    Total_Cost:Total_Cart_price,
                }),
            });
            const data=await response.json();
            if(data.status===1){
                setsuccess(true);
                setbookingId(data.bookingid);
                // console.log(data);
                setmodalvisible(true);
            }else{
                setmodalvisible(true);
            }
        }catch(error){
            setmodalvisible(true);
            console.log(error);
        }finally{
            setLoading(false);
        }
        
    }



    if(Loading){
        return(
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={'large'} color={'green'}/>
            </View>
        );
    }
    return (
        <View backgroundColor="#f9f6f5" style={{flex:1}}>
            <View style={{ backgroundColor: 'orange', padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 20 }}>Checkout</Text>
            </View>
            <ScrollView>
            <View style={{backgroundColor:'white',margin:15,padding:10,borderRadius:5,elevation:10}}>
                {Object.entries(cart).map(([key, item]) => {
                    let number_of_slot=0;
                    return (
                        <View key={key}style={{marginTop:10,marginBottom:5}}>
                            <View style={{alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:15}}>Date : {`${item[0].date}/${item[0].month}/${item[0].year}`}</Text>
                            </View>
                            <View style={{marginTop:10,padding:5,borderColor:'black',borderWidth:1}}>
                            {item.map((item, index) => {
                                number_of_slot=number_of_slot+1;
                                Total_Cart_price=Total_Cart_price+item.price;
                                Total_slots=Total_slots+1;
                                return(
                                    <View key={index} >
                                        <View style={{margin:5,flexDirection:'row',justifyContent:'space-evenly'}}>
                                            <Text style={{color:'black'}}>{`Slot ${number_of_slot} : `}</Text>
                                            <Text style={{color:'black'}}>{`${formattedtime(item.start)} - ${formattedtime(item.end)}`}</Text> 
                                            <Text style={{color:'black'}}>{`Price : ${item.price}`}</Text>
                                        </View>
                                    </View>
                                ); 
                            })}
                            </View>
                        </View>
                    );
                })}
            </View>
            </ScrollView>
            <Modal
            animationType='fade'
            transparent={true}
            visible={modalvisible}
            onRequestClose={()=>{
                setmodalvisible(false);
                navigation.reset(
                    {
                        index:0,
                        routes:[{name:'Turflist'}]
                    }
                );
            }}
            >
                <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
                    <View style={{backgroundColor:'white',padding:10,borderRadius:15,height:50/100*Dimensions.get('screen').height,width:80/100*Dimensions.get('screen').width,justifyContent:'center',alignItems:'center'}}>
                        <View style={{flex:3,alignItems:'center',justifyContent:'center'}}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                        {success?<MaterialCommunityIcon name={'check-circle-outline'} color={'seagreen'} size={80}/>:<MaterialCommunityIcon name={'alpha-x-circle-outline'} color={'red'} size={80}/>}
                        </View>
                        <View style={{marginTop:10}}>
                            {success?<Text style={{color:'green',fontSize:16}}>{`bookingId : ${bookingId}`}</Text>:null}
                            <Text style={{color:success?'seagreen':'red',fontSize:25}}>{success?'Booking SuccessFull':'Booking Failed'}</Text>       
                        </View>
                        </View>
                        <View style={{flex:1,marginTop:10}}>
                            <TouchableOpacity style={{backgroundColor:'orange',padding:10,borderRadius:5}} onPress={()=>{
                                setmodalvisible(false);
                                navigation.reset(
                                    {
                                        index:0,
                                        routes:[{name:'Turflist'}]
                                    }
                                );
                            }}>
                                <Text style={{color:'white',fontSize:16}}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{elevation:10,backgroundColor:'white',padding:10,margin:15,borderRadius:10}}>
                <View style={{alignItems:'center',paddingRight:10}}>
                    <Text style={{color:'black',fontWeight:'700'}}>{`Total Slots : ${Total_slots}`}</Text>
                    <Text style={{color:'black',fontWeight:'bold'}}>{`Total Price : Rs ${parseFloat(Total_Cart_price).toFixed(2)}`}</Text>
                </View>
                <TouchableOpacity style={{padding:10,margin:10,backgroundColor:'seagreen',borderRadius:6,alignItems:'center'}} onPress={()=>{
                    setLoading(true);
                    bookslots();
                }}>
                    <Text style={{color:'white'}}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:10,margin:10,backgroundColor:'seagreen',borderRadius:6,alignItems:'center'}} onPress={()=>{
                    setmodalvisible(true);
                }}>
                    <Text style={{color:'white'}}>Show</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default Checkout;