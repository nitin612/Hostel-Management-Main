import { View, Text, StyleSheet, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  black,
  lightGray,
  primaryBlue,
  white,
} from "../../../../constants/Colors";

import { useState } from "react";

const RoomDetails = ({ navigation, route }) => {
  const [roomDetails, setRoomDetails] = useState(route?.params.item);
  return (
    <FlatList
  data={roomDetails?.members}
  keyExtractor={(item, index) => index.toString()}
  ListHeaderComponent={
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text>Room Details: {roomDetails?.userId?.full_name}</Text>
        <Text>Created Date: {roomDetails?.createdAt?.split("T")[0]}</Text>
        <Text>User Name: {roomDetails?.userId?.full_name}</Text>
        <Text>Department: {roomDetails?.faculty}</Text>
        <Text>BLOCK: {roomDetails?.adminResponse?.block}</Text>
        <Text>Floor: {roomDetails?.adminResponse?.floor}</Text>
        <Text>COMMENT: {roomDetails?.adminResponse?.comments}</Text>
        <Text>ASSIGNED TO: {roomDetails?.adminResponse?.roomNumber}</Text>
        <Text>Room Members Details</Text>
      </View>
    </View>
  }
  renderItem={({ item }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <Text>{item}</Text>
    </View>
  )}
  contentContainerStyle={{ backgroundColor: white, paddingBottom: 20 }}
  showsVerticalScrollIndicator={false}
/>

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
    // alignItems: 'center',
  },
  title: {
    width: "90%",
    fontFamily: "Roboto Regular",
    fontSize: 16,
    marginVertical: 10,
  },
});

export default RoomDetails;
