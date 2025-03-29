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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text>Room Details: {roomDetails?.userId?.full_name}</Text>
          <Text>created Date: {roomDetails?.createdAt.split("T")[0]}</Text>

          <Text>User Name: {roomDetails?.userId?.full_name}</Text>
          <Text>Depatrment: {roomDetails?.faculty}</Text>
          <Text>BLOCK: {roomDetails?.adminResponse?.block}</Text>
          <Text>Floor: {roomDetails?.adminResponse?.floor}</Text>
          <Text>COMMENT: {roomDetails?.adminResponse?.comments}</Text>
          <Text>ASSIGNED TO: {roomDetails?.adminResponse?.roomNumber}</Text>
          <Text>Room Members Details</Text>
          <FlatList
            data={roomDetails?.members}
            renderItem={(item, index) => <View>
                <Text>{item.item}</Text>
            </View>}
          />
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
