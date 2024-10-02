import React, { Component, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, FlatList } from 'react-native';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import conversion from "../../components/functions/convert_to_24";
import config from "../../config";
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { Modal } from "react-native";
import Bookmodal from "../modals/bookmodal";
import ShowBookModal from "../modals/showbookmodal";
const {height,width}=Dimensions.get('screen');
const Booking = () => {
    const route = useRoute();
    let turfid = route.params.id;
    const currentdateobj = new Date();
    const [bookingdays, setdays] = useState({});
    const [slot, setslot] = useState(true);
    const [timeslots, settimeslots] = useState([]);
    const [turfname, setturfname] = useState('turf');
    const [openmodal, setmodal] = useState(false);
    const [modalprop, setmodalprop] = useState(null);
    const [seletedslots,setselectedslots]=useState({});
    const [bookedslots,setbookedslots]=useState({});
    const [show_detail,set_show_detail]=useState({
        show:false,
        details:{}
    });
    let temp = {};
    let lowest_time = new Date(8640000000000000);
    let highest_time = new Date(-8640000000000000);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let daysahead = {};
    for (let i = 0; i < 5; i++) {
        const nextdate=new Date(currentdateobj.getTime()+i*24*60*60*1000);
        const day=nextdate.getDay();
        const date=nextdate.getDate();
        const month=nextdate.getMonth()+1;
        const year=nextdate.getFullYear();
        const dateobject={
            day:day,
            date:date,
            month:month,
            year,
        }
        daysahead[days[day]]=dateobject;

        // daysahead = { ...daysahead, [days[(day + i) % 7]]: { date: currentdate } };
    }
    // console.log(Object.keys(daysahead));
    const [loading, setloading] = useState(false);

    const generateslots = (start, end, interval) => {
        const slot = [];
        const diff = interval ? 30 * 60 * 1000 : 60 * 60 * 1000;
        let time = start;
        while (time.getTime() < end.getTime()) {
            const nextime = new Date(time.getTime() + diff);
            slot.push({ start: time, end: nextime });
            time = nextime;
        }
        return slot;
    }

    useEffect(() => {
        setloading(true);
        const getboxes = (start, end, interval, price) => {
            const slot = [];
            const diff = interval ? 30 * 60 * 1000 : 60 * 60 * 1000;
            let time = start;
            while (time.getTime() < end.getTime()) {
                const nextime = new Date(time.getTime() + diff);
                slot.push({ start: time, end: nextime, price: price, booked: false });
                time = nextime;
            }
            return slot;
        }
        const getturftimin = async () => {

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
                    setslot(data.data.slot);
                    Object.keys(daysahead).forEach((e) => {
                        try {
                            if (Object.keys(data.data).includes(e)) {
                                temp = { ...temp, [e]: { day:daysahead[e].day,date: daysahead[e].date, month:daysahead[e].month,year:daysahead[e].year,start: new Date(data.data[e].openingTime), end: new Date(data.data[e].closingTime), customprice: data.data[e].customprice, slotsnumber: getslots(new Date(data.data[e].openingTime), new Date(data.data[e].closingTime)), slotsrange: getboxes(new Date(data.data[e].openingTime), new Date(data.data[e].closingTime), data.data.slot, data.data.defaultprice) } }
                                lowest_time = temp[e].start < lowest_time ? temp[e].start : lowest_time;
                                highest_time = temp[e].end > highest_time ? temp[e].end : highest_time;
                            }
                        } catch (er) {
                            console.log(er);
                        }
                    })
                    setdays(temp);
                    settimeslots(generateslots(lowest_time, highest_time, data.data.slot));
                    setturfname(data.name);
                }
                else {
                    Alert.alert('Timing should be set before taking booking');
                }
            } catch (e) {
                console.log(e);
            }
        }

        const getbookings=async()=>{
            try{
                const response=await fetch(`http://${config.ipAddress}:8003/api/owner/turfinfo/getbookings`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        turfid:turfid,
                    })
                });
                const data=await response.json();
                if(data.status===1){
                    setbookedslots(data.data.bookings);
                }
                else{
                    null;
                    
                }
            }catch(err){
                console.log(err);
                
            }
        }
        const getdata=async()=>{
            await getturftimin();
            await getbookings();
            setloading(false);
           
        }
        getdata();
    }, []);

    useFocusEffect(useCallback(()=>{
        setloading(true);
        const getbookings=async()=>{
            try{
                const response=await fetch(`http://${config.ipAddress}:8003/api/owner/turfinfo/getbookings`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        turfid:turfid,
                    })
                });
                const data=await response.json();
                if(data.status===1){
                    setbookedslots(data.data.bookings);
                }
                else{
                  null;
                    
                }
            }catch(err){
                console.log(err);
                
            }
        }
        const getdata=async()=>{
            await getbookings();
            setloading(false);
        }
        getdata();
    },[]))
 




    const getslots = (start, end) => {
        const start_time = start.getTime();
        const end_time = end.getTime();
        const slot_time = slot ? 30 * 60 * 1000 : 60 * 60 * 1000;
        const diff = Math.abs(end_time - start_time);
        const no_of_slots = diff / slot_time
        return no_of_slots;
    }
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


    if (loading) {
        return (<View style={{ height: '100%', backgroundColor: '#eff5f1', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={'seagreen'} />
        </View>)
    }
    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#eff5f1' }}>
            <View style={{ flex: 1, backgroundColor: '#eff5f1' }}>
                <View style={{ backgroundColor: 'black', padding: 10, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 25 }}>{turfname}</Text>
                </View>
                <ScrollView>
                    <View style={{ flexDirection: 'row', backgroundColor: '#eff5f1',}}>
                        <View style={{top:10/100*height,backgroundColor: 'lightgreen' }} >
                            {/*VIew 1 */}
                            {timeslots.map((item, index) => (
                                <View key={index} style={{ margin: 0.7/100*height, borderColor: 'black', backgroundColor: 'green', borderWidth: 0.2/100*height,height:6/100*height, alignItems:'center',justifyContent:'center',borderRadius: 4, padding: 0.5/100*height }}>
                                    <Text style={{ color: 'white' }}>{formattedtime(item.start)}</Text>
                                    <Text style={{ color: 'white' }}>{formattedtime(item.end)}</Text>
                                </View>
                            ))}
                        </View>
                        <ScrollView horizontal={true}>
                            <View style={{ flexDirection: 'row', paddingLeft: 5, paddingStart: 5, backgroundColor: 'white'}}>
                                {Object.entries(bookingdays).map(([id, item], index1) => 
                                {
                                    let slotkey=`${item.date.toString()}${item.month.toString()}${item.year.toString()}`;
                                    return(
                                    <View key={index1} style={{ backgroundColor: 'lightblue', marginLeft: 5, marginRight: 5,borderColor: 'seagreen',paddingBottom:5/100*height, borderWidth: 1 ,borderTopWidth:0}}>
                                        <View>
                                            <View style={styles.daysbox}>
                                                <Text style={styles.dayboxtext}>{id.toUpperCase()}</Text>
                                                <Text style={styles.dayboxtext}>{item.date}</Text>
                                            </View>
                                        </View>
                                        {/* {console.log(Object.keys(bookedslots).includes(slotkey))} */}
                                        <View style={{ top:2/100*height ,backgroundColor:'pink'}}>
                                            {timeslots.map((item2, index) => {
                                                let found = item.slotsrange.find(slot2 => slot2.start.getTime()===item2.start.getTime());
                                                if (found) {
                                                    let isselected=null;
                                                    let isbooked=null;
                                                    if(Object.keys(bookedslots).includes(slotkey)){
                                                        // console.log(bookedslots[key].find(slot=>slot.start=="2024-09-14T00:30:00.000Z"));
                                                        isbooked=bookedslots[slotkey].find(slott=>new Date(slott.start).getTime()===found.start.getTime());
                                                    }
                                                    if(Object.keys(seletedslots).includes(slotkey)){
                                                        isselected=seletedslots[slotkey].find(slot=>slot.start.getTime()===found.start.getTime()) || null;
                                                    }
                                                    if(isbooked){
                                                       return(
                                                        <TouchableOpacity style={[styles.slots,{backgroundColor:'red'}]} key={index} onPress={()=>{
                                                            set_show_detail({show:true,details:isbooked});
                                                        }}>
                                                            <Text style={{ color: 'white', fontFamily: 'Roboto-Regular' }}>{found.price}</Text>
                                                        </TouchableOpacity>
                                                       );
                                                    }else{
                                                        return (
                                                            <TouchableOpacity style={[styles.slots,{backgroundColor:isselected?'blue':'green'}]} key={index} onPress={()=>{
                                                                if(isselected){
                                                                    // console.log(isselected);
                                                                    const newarr=seletedslots[slotkey].filter(slots=>slots.start.getTime()!=found.start.getTime());
                                                                    if(newarr.length==0){
                                                                        // console.log('i am deleted');
                                                                        const {[slotkey]:_, ...newObject}=seletedslots;
                                                                        setselectedslots(newObject);
                                                                    }else{
                                                                        // console.log('i am new and being added');
                                                                        setselectedslots((prevvalue)=>({
                                                                            ...prevvalue,[slotkey]:newarr
                                                                        }))
                                                                    }
                                                                }else{
                                                                    // console.log('i am not selected',isselected);
                                                                    const bookedslot={
                                                                        date:item.date,month:item.month,year:item.year,start:found.start,end:found.end,price:found.price
                                                                    }
                                                                    const founded=seletedslots[slotkey] || null;
                                                                    if(founded){
                                                                            setselectedslots((prevvalue)=>({
                                                                                ...prevvalue,[slotkey]:[...seletedslots[slotkey],bookedslot]
                                                                            }))
                                                                    }else{
                                                                        setselectedslots((prevvalue)=>({
                                                                            ...prevvalue,[slotkey]:[bookedslot]
                                                                        }))
                                                                    }
                                                                }        
                                                            }}>
                                                                <Text style={{ color: 'white', fontFamily: 'Roboto-Regular' }}>{found.price}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    }
                                                    
                                                } else {
                                                    return (
                                                        <View style={[styles.slots, { backgroundColor: 'grey' }]} key={index}>
                                                            <Text style={{ color: 'white' }}></Text>
                                                        </View>
                                                    );
                                                }
                                                
                                            })}
                                        </View>
                                    </View>
                                )})}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={openmodal}
                    onRequestClose={() =>{ 
                        setmodal(!openmodal);
                    }}
                ><Bookmodal modalinfo={modalprop} setmodal={setmodal} openmodal={openmodal} turfid={turfid}/></Modal>
                 <Modal
                    animationType='fade'
                    transparent={true}
                    visible={show_detail.show}
                    onRequestClose={() =>{ 
                        set_show_detail({show:false,details:{}});
                    }}
                ><ShowBookModal prop={show_detail.details} /></Modal>
                <View style={{ bottom: 5, marginTop: 10 }}>
                    <TouchableOpacity style={{ backgroundColor:Object.keys(seletedslots).length>0?'seagreen':'grey', padding: 10, alignItems: 'flex-end' }} disabled={Object.keys(seletedslots).length>0?false:true}  onPress={()=>{
                        setmodalprop(seletedslots);
                        setmodal(!openmodal);
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 24 }}>Proceed</Text>
                            <Entypo name={'chevron-right'} color={'white'} size={30} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        
    );
}



const styles = StyleSheet.create({
    daysbox: {
        height: 8/100*height,
        width: 100,
        backgroundColor: 'black',
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        padding: 10
    },
    dayboxtext: {
        color: 'white',
        fontSize: 13
    },
    slots: {
        margin: 0.7/100*height,height:6/100*height, justifyContent:'center',alignItems:'center',borderColor: 'black', borderWidth: 0.2/100*height, borderRadius: 4, padding: 0.5/100*height 
    }
})



export default Booking;