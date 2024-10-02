import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedKeyboard } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
    const navigation=useNavigation();
  const signout=()=>{
    AsyncStorage.setItem('isLoggedIn','false');
    AsyncStorage.setItem('token','');
    navigation.reset({
      index:0,
      routes:[{name:'Login'}],
    });
  }
  return (
    <SafeAreaView style={{flex:1,paddingBottom:20}}>
      <View style={{padding:20}}>
                    <View style={{borderColor:'darkblue',borderTopWidth:10,borderLeftWidth:10,borderRightWidth:10,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:10,fontFamily:'Poppins-Regular'}}></Text>
                    </View>
                    <View style={{alignItems:"center",marginTop:5,marginBottom:5,justifyContent:'center',borderColor:'darkblue',borderLeftWidth:10,borderRightWidth:10,}}>
                        <Text style={{color:'black',fontSize:30,fontFamily:'Poppins-Regular'}}>PlayArena</Text>
                    </View>
                    <View style={{borderColor:'darkblue',borderBottomWidth:10,borderLeftWidth:10,borderRightWidth:10,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{color:'black',fontSize:10,fontFamily:'Poppins-Regular'}}></Text>
                    </View>
      </View>
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      
      <View style={{ flex: 1 }}>
        {/* Drawer items */}
        <DrawerItemList {...props} />

        {/* Sign out button */}
      </View>
    </DrawerContentScrollView>
    <View style={styles.signOutButtonContainer}>
          <Button title="Sign Out" onPress={() => {
            console.log('out');
            signout();
            // props.navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'Login' }], // Replace 'Login' with your actual login screen name
            // });
          }} />
        </View>
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  signOutButtonContainer: {
    marginBottom: 20, // Adjust this to position the button correctly
    paddingHorizontal: 20,
  },
});

export default CustomDrawerContent;
