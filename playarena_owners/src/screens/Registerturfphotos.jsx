import React, { useEffect,useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import config from "../config";
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Registerphoto=({navigation})=>{
    const route=useRoute();
    const [isdisable,setdisabled]=useState(true);
    const [loading,setloading]=useState(false);
    const [uploadimage,setuploadimages]=useState([]);
    const {turfname,description,amenities,address,location} = route.params || {};
    // console.log(turfname,description,amenities,address,location);
    const requestphotopermission = async () => {
        if (Platform.OS == 'android') {
            const permissionToRequest = Platform.Version >= 33 
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES // For Android 13 and above
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
            try {
                const grant = await PermissionsAndroid.request(permissionToRequest);
                if (grant=== PermissionsAndroid.RESULTS.GRANTED) {
                    setdisabled(false);
                } else {
                    Alert.alert('permission denied');
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    useEffect(() => {
        requestphotopermission();
    }, []);
        const [images,setimages]=useState([]);

        const selectimages=()=>{
            launchImageLibrary({mediaType:'photo',selectionLimit:0,includeBase64:true,quality:1},(response)=>{
            if(response.didCancel){
                console.log('user cancel photo selection');
            }
            else if(response.errorCode){
                console.log(response.errorMessage);
            }        
            else{
                const selectedimages=response.assets.map(asset=>({
                    uri:asset.uri,
                    name:asset.fileName,
                    type:asset.type
                }));
                setimages(selectedimages);
                console.log(typeof(selectedimages),selectedimages);
                
            }
        });
    }
   
    const uploadimagetofirebase=async()=>{
        const newimage=[]
        for (const element of images){
            const imageuri=element.uri;
            const imagename = `${element.name}_${Date.now()}${Math.floor(Math.random() * 1000)}`;

            if (!imageuri || !imagename) {
                console.log("Invalid image URI or name:", { imageuri, imagename });
                continue; // Skip this iteration if invalid
            }

            try{
                const data=await storage().ref(imagename).putFile(imageuri);
                if(data){
                    const uri=await storage().ref(imagename).getDownloadURL();
                    newimage.push({uri:uri});
                }
            }catch(error){
                console.log(error);
            }
        };
       return newimage;
    }       

    const addturf=async()=>{
        try{
            const token=await AsyncStorage.getItem('token');
            const response=await fetch(`http://${config.ipAddress}:8003/api/owner/addturf/addnewturf`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify({
              token:token,
              name:turfname,
              description:description,
              amenities:amenities,
              latitude:location.latitude,
              longitude:location.longitude,
              address:address,
              images:uploadimage,
            }),
          });
          const data=await response.json();
          if(data.status==1){
            setloading(false);
            navigation.replace('Manageturf',{id:data.data});
          }else{
            console.log('gadbad');
          }
        }catch(e){
          console.log(e);
        }
      }

      if(loading){
        return(
          <View style={{backgroundColor:'rgba(0,0,0,0)',zIndex:30,...StyleSheet.absoluteFillObject,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={'large'} color={'black'}/>
          </View>
        );
      }
    return(
        
        <View>
            <View style={{flexDirection:'row',padding:30,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'black',flex:2,fontSize:17}}>Add Images :</Text>
                    <TouchableOpacity disabled={isdisable} style={{backgroundColor:isdisable?'grey':'black',flex:3,padding:14,borderRadius:20,alignItems:'center'}} onPress={()=>{selectimages();}}>
                        <Text style={{color:'white'}}>Upload</Text>
                    </TouchableOpacity>
            </View>
        <ScrollView style={{height:500}}>
            {images.map((image,index)=>(
                <View key={index} style={{alignItems:'center',margin:10}}>
                    <Image source={{uri:image.uri}} style={{width:'80%',height:200}}/>
                </View>
            ))}
        </ScrollView>
        <View style={{alignItems:'center'}}>
            <TouchableOpacity style={{backgroundColor:'black',width:80,padding:10}}  onPress={()=>{
                    setloading(true);
                    if(images.length===0){
                        setloading(false);
                        Alert.alert('Select Atleast 1 Photo');
                    }else{
                        uploadimagetofirebase().then((newimage)=>{
                            setuploadimages(newimage);
                            addturf();
                            setloading(false);
                        })
                    }
                    }}>
                <Text style={{color:'white',fontSize:15}}>Add Turf</Text>
            </TouchableOpacity>
        </View>
        </View> 
        
    );
}

export default Registerphoto;