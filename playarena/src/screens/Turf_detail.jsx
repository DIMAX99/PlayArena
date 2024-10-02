import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import config from "../connection/config";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";




const { height, width } = Dimensions.get('screen');

const Turf_detail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const turfid = route.params.id;
    const [turf, setturf] = useState(null);
    const [loading, setloading] = useState(false);
    const [review, setreview] = useState(null);
    const [modal,setmodal]=useState(false);
    const [rating,setrating]=useState(0);
    const [alreadyreview,setalr]=useState(null);
    const [newreview,setnewreview]=useState('');
    useEffect(() => {
        const parent = navigation.getParent().getParent();
        parent.setOptions({ headerShown: false });// Hide the drawer header

        return () => {
            parent.setOptions({ headerShown: true }); // Show the drawer header again when going back
        };
    }, [navigation]);
    useEffect(() => {
        setloading(true);
        const get_turf_det = async () => {
            try {
                const response = await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turf_details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        turfid: turfid,
                    }),
                });
                const data = await response.json();
                if (data.status === 1) {
                    setturf(data.data);
                } else {
                    setloading(false);
                    Alert.alert('Turf', 'SomeThing went Wrong', [
                        {
                            text: 'Ok',
                            onPress: () => navigation.goBack()
                        }
                    ])
                }
            } catch (error) {
                null
            }
        }
        const get_review = async () => {
            try {
                const id=await AsyncStorage.getItem('id');
                const response = await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turf_review`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        turfid: turfid,
                    }),
                });
                const data = await response.json();
                if (data.status === 1) {
                    setreview(data.reviewlist);
                    const temp=data.reviewlist.find((item)=>item.userid==id);
                    if(temp){
                        setalr(temp);
                        setrating(temp.rating);
                        setnewreview(temp.comment);
                    }
                } else {
                    null
                }
            } catch (error) {
                null
            }
        }
        const get = async () => {
            await get_turf_det();
            await get_review();
            setloading(false);
        }
        get();
    }, [])
    const renderImage = (item) => {
        // console.log(item);
        return (
            <View style={{ height: 25 / 100 * height, width: width }} key={item.index}>
                <Image source={{ uri: item.item.uri }} style={{ flex: 1 }} />
            </View>
        );
    }



    const getIconByName = (name, color, size) => {
        switch (name) {
            case 'car':
                return <FontAwesome name="car" color={color} size={size} />;
            case 'light-flood-down':
                return <MaterialCommunity name="light-flood-down" color={color} size={size + 2} />;
            case 'bottle-water':
                return <FontAwesome6 name="bottle-water" color={color} size={size} />;
            case 'restroom':
                return <FontAwesome5 name="restroom" color={color} size={size} />;
            case 'sports-tennis':
                return <MaterialIcons name="sports-tennis" color={color} size={size + 2} />;
            default:
                return null; // Return null or a default icon if the name doesn't match any case
        }
    };

    const averagerating=()=>{
        let totalrating=0;
        review.map((item,index)=>{
            totalrating=totalrating+item.rating;
        });
        let len=review.length;
        const avg=totalrating/len;
        return Math.round(avg);
    }

    const renderreview = (item) => {
        console.log(item);
    }
    const addreview= async()=>{
        try {
            const token=await AsyncStorage.getItem('token');
            const response = await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/add_turf_review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    turfid: turfid,
                    token: token,
                    rating:rating,
                    comment:newreview,
                    type:alreadyreview!=null?'update':'add',
                }),
            });
            const data = await response.json();
            if (data.status === 1) {
                setmodal(false);
            } else {
                setmodal(false);
            }
        } catch (error) {
            null
        }
    }

    const createmodal=()=>{
        return (
            <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#f3f3ef',height:50/100*height,width:80/100*width,borderRadius:10,justifyContent:'center',alignItems:'center'}}>
            <View style={{justifyContent:'center',alignItems:'center',position:'absolute',top:'10%'}}>
                <Text style={{color:'black',fontSize:20}}>How Was Your Experience?</Text>
            </View>
            <View style={{width:'80%'}}>
                <View style={{overflow:'scroll'}}>
                <TextInput placeholder="Write a Review" value={newreview} onChangeText={(e)=>setnewreview(e)}  style={{ backgroundColor: 'white', color: 'black',margin: 10, padding: 10}} multiline={true} placeholderTextColor={'black'} />
                </View>         
               <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                {[...Array(5)].map((_,index)=>{
                    const temprating=index+1;
                    return(<TouchableOpacity activeOpacity={1} key={index} onPress={()=>setrating(temprating)} style={{margin:5}}>
                        <MaterialCommunity name={temprating<=rating?'star':'star-outline'} color={temprating<=rating?'gold':'black'}  size={25} />
                    </TouchableOpacity>)
                })}
                </View>
            </View>
            <View style={{flexDirection:'row',padding:5,margin:5,justifyContent:'center'}} >
                <TouchableOpacity style={{backgroundColor:'black',margin:5,padding:8,justifyContent:'center',alignItems:'center'}} onPress={()=>
                {
                    setmodal(false);
                }
            }>
                    <Text style={{color:'white',fontSize:17}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'black',margin:5,padding:8,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                    setloading(true);
                    const add=async()=>{
                        await addreview();
                        navigation.replace('Turf_Detail',{id:turfid});
                        setloading(false);
                        setmodal(false);
                    }
                    add();
                }}>
                    <Text style={{color:'white',fontSize:17}}>Add</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        );
    }

    if (loading) {
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={'large'} color={'black'} />
            </View>
        );
    }
    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{}}>
                <View>
                    <View>
                        {turf != null ? <FlatList
                            data={turf.image}
                            horizontal={true}
                            renderItem={renderImage}
                            pagingEnabled={false}
                            snapToAlignment='center'
                            snapToInterval={width}
                            decelerationRate={0.8}
                        /> : <Text>NO Images</Text>}
                    </View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'green', fontSize: 21 }}>{turf != null ? turf.name : 'Turf0000'}</Text>
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <View style={{ backgroundColor: 'darkblue', flexDirection: 'row', alignItems: 'center', margin: 2, padding: 3 }}>
                                <Text style={{ color: 'white' }}>{review!=null?averagerating().toString():'4'}/5</Text>
                                <MaterialCommunity name={'star'} color={'gold'} size={15} />
                            </View>
                            <Text style={{color:'black',fontSize:12}}>{review!=null?review.length:'0'} review</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={{ backgroundColor: 'seagreen', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>Book</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ color: "black", fontSize: 17, fontWeight: '400' }}>Ammenities</Text>
                        <View style={{ flexWrap: 'wrap', justifyContent: 'space-evenly', flexDirection: "row", paddingLeft: 15, paddingRight: 15, paddingBottom: 15 }}>
                            {turf != null ? turf.amenities.map((item, index) => {
                                return (
                                    <View key={index} style={{ alignItems: 'center', margin: 6, justifyContent: 'center', backgroundColor: '#011150', padding: 10, borderRadius: 5 }}>
                                        {getIconByName(item.icon, '#f7ca44', 25)}
                                        <Text style={{ color: 'white' }}>{item.name}</Text>
                                    </View>
                                );
                            }) : null}
                        </View>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>State : </Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>{turf != null ? turf.address.state : 'state'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'black', fontSize: 16 }}>City : </Text>
                                <Text style={{ color: 'black', fontSize: 16 }}>{turf != null ? turf.address.city : 'city'}</Text>
                            </View>
                        </View>
                        <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'black', fontSize: 16 }}>
                                {turf != null ? turf.address.address : 'Address not found'}
                            </Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 30 / 100 * height, width: 80 / 100 * width, borderColor: 'black', borderWidth: 1 }}>
                            {turf != null ? <MapView
                                style={{ ...StyleSheet.absoluteFillObject }}
                                region={{
                                    latitude: parseFloat(turf.latitude),
                                    longitude: parseFloat(turf.longitude),
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01
                                }}
                                >
                                
                                <Marker
                                    coordinate={{
                                        latitude: parseFloat(turf.latitude),
                                        longitude: parseFloat(turf.longitude),
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01
                                    }}
                                />
                            </MapView> : <Text>404 Not Found</Text>}
                        </View>
                    </View>
                    <View style={{ marginTop: 5 }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '500' }}>Reviews</Text>
                        </View>
                        <View>
                            {review!=null?review.map((item,index)=>{
                                return(
                                    <View key={index} style={{marginLeft:20,marginRight:20,marginBottom:10,padding:10,backgroundColor:'#c9fff2'}}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <MaterialIcons name={'person'} size={15} color={'darkblue'}/>
                                            <Text style={{color:'black'}}>Anonymous Player</Text>    
                                        </View>
                                        <View style={{marginTop:5}}>
                                            <Text style={{color:'darkblue'}}>{item.comment}</Text>    
                                        </View>
                                    </View>
                                ); 
                            }):<Text style={{color:'black'}}>No Reviews</Text>}
                        </View>
                        <View>


                            <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10 }} onPress={() => {
                                setmodal(true);
                            }}>
                                <Text style={{ color: 'white' }}>{alreadyreview!=null?'Update Review':'Add Review'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Modal
            transparent={true}
            visible={modal}
            onRequestClose={()=>{
                setnewreview('');
                setrating(0);
                setmodal(false);
            }}
            >
                {createmodal()}
            </Modal>
        </SafeAreaView>
    );
}
export default Turf_detail;