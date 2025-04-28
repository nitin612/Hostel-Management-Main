import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  black,
  lightGray,
  white,
  green,
} from "../../../../constants/Colors";

// Define green color to replace primaryBlue
// const green = "#2E8B57"; // Sea Green color

const RoomDetails = ({ navigation, route }) => {
  const [roomDetails, setRoomDetails] = useState(route?.params.item);

  return (
    <View style={styles.mainContainer}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Room Details</Text>
      </View> */}

      <FlatList
        data={roomDetails?.members}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Room Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.value}>{roomDetails?.userId?.full_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Created Date:</Text>
                <Text style={styles.value}>{roomDetails?.createdAt?.split("T")[0]}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Department:</Text>
                <Text style={styles.value}>{roomDetails?.faculty}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Assignment Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Block:</Text>
                <Text style={styles.value}>{roomDetails?.adminResponse?.block}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Floor:</Text>
                <Text style={styles.value}>{roomDetails?.adminResponse?.floor}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Room Number:</Text>
                <Text style={styles.value}>{roomDetails?.adminResponse?.roomNumber}</Text>
              </View>
              <View style={styles.commentSection}>
                <Text style={styles.commentLabel}>Comments:</Text>
                <Text style={styles.commentText}>{roomDetails?.adminResponse?.comments}</Text>
              </View>
            </View>

            <Text style={styles.membersTitle}>Room Members</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <View style={styles.memberAvatar}>
              <Text style={styles.avatarText}>{item?.charAt(0)?.toUpperCase()}</Text>
            </View>
            <Text style={styles.memberName}>{item}</Text>
          </View>
        )}
        contentContainerStyle={{ backgroundColor: white, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: white,
  },
  header: {
    backgroundColor: green,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the title now that there's no back button
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerTitle: {
    color: white,
    fontSize: 20, // Slightly larger now that it's centered
    fontWeight: "bold",
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    backgroundColor: white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: green, // Changed from primaryBlue to green
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightGray,
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: "40%",
  },
  value: {
    fontSize: 14,
    color: black,
    fontWeight: "400",
    width: "60%",
    textAlign: "right",
  },
  commentSection: {
    marginTop: 12,
    paddingTop: 8,
  },
  commentLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: black,
    lineHeight: 20,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: green, // Changed from primaryBlue to green
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: green, // Changed from primaryBlue to green
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: white,
  },
  memberName: {
    fontSize: 16,
    color: black,
  },
});

export default RoomDetails;