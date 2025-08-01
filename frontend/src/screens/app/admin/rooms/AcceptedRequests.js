import { View, Text, RefreshControl, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   black,
   lightGray,
   lightGreen,
   primaryBlue,
   textDarkGray,
   white,
} from "../../../../constants/Colors";
import { Button, List } from "react-native-paper";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import RoomDetails from "./RoomDetails";

const AcceptedRoomRequests = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

   // const data = require("../../../../data/dummyData.json");

   const [data, setData] = useState([]);
 
   const fetchAppectedRequest = async (values) => {
     try {
       const token = await AsyncStorage.getItem("userToken"); // Retrieve token
       if (!token) {
         Alert.alert("Error", "Authentication failed. Please login again.");
         return;
       }
       const response = await axios.get(`${baseUrl}room-requests/accepted`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
 
       setData(response.data);
     } catch (error) {
       console.error(error);
       Alert.alert(
         "Error",
         error?.response?.data?.message || "Failed to submit room request."
       );
     }
   };
 
   const onRefresh = useCallback(() => {
     setRefreshing(true);
     fetchAppectedRequest();
     setTimeout(() => {
       setRefreshing(false);
     }, 1500);
   }, []);
   useFocusEffect(() => {
     fetchAppectedRequest();
   });

   return (
      <View style={{ flex: 1, backgroundColor: white, minHeight: "100%" }}>
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <View style={styles.listContainer}>
                  <FlatList
                     data={data}
                     refreshControl={
                        <RefreshControl
                           refreshing={refreshing}
                           onRefresh={onRefresh}
                        />
                     }
                     renderItem={({ item }) => {
                        return (
                           <List.Item
                              key={item.id}
                              title={item?.userId?.full_name}
                              description={item?.userId?.registration_no}
                              left={(color = textDarkGray) => (
                                 <List.Icon
                                    color={color}
                                    icon={"account-circle"}
                                 />
                              )}
                              right={(props) => (
                                 <List.Icon {...props} icon={"chevron-right"} />
                              )}
                              style={{
                                 paddingLeft: 15,
                                 elevation: 5,
                                 backgroundColor: lightGreen, //remove
                                 marginVertical: 8, //remove
                                 borderRadius: 8, //remove
                              }}
                              titleStyle={{ fontFamily: "fontRegular" }}
                              descriptionStyle={{
                                 fontFamily: "fontRegular",
                                 marginTop: -5,
                              }}
                              onPress={() => {
                                 navigation.navigate("AdminRoomDetails",{item}); //placeholder navigation
                              }}
                           />
                        );
                     }}
                     style={styles.listStyles}
                     showsVerticalScrollIndicator={false}
                     ListEmptyComponent={
                        <View>
                           <Text
                              style={{
                                 fontFamily: "fontBold",
                                 textAlign: "center",
                                 fontSize: 16,
                                 marginHorizontal: 15,
                              }}
                           >
                              There are no current accepted room requests!
                           </Text>
                        </View>
                     }
                     ListHeaderComponent={
                        <View>
                           <Text
                              style={{
                                 fontFamily: "fontBold",
                                 fontSize: 20,
                                 textAlign: "center",
                                 marginVertical: 10,
                              }}
                           >
                              Accepted Requests
                           </Text>
                        </View>
                     }
                  />
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   contentContainer: {
      flex: 1,
      width: "90%",
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
   },
});

export default AcceptedRoomRequests;
