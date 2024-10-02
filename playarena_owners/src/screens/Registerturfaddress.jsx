import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import cityarr from '../assets/citylist';


const Registerturfaddress = ({ navigation }) => {
    const states=[
        {"label":'Select State',"value":'0'},
        { "label": "Andaman and Nicobar Islands", "value": "AN" },
        { "label": "Andhra Pradesh", "value": "AP" },
        { "label": "Arunachal Pradesh", "value": "AR" },
        { "label": "Assam", "value": "AS" },
        { "label": "Bihar", "value": "BR" },
        { "label": "Chandigarh", "value": "CG" },
        { "label": "Chhattisgarh", "value": "CH" },
        { "label": "Dadra and Nagar Haveli", "value": "DN" },
        { "label": "Daman and Diu", "value": "DD" },
        { "label": "Delhi", "value": "DL" },
        { "label": "Goa", "value": "GA" },
        { "label": "Gujarat", "value": "GJ" },
        { "label": "Haryana", "value": "HR" },
        { "label": "Himachal Pradesh", "value": "HP" },
        { "label": "Jammu and Kashmir", "value": "JK" },
        { "label": "Jharkhand", "value": "JH" },
        { "label": "Karnataka", "value": "KA" },
        { "label": "Kerala", "value": "KL" },
        { "label": "Ladakh", "value": "LA" },
        { "label": "Lakshadweep", "value": "LD" },
        { "label": "Madhya Pradesh", "value": "MP" },
        { "label": "Maharashtra", "value": "MH" },
        { "label": "Manipur", "value": "MN" },
        { "label": "Meghalaya", "value": "ML" },
        { "label": "Mizoram", "value": "MZ" },
        { "label": "Nagaland", "value": "NL" },
        { "label": "Odisha", "value": "OR" },
        { "label": "Puducherry", "value": "PY" },
        { "label": "Punjab", "value": "PB" },
        { "label": "Rajasthan", "value": "RJ" },
        { "label": "Sikkim", "value": "SK" },
        { "label": "Tamil Nadu", "value": "TN" },
        { "label": "Telangana", "value": "TS" },
        { "label": "Tripura", "value": "TR" },
        { "label": "Uttar Pradesh", "value": "UP" },
        { "label": "Uttarakhand", "value": "UK" },
        { "label": "West Bengal", "value": "WB" }
      ]      
      const [value, setValue] = useState('');
      const [cityvalue,setcityvalue]=useState('');
      const [citydata,setcitydata]=useState([]);
    const route = useRoute();
    const { turfname, description, amenities } = route.params || {};
    const [address, setaddress] = useState('');
    const [loading,setloading]=useState(false);
    const [location, setlocation] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    console.log(amenities,amenities.length)
    const [selectedlocation, setselectedlocation] = useState(null);
    const locationdrop = async (event) => {
        const { coordinate } = event.nativeEvent;
        setlocation({
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        setselectedlocation(location);

        // try{  geoccoder api must be enabled and billing also
        //     const loc=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=AIzaSyB206gxM0hrXLqZcVtIOYlUC2MEjtcYl24`);
        //     const data=await loc.json();
        //     console.log(data);
        // }catch(e){
        //     console.log(e);
        // }
    }
    const getuserpermission = () => {
        Geolocation.getCurrentPosition(position => {
            console.log(position);
            setlocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
        )
    }
    const requestlocationpermission = async () => {
        if (Platform.OS == 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,);
                if (granted) {
                    console.log('granted');
                    getuserpermission();
                } else {
                    Alert.alert('permission denied');
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    useEffect(() => {
        requestlocationpermission();
    }, []);

    if(loading){
        return(
          <View style={{backgroundColor:'rgba(0,0,0,0)',zIndex:30,...StyleSheet.absoluteFillObject,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={'large'} color={'black'}/>
          </View>
        );
      }

    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <View style={styles.regheadcon}>
                <Text style={styles.reghead}>Register Turf</Text>
                <Text style={styles.regheadsmall}>Turn Your Turf Into a Must-Play Destination!</Text>
            </View>
            <View style={styles.regformcon}>
            <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={states}
          maxHeight={300}
          labelField="label"
          valueField="label"
          placeholder={'Select State'}
          value={value}
          itemTextStyle={{color:'black'}}
          onChange={item => {
            setloading(true);
            setValue(item.label);
            setcitydata(cityarr.filter((item2)=>item2.state===item.label));
            setloading(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={citydata}
          maxHeight={300} 
          labelField="city"
          valueField="city"
          placeholder={'Select City'}
          value={cityvalue}
          itemTextStyle={{color:'black'}}
          onChange={item => {
            setcityvalue(item.city);
          }}
        />
                <View style={styles.inputcon}>
                    <Text style={styles.inputlab}>Address :</Text>
                    <TextInput style={styles.input} placeholder='Location' value={address} onChangeText={(v) => setaddress(v)} />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: 300, width: 310, borderColor: 'black', borderWidth: 2 }}>
                        <MapView
                            style={{ ...StyleSheet.absoluteFillObject }}
                            region={location}
                            onPress={locationdrop}
                            showsUserLocation={true}
                        >
                            <Marker
                                coordinate={location}
                                title={'Testing'}
                            // description={marker.description}
                            />
                        </MapView>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.nextbtn} onPress={() =>{
                    setloading(true);
                    setTimeout(()=>{
                        if(address===''){
                            Alert.alert('Address is Required');
                        }
                        else{
                            setloading(false);
                            navigation.navigate('Regsiterphoto', { turfname: turfname, description: description, amenities: amenities, address: {state:value,city:cityvalue,address:address}, location: location })
                        }
                    },1000);  
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }} >Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    regheadcon: {
        backgroundColor: 'black',
        padding: 20,
    },
    reghead: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Roboto-Regular',
    },
    regheadsmall: {
        color: 'grey',
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
    },
    regformcon: {
        padding: 20,
    },
    inputcon: {
        flexDirection: 'row',
    },
    inputlab: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
    },
    input: {
        flex: 3,
        color: 'black',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    nextbtn: {
        backgroundColor: 'black',
        padding: 15,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },container: {
        backgroundColor: 'white',
        padding: 16,
      },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom:10
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        color:'black'
      },
      placeholderStyle: {
        fontSize: 16,
        color:'black'
      },
      selectedTextStyle: {
        fontSize: 16,
        color:'black'
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },

});
export default Registerturfaddress;