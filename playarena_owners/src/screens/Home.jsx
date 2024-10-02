import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import { View,Text, TouchableOpacity,FlatList, Alert } from "react-native";
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack";
import Registerturfaddress from "./Registerturfaddress";
import Registerservices from "./Registerservices";
import Registerphoto from "./Registerturfphotos";
import CustomDrawerContent from "../assets/drawerstyle/drawercontentstyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../config";
import Manage from "./manageturf/manage";
import { ActivityIndicator } from "react-native";
import Managebookingsnav from "./manageturf/managebooking";

const Drawer=createDrawerNavigator();
const stack=createStackNavigator();
const stack1=createStackNavigator();
const manage=createStackNavigator();






const Hello=()=>{
    const [turfs,setturfs]=useState([]);
    const [loading, setLoading] = useState(false);
    const navigation=useNavigation();

      const renderamenity=({item})=>{
        return(
            <View style={{backgroundColor:'black',marginTop:10,marginLeft:15,marginRight:15,padding:16,borderRadius:10}}>
              <Text style={{color:'white',fontSize:18}}>Name : {item.name}</Text>
              <Text style={{color:'white',fontSize:18}}>City : {item.address.city}</Text>
              <View style={{justifyContent:'space-evenly',flexDirection:'row',marginTop:10}}>
                <TouchableOpacity style={{backgroundColor:'white',width:80,alignItems:'center',padding:10,borderRadius:15}} onPress={()=>navigation.navigate('Manageturf',{id:item._id})}>
                  <Text style={{fontSize:15,color:'black',fontWeight:'bold'}}>Manage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'white',width:80,alignItems:'center',padding:10,borderRadius:15}} onPress={()=>navigation.navigate('Book',{id:item._id})}>
                  <Text style={{fontSize:15,color:'black',fontWeight:'bold'}}>Booking</Text>
                </TouchableOpacity>
              </View> 
            </View>
        );
      }
      
      // useFocusEffect(() => {
      //   const fetchturf = async () => {
      //     try {
      //       const token = await AsyncStorage.getItem('token');
      //       const response = await fetch(`http://${config.ipAddress}:8003/api/owner/turf/fetchturf`, {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //         body: JSON.stringify({
      //           token: token,
      //         }),
      //       });
      //       const data = await response.json();
      //       if (data.status === 1) {
      //         console.log(data.message);
      //         setturfs(data.data);
      //         setLoading(false);
      //       } else {
      //         console.log(data.message);
      //         setLoading(false);
      //       }
      //     } catch (e) {
      //       console.log(e);
      //       setLoading(false);
      //     }
      //   };
      //   fetchturf();
      // }, []);

useFocusEffect(
  useCallback(() => {
    setLoading(true);
    const fetchturf = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://${config.ipAddress}:8003/api/owner/turf/fetchturf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
          }),
        });
        const data = await response.json();
        if (data.status === 1) {
          setturfs(data.data);
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



  if(loading){
    return(
      <View style={{height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <ActivityIndicator size={'large'} color={'black'}/>
      </View>
    );
  }

    return(
        <View style={{flex:1,position:'relative'}}>
            {/* <TouchableOpacity style={{backgroundColor:'black'}} onPress={()=>{
              fetchturf();
            }}>
              <Text style={{color:'white',fontSize:30}}>Show</Text>
            </TouchableOpacity> */}
             
            <View>
              {turfs.length>0?<FlatList 
              style={{marginBottom:100}}
              data={turfs}
              renderItem={renderamenity}
              keyExtractor={(turfs)=>turfs._id}
              scrollEnabled={true}
              />:<View style={{alignItems:'center'}}><Text style={{color:'black',fontSize:30,fontWeight:'bold',marginTop:50}}>No Turf Added Yet</Text></View>}
            </View>
             <View style={{position:'absolute',bottom:60,right:40,zIndex:2}}>
                <TouchableOpacity style={{backgroundColor:'white',justifyContent:'center',alignItems:'center',borderRadius:30,}} onPress={()=>navigation.navigate("register")}>
                    <Icon name="pluscircle"color={'black'} size={60}/>
                </TouchableOpacity> 
             </View>
        </View>
    );
}

const Registerstacknavigator=()=>{
    return(
    <stack.Navigator initialRouteName="RegisterServices">
        <stack.Screen name="RegisterServices" component={Registerservices}/>
        <stack.Screen name="Register1" component={Registerturfaddress}/>
        <stack.Screen name="Regsiterphoto" component={Registerphoto}/>
    </stack.Navigator>
    );
}

// const ManageStack=()=>{
//   return(
//   <manage.Navigator screenOptions={{headerShown:false}}>
//     <manage.Screen name="Manage" component={Manage}/>
//   </manage.Navigator>
//   );
// }

const Drawernavigator=()=>{
    return (
    <Drawer.Navigator drawerContent={(props)=><CustomDrawerContent{...props}/>}  screenOptions={{headerTitle:'PlayArena',headerStyle:{backgroundColor:'black'},headerTintColor:"white",headerTitleStyle:{fontWeight:'bold'}}}>
                <Drawer.Screen name="TurfBook" component={Hello}/>
    </Drawer.Navigator>
    );
}


const HomeScreen=()=>{
    return(
            <stack1.Navigator screenOptions={{headerShown:false}}>
                <stack.Screen name="Home" component={Drawernavigator}/>
                <stack.Screen name="register" component={Registerstacknavigator}/>
                <stack.Screen name="Manageturf" component={Manage}/>
                <stack.Screen name="Book" component={Managebookingsnav}/>
            </stack1.Navigator>
    );
}

export default HomeScreen;