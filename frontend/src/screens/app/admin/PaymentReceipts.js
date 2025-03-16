import { View, Text, RefreshControl, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   alaBaster,
   black,
   lightGray,
   primaryBlue,
   textDarkGray,
   white,
} from "../../../constants/Colors";
import { Button, List, Avatar } from "react-native-paper";
import { useCallback, useState } from "react";

const PaymentReceipts = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

   const data = require("../../../data/dummyData.json");

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

   return (
      <View style={{ flex: 1, backgroundColor: white, minHeight: "100%" }}>
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <View style={styles.listContainer}>
                  <FlatList
                     data={data.payment_receipts}
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
                              title={item.name}
                              description={<Text>{`${item.amount}`}</Text>}
                              left={(color = textDarkGray) => (
                                 <View style={styles.imageContainer}>
                                    <Avatar.Image
                                       size={50}
                                       source={require("../../../../assets/images/profile_pic.png")}
                                    />
                                 </View>
                              )}
                              right={(props) => (
                                 <List.Icon
                                    {...props}
                                    icon={"chevron-right"}
                                    style={{ alignItems: "center" }}
                                 />
                              )}
                              style={{
                                 paddingLeft: 15,
                                 elevation: 5,
                                 width: "90%",
                                 alignSelf: "center",
                                 backgroundColor: white,
                                 marginVertical: 8, //remove
                                 borderRadius: 8, //remove
                              }}
                              titleStyle={{ fontFamily: "fontRegular" }}
                              descriptionStyle={{
                                 fontFamily: "fontRegular",
                                 marginTop: -5,
                              }}
                              onPress={() => {
                                 navigation.navigate(
                                    "AdminViewPaymentReceipt",
                                    {
                                       payment_receipt: item,
                                    }
                                 ); //placeholder navigation
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
                              There are no current payment receipts!
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
                              Payment Receipts
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
   },
   imageContainer: {
      backgroundColor: primaryBlue,
      width: 50,
      height: 50,
      borderRadius: 50,
      alignSelf: "center",
   },
});

export default PaymentReceipts;
