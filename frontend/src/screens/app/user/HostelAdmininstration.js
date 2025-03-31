import { View, Text, RefreshControl, StyleSheet, TouchableOpacity,Linking, Alert,ActionSheetIOS  } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   alaBaster,
   black,
   darkGreen,
   darkRed,
   lightGray,
   primaryBlue,
   textDarkGray,
   white,
   green,
} from "../../../constants/Colors";
import { Button, List, TouchableRipple, Avatar } from "react-native-paper";
import { useCallback, useState } from "react";
import HostelAdministrationCard from "../../../components/HostelAdministrationCard";


const HostelAdministration = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

   const data = require("../../../data/dummyData.json");

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

    const openDialer = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Failed to open dialer');
    });
  };
  const openMail = (email) => {
   const url = `mailto:${email}`;
   Linking.openURL(url).catch((err) => {
     Alert.alert('Error', 'Failed to open mail app');
   });
 };

  const options = (phoneNumber,email) =>
   ActionSheetIOS.showActionSheetWithOptions(
     {
       options: ['Cancel', 'Call', 'Mail'],
       destructiveButtonIndex: 2,
       cancelButtonIndex: 0,
       userInterfaceStyle: 'dark',
     },
     buttonIndex => {
       if (buttonIndex === 0) {
         // cancel action
       } else if (buttonIndex === 1) {
         openDialer(phoneNumber);
       } else if (buttonIndex === 2) {
         openMail(email);
       }
     },
   );

   return (
      <ScrollView>
         <View style={{ flex: 1, backgroundColor: alaBaster, minHeight: "100%" }}>
            <View style={styles.container}>
               <View style={styles.contentContainer}>
                  <TouchableOpacity onPress={()=>options('0712345678','vikas@gmail.com')} > 
                  <HostelAdministrationCard
                     name="Mr. Vikas Singh"
                     position="Warden"
                     phone_no={"0712345678"}
                     email={"vikas@email.com"}
                  />
                  </TouchableOpacity>
                  <View style={styles.adminCards}>
                  <TouchableOpacity onPress={()=>options('9867553745','mann@email.com')} > 
                     <HostelAdministrationCard
                        name="Mr. Manjeet Singh"
                        position="Sub Warden"
                        phone_no={"9867553745"}
                        email={"mann@email.com"}
                     />
                     </TouchableOpacity>
                     <TouchableOpacity onPress={()=>options('7866453858','surjeet@email.com')} > 
                     <HostelAdministrationCard
                        name="Mr. Surjeet Singh"
                        position="Part-time Sub Warden"
                        phone_no={"7866453858"}
                        email={"surjeet@email.com"}
                     />
                     </TouchableOpacity>
                  </View>
                  
                  <View style={styles.adminCards}>
                  <TouchableOpacity onPress={()=>options('9865473644','anand@email.com')} > 
                     <HostelAdministrationCard
                        name="Mr. Anand"
                        position="Sub Warden"
                        phone_no={"9865473644"}
                        email={"anand@email.com"}
                     />
                     </TouchableOpacity>
                     <TouchableOpacity onPress={()=>options('7234567598','preet@email.com')} >
                     <HostelAdministrationCard
                        name="Mr. Preet ji"
                        position="Part-time Sub Warden"
                        phone_no={"7234567598"}
                        email={"preet@email.com"}
                     />
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: alaBaster,
   },
   contentContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
   },
   title: {
      width: "90%",
      fontFamily: "Roboto Regular",
      fontSize: 16,
      marginVertical: 10,
   },
   listContainer: {
      flex: 1,
      width: "100%",
   },
   listStyles: {
      flex: 1,
      marginTop: 10,
   },
   imageContainer: {
      backgroundColor: green,
      width: 50,
      height: 50,
      borderRadius: 50,
      alignSelf: "center",
   },
   adminCards: {
      flexDirection: "row",
      gap: 10,
   },
});

export default HostelAdministration;
