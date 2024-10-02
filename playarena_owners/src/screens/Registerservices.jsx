import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
    Button,
    TouchableOpacity,
    Alert,
    FlatList,
    Switch,
    ActivityIndicator,
  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/MaterialIcons';

const Registerservices = ({navigation}) => {
  const [turfname,setturfname] = useState('');
  const [desc,setdesc] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading,setloading]=useState(false);
  const amenities = [
    {id:'1',name:'Parking',icon:"car"},
    {id:'2',name:'Flood Lights',icon:"light-flood-down"},
    {id:'3',name:'Drinking Water',icon:"bottle-water"},
    {id:'4',name:'Washroom',icon:"restroom"},
    {id:'5',name:'Equipments',icon:"sports-tennis"}];

    const getIconByName = (name, color, size) => {
      switch (name) {
        case 'car':
          return <Icon name="car" color={color} size={size} />;
        case 'light-flood-down':
          return <Icon1 name="light-flood-down" color={color} size={size+2} />;
        case 'bottle-water':
          return <Icon2 name="bottle-water" color={color} size={size} />;
        case 'restroom':
          return <Icon3 name="restroom" color={color} size={size} />;
        case 'sports-tennis':
          return <Icon4 name="sports-tennis" color={color} size={size+2} />;
        default:
          return null; // Return null or a default icon if the name doesn't match any case
      }
    };

    const handlePress = (id, name,icon) => {
      setSelectedAmenities(prevSelected => {
          // Check if the amenity is already selected
          const isSelected = prevSelected.some(item => item.id === id);
          if (isSelected) {
              // Remove the item from the list if it's already selected
              return prevSelected.filter(item => item.id !== id);
          } else {
              // Add the item to the list if it's not selected
              return [...prevSelected, { id, name ,icon }];
          }
      });
  };
  if(loading){
    return(
      <View style={{backgroundColor:'rgba(0,0,0,0)',zIndex:30,...StyleSheet.absoluteFillObject,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size={'large'} color={'black'}/>
      </View>
    );
  }

  const renderamenity=({item})=>{
    const isSelected = selectedAmenities.some(amenity => amenity.id === item.id);
    return(
    <TouchableOpacity style={[styles.selected,isSelected?{backgroundColor:'black'}:null]} onPress={()=>handlePress(item.id,item.name,item.icon)}>
      <Text>{getIconByName(item.icon,'white',21)}</Text>
      <Text style={{color:'white',marginTop:10,justifyContent:'center',alignItems:'center'}}>{item.name}</Text>
    </TouchableOpacity>
    );
  }
    return (

        <View style={{ backgroundColor: 'white', height: '100%',zIndex:-10 }}>
            <View style={styles.regheadcon}>
                <Text style={styles.reghead}>Register Turf</Text>
                <Text style={styles.regheadsmall}>Turn Your Turf Into a Must-Play Destination!</Text>
            </View>
            <View style={styles.regformcon}>
                <View style={styles.inputcon}>
                    <Text style={styles.inputlab}>Turf Name :</Text>
                    <TextInput style={styles.input} placeholder='Turf Name' value={turfname} onChangeText={(v)=>setturfname(v)}/>
                </View>
                <View style={styles.inputcon}>
                    <Text style={[styles.inputlab]}>Description :</Text>
                    <TextInput style={styles.input} placeholder='Description' value={desc} onChangeText={(v)=>setdesc(v)}  />
                </View>
            </View>

            <View>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'black',fontSize:17}}>Select Amenities Provided : </Text>
              </View>
              <FlatList 
              data={amenities}
              renderItem={renderamenity}
              keyExtractor={(item)=>item.id}
              numColumns={3}
              />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.nextbtn} onPress={()=>{
                  setloading(true);
                  setTimeout(()=>{
                    setloading(false);
                    if(turfname===''||desc===''||selectedAmenities.length===0){
                      Alert.alert('All Details are Required');
                    }else{
                      navigation.navigate("Register1",{turfname:turfname,description:desc,amenities:selectedAmenities});
                    }
                  },1000);
                  }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    regheadcon:{
      backgroundColor:'black',
      padding:20,
    },
    selected:{
      backgroundColor:'grey',
      margin:15,
      height:100,
      width:90,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:15
    },
    reghead:{
      color:'white',
      fontSize:20,
      fontFamily:'Roboto-Regular',
    },
    regheadsmall:{
      color:'grey',
      fontSize:15,
      fontFamily:'Roboto-Regular',
    },
    regformcon:{
      padding:20,
    },
    inputcon:{
      flexDirection:'row',
    },
    inputlab:{
      flex:1.5,
      textAlign:'center',
      textAlignVertical:'center',
      color:'black',
      fontSize:15,
      fontFamily:'Roboto-Regular',
    },
    input:{
      flex:3,
      color:'black',
      borderBottomColor:'black',
      borderBottomWidth:1,
    },
    nextbtn:{
      backgroundColor:'black',
      padding:15,
      width:80,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:12,
    }

});


export default Registerservices;