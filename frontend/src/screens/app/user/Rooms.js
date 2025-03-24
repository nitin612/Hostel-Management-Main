import { View, Text, RefreshControl, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  black,
  darkGreen,
  darkRed,
  lightGray,
  primaryBlue,
  textDarkGray,
  white,
  orangeDark,
  yellowDark,
  lightGreen,
  lightCream,
  mediumCream,
  cream,
  green,
} from "../../../constants/Colors";
import {
  Button,
  List,
  TouchableRipple,
  TextInput,
  Avatar,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { useCallback, useState,useEffect} from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { he } from "react-native-paper-dates";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../../config/BaseUrl";


const Rooms = ({ navigation }) => {
  const [showFaculty, setShowFaculty] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.log('No userId found in AsyncStorage');
          Alert.alert('Error', 'User not authenticated. Please login again.');
          // You might want to redirect to login screen here
        }
      } catch (error) {
        console.error('Error retrieving userId:', error);
      }
    };
    
    // getUserId();
  }, []);

  const handleRequestRoom = async (values) => {

    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token
      // console.log("SDFJSDKJLF: ", token)
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please login again.");
        return;
      }

  console.log( {
    faculty: values.faculty,
    batch: values.batch,
    members: [values.second_member, values.third_member, values.fourth_member].filter(Boolean),
    reason: values.reason,
  },"ssss")
      const response = await axios.post(
        `${baseUrl}room-requests`,
        {
          faculty: values.faculty,
          batch: values.batch,
          members: [values.second_member, values.third_member, values.fourth_member].filter(Boolean),
          reason: values.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      console.log(response.data.requestDetails,"fahkajs,")
      Alert.alert("Success", "Room request submitted successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to submit room request.");
    }
  };
  

  const requestRoomSchema = Yup.object({
    faculty: Yup.string().required("Faculty is required"),
    batch: Yup.string().required("Batch is required"),
    second_member: Yup.string().email("Enter a valid email!"),
    third_member: Yup.string().email("Enter a valid email!"),
    fourth_member: Yup.string().email("Enter a valid email!"),
    reason: Yup.string().required("Reason is required"),
  });


  return (
    <View style={{ flex: 1, backgroundColor: "#EAECE3", minHeight: "100%" }}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.reqRoomTitle}>Request a Room</Text>
          <View style={styles.formContainer}>
            <Formik
              validationSchema={requestRoomSchema}
              initialValues={{
                faculty: "",
                batch: "",
                second_member: "",
                third_member: "",
                fourth_member: "",
              }}
              onSubmit={(values) => handleRequestRoom(values)}
            >
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
              }) => {
                return (
                  <View style={{ marginTop: 8 }}>
                    <DropDown
                      mode="outlined"
                      label="Faculty"
                      visible={showFaculty}
                      showDropDown={() => setShowFaculty(true)}
                      onDismiss={() => setShowFaculty(false)}
                      list={[
                        {
                          label: "Engineering",
                          value: "engineering",
                        },
                        {
                          label: "Technology",
                          value: "technology",
                        },
                        {
                          label: "Agriculture",
                          value: "agriculture",
                        },
                      ]}
                      value={values.faculty}
                      onBlur={handleBlur("faculty")}
                      setValue={handleChange("faculty")}
                      activeColor={primaryBlue}
                      inputProps={{
                        outlineColor: lightGray,
                        right: <TextInput.Icon icon={"chevron-down"} />,
                      }}
                    />
                    {errors.faculty && touched.faculty ? (
                      <Text style={styles.errorText}>{errors.faculty}</Text>
                    ) : null}
                    <View style={{ marginTop: 8 }}>
                      <DropDown
                        mode="outlined"
                        label="Batch"
                        visible={showBatch}
                        showDropDown={() => setShowBatch(true)}
                        onDismiss={() => setShowBatch(false)}
                        list={[
                          {
                            label: "1st Year",
                            value: "first_year",
                          },
                          {
                            label: "2nd Year",
                            value: "second_year",
                          },
                          {
                            label: "3rd Year",
                            value: "third_year",
                          },
                          {
                            label: "4th Year",
                            value: "fourth_year",
                          },
                        ]}
                        value={values.batch}
                        onBlur={handleBlur("batch")}
                        setValue={handleChange("batch")}
                        activeColor={primaryBlue}
                        inputProps={{
                          style: { borderRadius: 15 },
                          outlineColor: lightGray,
                          right: <TextInput.Icon icon={"chevron-down"} />,
                        }}
                      />
                      {errors.batch && touched.batch ? (
                        <Text style={styles.errorText}>{errors.batch}</Text>
                      ) : null}
                    </View>
                    <TextInput
                      mode="outlined"
                      label={"Second Member Email"}
                      onChangeText={handleChange("second_member")}
                      onBlur={handleBlur("second_member")}
                      value={values.second_member}
                      style={{ marginTop: 8 }}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={primaryBlue}
                      outlineStyle={{ borderRadius: 15 }}
                    />
                    {errors.second_member && touched.second_member ? (
                      <Text style={styles.errorText}>
                        {errors.second_member}
                      </Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      label={"Third Member Email"}
                      onChangeText={handleChange("third_member")}
                      onBlur={handleBlur("third_member")}
                      value={values.third_member}
                      style={{ marginTop: 8 }}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={primaryBlue}
                      outlineStyle={{ borderRadius: 15 }}
                    />
                    {errors.third_member && touched.third_member ? (
                      <Text style={styles.errorText}>
                        {errors.third_member}
                      </Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      label={"Fourth Member Email"}
                      onChangeText={handleChange("fourth_member")}
                      onBlur={handleBlur("fourth_member")}
                      value={values.fourth_member}
                      style={{ marginTop: 8 }}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={primaryBlue}
                      outlineStyle={{ borderRadius: 15 }}
                    />
                    {errors.fourth_member && touched.fourth_member ? (
                      <Text style={styles.errorText}>
                        {errors.fourth_member}
                      </Text>
                    ) : null}
                    <TextInput
                      //  style={styles.inputs}
                      mode="outlined"
                      label={"Reason"}
                      onChangeText={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      value={values.reason}
                      multiline
                      numberOfLines={6}
                      style={{ marginTop: 8 }}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={primaryBlue}
                      outlineStyle={{ borderRadius: 15 }}
                    />
                    {errors.reason && touched.reason ? (
                      <Text style={styles.errorText}>{errors.reason}</Text>
                    ) : null}
                    <Button
                      mode="contained"
                      style={{
                        width: "100%",
                        borderRadius: 9,
                        marginTop: 10,
                      }}
                      buttonColor={green}
                      labelStyle={{
                        fontFamily: "fontRegular",
                        fontSize: 16,
                      }}
                      onPress={handleSubmit}
                      disabled={
                        errors.second_member ||
                        errors.third_member ||
                        errors.fourth_member
                          ? true
                          : false
                      }
                    >
                      Request Room
                    </Button>
                  </View>
                );
              }}
            </Formik>
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
    backgroundColor: "#EAECE3",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  reqRoomTitle: {
    //  backgroundColor: primaryBlue,
    marginVertical: 8,
    fontFamily: "fontBold",
    fontSize: 18,
    // height: 40,
    //  width: 200,
    //  textAlign: "center",
    // justifyContent:'center',
    padding: 8,
    //  borderRadius: 15,
  },
  formContainer: {
    width: "90%",
  },
  //   inputs:{
  //    marginTop: 8,
  //    width: "100%",
  //    // height: 60,
  //   },
  form: {},
  errorText: {
    color: darkRed,
    fontFamily: "fontRegular",
    fontSize: 16,
    marginTop: 3,
  },
});

export default Rooms;
