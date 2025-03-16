import { View, Text, RefreshControl, StyleSheet } from "react-native";
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

   return (
      <ScrollView>
         <View style={{ flex: 1, backgroundColor: alaBaster, minHeight: "100%" }}>
            <View style={styles.container}>
               <View style={styles.contentContainer}>
                  <HostelAdministrationCard
                     name="Mr. Vikas Singh"
                     position="Warden"
                     phone_no={"0712345678"}
                     email={"vikas@email.com"}
                  />
                  <View style={styles.adminCards}>
                     <HostelAdministrationCard
                        name="Mr. Manjeet Singh"
                        position="Sub Warden"
                        phone_no={"0712343678"}
                        email={"mann@email.com"}
                     />
                     <HostelAdministrationCard
                        name="Mr. Surjeet Singh"
                        position="Part-time Sub Warden"
                        phone_no={"0712123678"}
                        email={"surjeet@email.com"}
                     />
                  </View>
                  <View style={styles.adminCards}>
                     <HostelAdministrationCard
                        name="Mr. Anand"
                        position="Sub Warden"
                        phone_no={"0712343678"}
                        email={"anand@email.com"}
                     />
                     <HostelAdministrationCard
                        name="Mr. Preet ji"
                        position="Part-time Sub Warden"
                        phone_no={"0712123678"}
                        email={"preet@email.com"}
                     />
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
