import React from "react";
import { View,Text, TouchableOpacity,FlatList, Alert } from "react-native";
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import config from "../../config";
import { ActivityIndicator } from "react-native";
const Manage2=({route})=>{
    let turfid = route.params.id;
    const [turf,setturf]=useState([]);
    const [loading, setLoading] = useState(false);
    const navigation=useNavigation();
    useFocusEffect(
        useCallback(() => {
          setLoading(true);
          const fetchturf = async () => {
            try {
              const response = await fetch(`http://${config.ipAddress}:8003/api/owner/turf/get_turf_details`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  turfid,
                }),
              });
              const data = await response.json();
              if (data.status === 1) {
                setturf(data.data);
              } else {
                Alert.alert('Server Error');
              }
              setLoading(false); // This should be outside the if-else block
            } catch (e) {
              console.log(e);
              setLoading(false);
            }
          };
          
          fetchturf();
        }, []) // Empty dependency array means it will run every time the screen is focused
      );

      const deleteturf=async()=>{
        try{
            const response=await fetch(`http://${config.ipAddress}:8003/api/owner/turf/delete_turf`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  turfid,
                }),
            });
            const data=await response.json();
            if(data.status==1){
                navigation.replace('Home');
            }else{
                Alert.alert('Deletion Failed');
            }
        }catch(error){
            Alert.alert('SomeThing Went Wrong');
        }
      }




      if(loading){
        return(
          <View style={{height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
            <ActivityIndicator size={'large'} color={'black'}/>
          </View>
        );
      }
    return(
        <View>
            <View>
                <Text style={{color:'black'}}>Name : {turf.name}</Text>
            </View>
            <View>
                <Text style={{color:'black'}}>Description : {turf.description}</Text>
            </View>
            <View>
                <TouchableOpacity style={{backgroundColor:'red',padding:5,margin:10}} onPress={()=>{
                    Alert.alert('Delete Turf',`Do You Want to Delete ${turf?turf.name.toString():'Turf'}`,[
                        {
                            text:'OK',
                            onPress:()=>deleteturf(),
                        },
                        {
                            text:'Cancel',
                            style:'cancel',
                        }
                    ]);
                    
                }}>
                    <Text style={{fontSize:15,color:'white'}}>Delete Turf</Text>
                </TouchableOpacity>
            </View>
        </View>
       
        
    );
}

export default Manage2;