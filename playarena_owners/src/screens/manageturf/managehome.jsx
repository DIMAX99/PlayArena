import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { View, Text, FlatList } from 'react-native';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import conversion from "../../components/functions/convert_to_24";
import Materialicon from "react-native-vector-icons/MaterialIcons";
import config from "../../config";


const Manage1 = ({ route }) => {
    let turfid = route.params.id;
    const [loading, setloading] = useState(false);
    const [slot, setslot] = useState(true);
    const [price,setprice]=useState(null);
    const [editime,setedittime]=useState(false);
    const [editprice,seteditprice]=useState(false);
    
    useEffect(() => {
        const getturftimin = async () => {
            setloading(true);
            try {
                const response1 = await fetch(`http://${config.ipAddress}:8003/api/owner/addturf/gettiming`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        turfid: turfid,
                    }),
                });
                const data = await response1.json();
                if (data.status === 1) {
                   
                    setinit({
                        monday:{openingTime: new Date(data.data['monday'].openingTime),closingTime: new Date(data.data['monday'].closingTime) },
                        tuesday:{openingTime: new Date(data.data['tuesday'].openingTime),closingTime: new Date(data.data['tuesday'].closingTime) },
                        wednesday:{openingTime: new Date(data.data['wednesday'].openingTime),closingTime: new Date(data.data['wednesday'].closingTime) },
                        thursday:{openingTime: new Date(data.data['thursday'].openingTime),closingTime: new Date(data.data['thursday'].closingTime) },
                        friday:{openingTime: new Date(data.data['friday'].openingTime),closingTime: new Date(data.data['friday'].closingTime) },
                        saturday:{openingTime: new Date(data.data['saturday'].openingTime),closingTime:new Date(data.data['saturday'].closingTime) },
                        sunday:{openingTime: new Date(data.data['sunday'].openingTime),closingTime:new Date(data.data['sunday'].closingTime) }
                    })
                    setslot(data.data.slot);
                    setprice(data.data.defaultprice);
                    setloading(false);
                }
                else {
                    setloading(false);
                    Alert.alert('Timing should be set before taking booking');
                }
            } catch (e) {
                console.log(e);
            }
        }
        getturftimin();
    }, [])


    const [initialTimings2, setinit] = useState({
        monday:{openingTime: null,closingTime: null },
        tuesday:{openingTime: null,closingTime: null },
        wednesday:{openingTime: null,closingTime: null },
        thursday:{openingTime: null,closingTime: null },
        friday:{openingTime: null,closingTime: null },
        saturday:{openingTime: null,closingTime: null },
        sunday:{openingTime: null,closingTime: null }
    });

    const roundoff = (date,type) => {
        // console.log(date);
        let minute = date.getMinutes();
        let rounded = slot ? (minute < 15 ? 0 : minute < 45 ? 30 : 0) : (minute < 31 ? 0 : 0);
        let hour = date.getHours();
        if (minute > 45) {
            hour = hour + 1;
            if (hour == 24) {
                hour = 0;
            }
        }
        let newdate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, rounded);
        if(type==='closingTime'){
            if (newdate.getHours() == 0 && newdate.getMinutes() == 0) {
                return new Date(newdate.getTime()+24*60*60*1000);
            }
        }
        // console.log(date.getHours(), date.getMinutes());
        // console.log(slot, newdate.getHours(), newdate.getMinutes());
        return newdate;

    }


    const handleTimeChange = (id, time, type) => {
        setinit({...initialTimings2,[id]:{...initialTimings2[id],[type]:time}});
    };

    const validate = (open, close) => {
        // console.log(dif, mindif);
        
        // console.log(close.getTime());
        let dif = close.getTime() - open.getTime();
        let mindif = slot ? 30 * 60 * 1000 - 1 : 60 * 60 * 1000 - 1;

        if (dif > mindif && dif > 0) {
            return true;
        }
        return false;
    }


    const formattedtime = (time) => {
        try{
            let hours = time.getHours();
        let minutes = time.getMinutes().toString().padStart(2, '0');
        let ampm = hours >= 12 ? 'PM' : 'AM';

      
        hours = hours % 12;
        hours = hours ? hours : 12; 

        return `${hours}:${minutes} ${ampm}`;
    }catch(e){
        console.log(time,e);
    }}



    const renderday = ({item},index) => {
        return (
            <View style={{ flexDirection: 'row', marginLeft: 7, marginRight: 7 }} key={index}>
                <View style={{ flex: 1.3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'black' }}>{index.toUpperCase()} : </Text>
                </View>
                <View style={{ flex: 3, flexDirection: 'row' }}>
                    <TouchableOpacity disabled={!editime} style={{ backgroundColor: editime?'black':'grey', margin: 5, flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => {
                        DateTimePickerAndroid.open({
                            value: item.openingTime === null ? new Date() : item.openingTime,
                            onChange: (event, selectedTime) => {
                                // conversion(selectedTime);
                                handleTimeChange(index, roundoff(selectedTime,'openingTime'), 'openingTime');
                            },
                            mode: 'time',
                            is24Hour: false,
                        });
                    }}>
                        <Text style={{ color: 'white' }}>{item.openingTime === null ? '-' : formattedtime(item.openingTime)}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 30 }}>-</Text>
                    </View>
                    <TouchableOpacity disabled={!editime} style={{ backgroundColor: editime?'black':'grey', margin: 5, flex: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => {
                        DateTimePickerAndroid.open({
                            value: item.closingTime === null ? new Date() : item.closingTime,
                            onChange: (event, selectedTime) => {
                                let res = roundoff(selectedTime,'closingTime')
                                if (validate(item.openingTime, res)) {
                                    handleTimeChange(index, res, 'closingTime');
                                } else {
                                    Alert.alert('closing should be ahead of opening time');
                                }
                            },
                            mode: 'time',
                            is24Hour: false,
                        });
                    }}>
                        <Text style={{ color: 'white' }}>{item.closingTime === null ? '-' : formattedtime(item.closingTime)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    
    const setTiming = async () => {
        setloading(true);
        // let daysobj = convertobj(initialTimings2);
        try {
            const response = await fetch(`http://${config.ipAddress}:8003/api/owner/addturf/updatetime`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    turfid: turfid,
                    slot: slot,
                    monday: { openingTime: initialTimings2['monday'].openingTime.toISOString(), closingTime: initialTimings2['monday'].closingTime.toISOString() },
                    tuesday: { openingTime: initialTimings2['tuesday'].openingTime.toISOString(), closingTime: initialTimings2['tuesday'].closingTime.toISOString() },
                    wednesday: { openingTime: initialTimings2['wednesday'].openingTime.toISOString(), closingTime: initialTimings2['wednesday'].closingTime.toISOString() },
                    thursday: { openingTime: initialTimings2['thursday'].openingTime.toISOString(), closingTime: initialTimings2['thursday'].closingTime.toISOString() },
                    friday: { openingTime: initialTimings2['friday'].openingTime.toISOString(), closingTime: initialTimings2['friday'].closingTime.toISOString() },
                    saturday: { openingTime: initialTimings2['saturday'].openingTime.toISOString(), closingTime: initialTimings2['saturday'].closingTime.toISOString() },
                    sunday: { openingTime: initialTimings2['sunday'].openingTime.toISOString(), closingTime: initialTimings2['sunday'].closingTime.toISOString() },
                }),
            });
            const d = await response.json();
            if (d.status === 1) {
                setloading(false);
                Alert.alert("changed");
            }
            else {
                setloading(false);
                Alert.alert("error");
            }
        } catch (error) {
            setloading(false);
            console.log(error);
        }
    }

    const setslotprice=async () =>{
        setloading(true);
        try {
            const response = await fetch(`http://${config.ipAddress}:8003/api/owner/addturf/updatededefaultprice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    turfid:turfid,
                    defaultprice:price
                }),
            });
            const responseslot = await response.json();
            if (responseslot.status === 1) {
                setloading(false);
                Alert.alert("Default price Changed");
            }
            else {
                setloading(false);
                Alert.alert("error");
            }
        } catch (error) {
            setloading(false);
            console.log(error);
        }
    }





    if (loading) {
        return (
            <View style={{ backgroundColor: 'white', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={'black'} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{paddingBottom:30}}>
            <View style={styles.body}>
                <View style={{ backgroundColor: 'black', height: '7%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Roboto-Bold' }}>Manage Turf</Text>
                </View>
                {/* <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                    <Text style={{ color: 'black', fontSize: 24, fontFamily: 'Roboto-Medium' }}>TIMINGS</Text>
                </View> */}
            <View style={{marginTop:10}}>
            <View style={{ flexDirection: 'row', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Text style={{ color: 'black' }}>Slots : </Text>
                    </View>
                    <TouchableOpacity style={[styles.slot_input, slot ? { backgroundColor: 'black' } : null]} onPress={() => {
                        setslot(!slot);
                    }}>
                        <Text style={styles.slot_input_text}>30 min</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.slot_input, slot == false ? { backgroundColor: 'black' } : null]} onPress={() => {
                        setslot(!slot);
                    }}>
                        <Text style={styles.slot_input_text}>60 min</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:10}}>
                    {Object.entries(initialTimings2).map(([id,item])=>{
                        return renderday({item},id);
                    })}
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 ,flexDirection:'row'}}>
                    <TouchableOpacity style={{ backgroundColor:editime?'black':'grey', width: 120, padding: 10, borderRadius: 6, alignItems: 'center' }} disabled={!editime} onPress={() => setTiming()}>
                        <Text style={{ color: 'white' }}>Update Timings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:80,backgroundColor:'black',padding:10,alignItems:'center',marginLeft:10,marginRight:10,borderRadius:10}} onPress={()=>setedittime(!editime)}>
                            <Text style={{color:'white',fontSize:14}}>Edit</Text>
                        </TouchableOpacity>
                </View>
            </View>
                <View style={{ marginTop: 20 ,marginBottom:20}}>
                    <View style={{ alignItems: 'center' ,backgroundColor:'black',padding:6}}>
                        <Text style={{ color: 'white', fontSize: 24, fontFamily: 'Roboto-Medium' }}>Default slot prices</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',padding:20,alignItems:'center'}}>
                        <Text style={{color:'black',flex:1,fontSize:24,fontFamily:'Roboto-Mono'}}>Price : </Text>
                        <TextInput disabled={!editprice} style={{backgroundColor:editprice?'black':'grey',alignItems:'center',color:'white',flex:2.5,borderRadius:15}} keyboardType="number-pad" placeholderTextColor={'white'}  value={price===null?'':price.toString()} onChangeText={(v)=>{if(editprice){setprice(v)}}}/>
                    </View>
                    <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center'}}>
                        <TouchableOpacity style={{justifyContent:'center',alignItems:'center',width:100,backgroundColor:editprice?'black':'grey',padding:10,borderRadius:10}} disabled={!editprice} onPress={()=>setslotprice()}>
                            <Text style={{color:'white',fontSize:16}}>Set Price</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{width:80,backgroundColor:'black',padding:10,alignItems:'center',marginLeft:10,marginRight:10,borderRadius:10}}  onPress={()=>seteditprice(!editprice)}>
                            <Text style={{color:'white',fontSize:16}}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
                        
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    body: {
        backgroundColor: '#ffffff',
    },
    slot_input: {
        backgroundColor: 'grey',
        marginLeft: 10,
        marginRight: 10,
        flex: 2,
        alignItems: 'center',
        padding: 3
    },
    slot_input_text: {
        color: 'white'
    }

});
export default Manage1;