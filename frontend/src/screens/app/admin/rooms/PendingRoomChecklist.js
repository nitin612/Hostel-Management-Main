import { View, Text, RefreshControl, FlatList, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   black,
   lightGray,
   primaryBlue,
   textDarkGray,
   white,
} from "../../../../constants/Colors";
import { Avatar, Button, List } from "react-native-paper";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import { useFocusEffect } from "@react-navigation/native";

const PendingRoomChecklist = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

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
                              key={item._id}
                              title={item.userId.full_name}
                              description={item.userId.email}
                              left={(color = textDarkGray) => (
                                 <View style={styles.imageContainer}>
                                    <Avatar.Image
                                       size={50}
                                       source={require("../../../../../assets/images/profile_pic.png")}
                                    />
                                 </View>
                              )}
                              right={(props) => (
                                 <List.Icon {...props} icon={"chevron-right"} />
                              )}
                              style={{
                                 paddingLeft: 15,
                                 width: "90%",
                                 alignSelf: "center",
                                 backgroundColor: white, //remove
                                 marginVertical: 8, //remove
                                 borderRadius: 8, //remove
                                 elevation: 5,
                              }}
                              titleStyle={{ fontFamily: "fontRegular" }}
                              descriptionStyle={{
                                 fontFamily: "fontRegular",
                                 marginTop: -5,
                              }}
                              onPress={() => {
                                 navigation.navigate("AdminRoomChecklistForm", {
                                    checklist_form: item,
                                 }); //placeholder navigation
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
                                 marginHorizontal: 15,
                              }}
                           >
                              There are no current pending room checklists!
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
                              Pending Room Checklists
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
   },
   imageContainer: {
      backgroundColor: primaryBlue,
      width: 50,
      height: 50,
      borderRadius: 50,
   },
});

export default PendingRoomChecklist;
