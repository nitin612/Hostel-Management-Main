import {
  View,
  Text,
  RefreshControl,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
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
} from "../../../constants/Colors";
import { Button, List, TouchableRipple, Avatar } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

const Complains = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getComplain = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Retrieve token
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please login again.");
        return;
      }
      const response = await axios.get(`${baseUrl}complains/allcomplains`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.request);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to submit room request."
      );
    }
  };
  const updateComplainStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Retrieve token
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please login again.");
        return;
      }

      const response = await axios.post(
        `${baseUrl}complains/status`, // Adjust route as needed
        { id, status }, // Payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Complaint status updated successfully.");
      // Optionally re-fetch complaints or update state here
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update complaint status."
      );
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getComplain();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  useEffect(() => {
    getComplain();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: white, minHeight: "100%" }}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.listContainer}>
            <FlatList
              data={data}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => {
                return (
                  <List.Item
                    key={item.id}
                    title={item.title}
                    description={<Text>{item.description}</Text>}
                    left={(color = textDarkGray) => (
                      <View style={styles.imageContainer}>
                        <Avatar.Image
                          size={50}
                          source={require("../../../../assets/images/profile_pic.png")}
                        />
                      </View>
                      // <List.Icon
                      //    color={color}
                      //    icon={"account-circle"}
                      // />
                    )}
                    right={(props) => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {(item.status == "pending" ||
                          item.status == "rejected") && (
                          <TouchableRipple
                            onPress={() =>
                              updateComplainStatus(item._id, "rejected")
                            }
                          >
                            <List.Icon
                              {...props}
                              icon={"close"}
                              color={darkRed}
                            />
                          </TouchableRipple>
                        )}
                        {(item.status == "pending" ||
                          item.status == "resolved") && (
                          <TouchableRipple
                            onPress={() =>
                              updateComplainStatus(item?._id, "resolved")
                            }
                          >
                            <List.Icon
                              {...props}
                              icon={"check"}
                              color={darkGreen}
                            />
                          </TouchableRipple>
                        )}
                      </View>
                    )}
                    style={{
                      paddingLeft: 15,
                      elevation: 5,
                      backgroundColor: white,
                      width: "90%",
                      alignSelf: "center",
                      marginVertical: 8, //remove
                      borderRadius: 8, //remove
                    }}
                    titleStyle={{ fontFamily: "fontRegular" }}
                    descriptionStyle={{
                      fontFamily: "fontRegular",
                      marginTop: -5,
                    }}
                    onPress={() => {
                      navigation.navigate("AdminViewComplain", {
                        complain: item,
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
                    There are no current late pass requests!
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
                    Late Pass Requests
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
    marginTop: 10,
  },
  imageContainer: {
    backgroundColor: primaryBlue,
    width: 50,
    height: 50,
    borderRadius: 50,
    alignSelf: "center",
  },
});

export default Complains;
