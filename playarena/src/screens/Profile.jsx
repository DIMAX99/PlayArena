import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Profile=()=>{
    
    return(
        <View>
            <View style={styles.infobox}>
                <Text>Name : </Text>
                <Text>User</Text>
            </View>
            <View style={styles.infobox}>
                <Text>Email : </Text>
                <Text>User</Text>
            </View>
            <View style={styles.infobox}>
                <Text>PhoneNumber : </Text>
                <Text>User</Text>
            </View>
        </View>
    );
}
const styles=StyleSheet.create({
    infobox:{
        flexDirection:'row'
    }
})

export default Profile;