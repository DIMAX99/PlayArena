import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, FlatList } from 'react-native';
import config from "../../config";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";




const Bookmodal = (modalinfo) => {
    const navigation=useNavigation();
    const formattedtime = (time) => {
        try {
            let hours = time.getHours();
            let minutes = time.getMinutes().toString().padStart(2, '0');
            let ampm = hours >= 12 ? 'PM' : 'AM';


            hours = hours % 12;
            hours = hours ? hours : 12;

            return `${hours}:${minutes} ${ampm}`;
        } catch (e) {
            console.log(time, e);
        }
    }
    const [customer_name,setcustomer_name]=useState('');
    const [customer_number,setcustomer_number]=useState('');
    const [loading,setloading]=useState(false);
    // console.log(modalinfo['modalinfo'].daydate);
    let finalprice=0;

    // console.log(start,end)
    // console.log(Object.keys(modalinfo));

    const addbookings=async(modal)=>{
        setloading(true);
        try{
            const response=await fetch(`http://${config.ipAddress}:8003/api/owner/turfinfo/addbookings`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    turfid:modalinfo['turfid'],
                    selected_slots:modal
                }),
            });
            const data=await response.json();
            if(data.status===1){
                setloading(false);
                // console.log('done');
                Alert.alert('PlayArena','Booking SuccessFull',[
                    {
                        text:'Ok',
                        onPress:()=>navigation.replace('Book',{id:modalinfo['turfid']})
                    }
                ])
            }else{
                setloading(false);
                Alert.alert('PlayArena','Slot Already Booked',[
                    {
                        text:'Ok',
                        onPress:()=>navigation.replace('Book',{id:modalinfo['turfid']})
                    }
                ]);
                
            }
            return 1;
        }catch(err){
            setloading(false);
            // console.log(err);
        }
    }


    if(loading){
        return(
            <View style={{alignItems: 'center', justifyContent: 'center',flex:1,backgroundColor:'rgba(0,0,0,0.5)'}}>
                <ActivityIndicator color={'white'} size={'large'}/>
            </View>
        );
    }

    return (
        
        <View style={styles.centeredcontainer}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, width: '80%', padding: 20 }}>
                <View>
                    <ScrollView>
                    {Object.entries(modalinfo['modalinfo']).map(([id,item])=>{
                        let totalprice=0;
                        return (
                        <View key={id}>
                        <View style={{flexDirection:'row',marginBottom:10}}>
                            <View style={{flex:1.5}}><Text style={{color:'black',fontWeight:'bold'}}>{item[0].date}/{item[0].month}/{item[0].year} : </Text></View>
                                <View style={{flex:3}}>
                                {item.map((slots,index)=>{
                                    totalprice=totalprice+slots.price;
                                    finalprice=finalprice+slots.price;
                                    return (
                                    <View style={{marginBottom:2}} key={index}>
                                        <Text style={{color:'black'}}>{formattedtime(slots.start)} - {formattedtime(slots.end)} - {slots.price}</Text>
                                    </View>
                                )})}
                                <View style={{borderTopWidth:1,borderTopColor:'black',alignItems:'center'}}>
                                    <Text style={{color:'black'}}>Price : {totalprice}</Text>
                                </View>
                                </View>
                            </View> 
                            
                        </View>
                    )})}
                    </ScrollView>
                    <View style={{borderTopWidth:1,borderTopColor:'black',alignItems:'center'}}>
                        <Text style={{color:'black'}}>Total Price : {finalprice}</Text>
                    </View>
                </View>
                <View style={styles.inputfields}>
                    <Text style={styles.inputlabel}>Customer Name : </Text>
                    <TextInput style={styles.inputarea} placeholder="Name"  value={customer_name} onChangeText={(e)=>setcustomer_name(e)}/>
                </View>
                <View style={styles.inputfields}>
                    <Text style={styles.inputlabel}>Customer Number : </Text>
                    <TextInput style={styles.inputarea} placeholder="PhoneNumber" maxLength={10}  keyboardType='number-pad' value={customer_number} onChangeText={(e)=>setcustomer_number(e)}/>
                </View>
                <View style={styles.inputfields}>
                    <Text style={styles.inputlabel}>Payment Mode : CASH</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:10,width:'100%',justifyContent:'center'}}>
                    <TouchableOpacity style={[styles.buttons,{borderColor:'red'}]} onPress={()=>modalinfo['setmodal'](!modalinfo['openmodal'])}>
                        <Text  style={[styles.buttontext,{color:'red'}]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttons,{backgroundColor:'seagreen'}]} onPress={()=>{
                        const transformedModalInfo = Object.fromEntries(
                            Object.entries(modalinfo['modalinfo']).map(([id, item]) => {
                              return [id, item.map((slot) => ({ ...slot, customer_name, customer_number,owner_booked:true }))];
                            })
                          );
                          if(customer_name.length>1 && customer_number.length==10){
                            // console.log(Object.keys(transformedModalInfo));
                            addbookings(transformedModalInfo).then((response)=>{
                                if(response){
                                    modalinfo['setmodal'](!modalinfo['openmodal']);
                                }else{
                                    console.log('error bhai');
                                }
                            })
                          }else{
                            Alert.alert('PlayArena','Please Enter Valid Customer Details',[
                                {
                                    text:'ok',
                                    onPress:()=>null
                                }
                            ])
                          }
                        
                    }}>
                        <Text style={styles.buttontext}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    buttons:{
        borderColor:'seagreen',
        borderRadius:6,
        borderWidth:2,
        padding:10,marginLeft:10,marginRight:10
    },
    buttontext:{
        color:'white'
    },
    centeredcontainer: {
        alignItems: 'center', justifyContent: 'center', height: '100%',backgroundColor:'rgba(0,0,0,0.5)'
    },
    inputfields: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    inputlabel: {
        color: 'black',
        flex: 1.5
    },
    inputarea: {
        backgroundColor: "grey", color: 'white', borderRadius: 10, flex: 3.5
    }
})
export default Bookmodal;