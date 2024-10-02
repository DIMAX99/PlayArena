import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, View,Text, TextInput, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from "react-native"
import config from "../connection/config";
import Antdesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontawesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native";
const{height,width}=Dimensions.get('screen');
import { useFocusEffect } from "@react-navigation/native";

const Turf=()=>{
    const [turf_list_arr,set_turf_list]=useState([]);
    const navigation=useNavigation();
    const [review, setreview] = useState([]);
    const getturfs=async()=>{
        try{
            const response=await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turfs_list`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            });
            const data=await response.json();
            if(data.status==1){
                const turflistwithreview=await Promise.all(data.turfs_list.map(async(turf)=>{
                    const reviewres=await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turf_review`,{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify({
                            turfid:turf._id,
                        }),
                    });
                    const reviewdata=await reviewres.json();
                    if(reviewdata.status===1){
                        const totalreview=reviewdata.reviewlist.reduce((acc,review)=>acc+review.rating,0);
                        const averagerating=totalreview/reviewdata.reviewlist.length;
                        return {...turf,averagerating};
                    }else{
                        return {...turf,averagerating:0};
                    }
                }));
                set_turf_list(turflistwithreview);
            }else{
                Alert.alert('Server Error');
            }
        }catch(error){
            console.log(error);
            Alert.alert('Something went wrong');
        }
    }
   useFocusEffect(useCallback(()=>{
    getturfs();
   },[]));
    // console.log(turf_list_arr);
    const getturfswithname=async(name)=>{
        try{
            const response=await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turfs_list`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            });
            const data=await response.json();
            if(data.status==1){
                const turflistwithreview=await Promise.all(data.turfs_list.map(async(turf)=>{
                    const reviewres=await fetch(`http://${config.ipAddress}:${config.port}/api/user/get_turfs/get_turf_review`,{
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json',
                        },
                        body:JSON.stringify({
                            turfid:turf._id,
                        }),
                    });
                    const reviewdata=await reviewres.json();
                    if(reviewdata.status===1){
                        const totalreview=reviewdata.reviewlist.reduce((acc,review)=>acc+review.rating,0);
                        const averagerating=totalreview/reviewdata.reviewlist.length;
                        return {...turf,averagerating};
                    }else{
                        return {...turf,averagerating:0};
                    }
                }));
                const temp=turflistwithreview.filter((items)=>items.name.startsWith(name));
                if(temp.length>0){
                    set_turf_list(temp);
                }else{
                    set_turf_list([]);
                }
                
            }else{
                Alert.alert('Server Error');
            }
        }catch(error){
            console.log(error);
            Alert.alert('Something went wrong');
        }
    }


   const renderturflist=({item})=>{
   
        return(
            <TouchableOpacity key={item._id} style={{elevation:10}} activeOpacity={0.9} onPress={()=>{
                navigation.navigate('Turf_Detail',{id:item._id});
            }}>
            <View  style={{flexDirection:'row',margin:10,borderRadius:7,borderWidth:2,borderColor:'seagreen',overflow:'hidden'}}>
                <View style={{flex:3}}>
                    <Image source={{uri:item.image[0].uri}} style={{marginRight:5,flex:1}}/>
                </View>
                <View style={{flex:4,padding:5}}>
                   <View style={{margin:2}}>
                        <Text style={{color:'black',fontSize:16}}>{item.name}</Text>
                   </View>
                   <View style={{flexDirection:'row',margin:4}}>
                        <View style={{flexDirection:'row',padding:1,borderRadius:3,alignItems:'center',borderColor:'black',borderWidth:1,paddingRight:2}}>
                            <Fontawesome name='star' color={'gold'} size={16}/>
                            <Text style={{color:'black',marginLeft:3}}>{item.averagerating}/5</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',marginLeft:25}}>
                            <Fontawesome name='map-marker' color={'red'} size={16}/>
                            <Text style={{color:'black',marginLeft:3}}>{item.address.city}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',margin:3}}>
                        <Text style={{color:'black',marginRight:10}}>Rs.450 onwards</Text>
                        <TouchableOpacity style={{width:'40%',backgroundColor:'seagreen',alignItems:'center',borderRadius:6, padding:5}} onPress={()=>{
                            navigation.navigate('Booking_Turf',{id:item._id});
                        }}>
                            <Text style={{color:'white',fontSize:14}}>Book</Text>
                        </TouchableOpacity>
                    </View>
                </View>    
            </View>
            </TouchableOpacity>
        );
   }


    return(
    <View style={{flex:1}}>
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View style={styles.searchcontainer}>
                <View style={{flex:0.5}}>
                <Antdesign name={'search1'} size={25} color={'black'}/>
                </View>
                <View style={{flex:4}}>
                <TextInput placeholder="Search" placeholderTextColor={'black'} style={{fontSize:17,color:'black'}} onChangeText={(e)=>{
                    if(e===''){
                        getturfs();
                    }else{
                        getturfswithname(e);
                    }
                }}/>
                </View>
            </View>
            <TouchableOpacity style={{flex:0.5}}>
                <Ionicons name='filter'color={'black'} size={30} />
            </TouchableOpacity>
            <View>
                
            </View>
        </View>
            {turf_list_arr.length>0?<FlatList
            style={{marginBottom:10}}
            data={turf_list_arr}
            renderItem={renderturflist}
            keyExtractor={item=>item._id}
            scrollEnabled={true}
            />:(<View style={{justifyContent:'center',alignItems:'center'}}><Text style={{color:'black',fontSize:20,fontFamily:'Poppins-Regular'}}>No Turf Found</Text></View>)}
    </View>
);}

const styles=StyleSheet.create({
    searchcontainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'lightgrey',
        margin:4/100*width,
        padding:1/100*width,
        flex:3
    }
})

export default Turf;