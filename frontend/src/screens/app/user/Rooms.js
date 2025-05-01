import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Button, TextInput, Avatar, Surface, Divider } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../../config/BaseUrl";
import { MaterialIcons } from '@expo/vector-icons';
import {green,alaBaster} from "../../../constants/Colors"

// Colors
const COLORS = {
  background: "#F5F7FA",
  primary: "#3F51B5",
  secondary: "#7986CB",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
  grey: "#9E9E9E",
  lightGrey: "#E0E0E0",
  white: "#FFFFFF",
  text: "#333333",
  textSecondary: "#757575",
  border: "#DDDDDD"
};

const Rooms = ({ navigation }) => {
  const [showFaculty, setShowFaculty] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [userId, setUserId] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("userToken");

        if (!storedUserId || !token) {
          Alert.alert("Authentication Error", "Please login again to continue.");
          navigation.navigate("Login");
          return;
        }

        setUserId(storedUserId);

        const response = await axios.get(`${baseUrl}room-requests/user/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const requests = response.data;
        const activeRequest = requests.find(
          (r) => r.status === "pending" || r.status === "accepted"
        );

        if (activeRequest) {
          setRequestStatus(activeRequest.status);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user requests:", error);
        Alert.alert(
          "Connection Error", 
          "Failed to load your request status. Please check your connection and try again."
        );
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleRequestRoom = async (values, { resetForm }) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Authentication Error", "Please login again to continue.");
        navigation.navigate("Login");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${baseUrl}room-requests`,
        {
          faculty: values.faculty,
          batch: values.batch,
          members: [
            values.second_member,
            values.third_member,
            values.fourth_member,
          ].filter(Boolean),
          reason: values.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      resetForm();
      Alert.alert(
        "Success", 
        "Your room request has been submitted successfully!",
        [{ text: "OK", onPress: () => navigation.pop() }]
      );
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert(
        "Submission Failed",
        error?.response?.data?.message || "Unable to submit your request. Please try again later."
      );
    }
  };

  const requestRoomSchema = Yup.object({
    faculty: Yup.string().required("Faculty selection is required"),
    batch: Yup.string().required("Batch selection is required"),
    second_member: Yup.string().email("Please enter a valid email address").nullable(),
    third_member: Yup.string().email("Please enter a valid email address").nullable(),
    fourth_member: Yup.string().email("Please enter a valid email address").nullable(),
    reason: Yup.string().required("Please provide a reason for your request").min(10, "Reason should be at least 10 characters"),
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={styles.headerCard}>
          <Avatar.Icon 
            size={60} 
            icon="door" 
            color={COLORS.white} 
            style={styles.headerIcon} 
          />
          <Text style={styles.headerTitle}>Room Request</Text>
          <Text style={styles.headerSubtitle}>
            Submit a request for accommodation
          </Text>
        </Surface>

        {requestStatus === "pending" || requestStatus === "accepted" ? (
          <Surface style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <MaterialIcons 
                name={requestStatus === "accepted" ? "check-circle" : "pending"} 
                size={24} 
                color={requestStatus === "accepted" ? COLORS.success : COLORS.warning} 
              />
              <Text style={styles.statusTitle}>
                {requestStatus === "accepted" ? "Request Accepted" : "Request Pending"}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.statusMessage}>
              You already have a {requestStatus} room request. You cannot
              submit a new request until the current one is completed or rejected.
            </Text>
            <Button
              mode="contained"
              style={styles.viewRequestButton}
              buttonColor={COLORS.secondary}
              onPress={() => navigation.navigate("RequestStatus")}
            >
              View My Request
            </Button>
          </Surface>
        ) : (
          <Surface style={styles.formCard}>
            <Text style={styles.formTitle}>New Request</Text>
            <Divider style={styles.divider} />
            
            <Formik
              validationSchema={requestRoomSchema}
              initialValues={{
                faculty: "",
                batch: "",
                second_member: "",
                third_member: "",
                fourth_member: "",
                reason: "",
              }}
              onSubmit={handleRequestRoom}
            >
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
                dirty
              }) => (
                <View style={styles.formContainer}>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    
                    <DropDown
                      mode="outlined"
                      label="Select Faculty"
                      visible={showFaculty}
                      showDropDown={() => setShowFaculty(true)}
                      onDismiss={() => setShowFaculty(false)}
                      list={[
                        { label: "Engineering", value: "engineering" },
                        { label: "Technology", value: "technology" },
                        { label: "Agriculture", value: "agriculture" },
                      ]}
                      value={values.faculty}
                      onBlur={handleBlur("faculty")}
                      setValue={handleChange("faculty")}
                      activeColor={COLORS.primary}
                      inputProps={{
                        outlineColor: touched.faculty && errors.faculty ? COLORS.error : COLORS.border,
                        activeOutlineColor: COLORS.primary,
                        style: styles.dropdown,
                        right: <TextInput.Icon icon="school" />
                      }}
                    />
                    {errors.faculty && touched.faculty && (
                      <Text style={styles.errorText}>{errors.faculty}</Text>
                    )}

                    <DropDown
                      mode="outlined"
                      label="Select Batch"
                      visible={showBatch}
                      showDropDown={() => setShowBatch(true)}
                      onDismiss={() => setShowBatch(false)}
                      list={[
                        { label: "1st Year", value: "first_year" },
                        { label: "2nd Year", value: "second_year" },
                        { label: "3rd Year", value: "third_year" },
                        { label: "4th Year", value: "fourth_year" },
                      ]}
                      value={values.batch}
                      onBlur={handleBlur("batch")}
                      setValue={handleChange("batch")}
                      activeColor={COLORS.primary}
                      inputProps={{
                        outlineColor: touched.batch && errors.batch ? COLORS.error : COLORS.border,
                        activeOutlineColor: COLORS.primary,
                        style: styles.dropdown,
                        right: <TextInput.Icon icon="account-group" />
                      }}
                    />
                    {errors.batch && touched.batch && (
                      <Text style={styles.errorText}>{errors.batch}</Text>
                    )}
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Room Members</Text>
                    <Text style={styles.sectionSubtitle}>
                      Add up to 3 additional members for your room
                    </Text>
                    
                    <TextInput
                      mode="outlined"
                      label="Second Member Email"
                      placeholder="Enter email address"
                      onChangeText={handleChange("second_member")}
                      onBlur={handleBlur("second_member")}
                      value={values.second_member}
                      style={styles.textInput}
                      outlineColor={touched.second_member && errors.second_member ? COLORS.error : COLORS.border}
                      activeOutlineColor={COLORS.primary}
                      left={<TextInput.Icon icon="email" />}
                    />
                    {errors.second_member && touched.second_member && (
                      <Text style={styles.errorText}>{errors.second_member}</Text>
                    )}

                    <TextInput
                      mode="outlined"
                      label="Third Member Email"
                      placeholder="Enter email address"
                      onChangeText={handleChange("third_member")}
                      onBlur={handleBlur("third_member")}
                      value={values.third_member}
                      style={styles.textInput}
                      outlineColor={touched.third_member && errors.third_member ? COLORS.error : COLORS.border}
                      activeOutlineColor={COLORS.primary}
                      left={<TextInput.Icon icon="email" />}
                    />
                    {errors.third_member && touched.third_member && (
                      <Text style={styles.errorText}>{errors.third_member}</Text>
                    )}

                    <TextInput
                      mode="outlined"
                      label="Fourth Member Email"
                      placeholder="Enter email address"
                      onChangeText={handleChange("fourth_member")}
                      onBlur={handleBlur("fourth_member")}
                      value={values.fourth_member}
                      style={styles.textInput}
                      outlineColor={touched.fourth_member && errors.fourth_member ? COLORS.error : COLORS.border}
                      activeOutlineColor={COLORS.primary}
                      left={<TextInput.Icon icon="email" />}
                    />
                    {errors.fourth_member && touched.fourth_member && (
                      <Text style={styles.errorText}>{errors.fourth_member}</Text>
                    )}
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Request Details</Text>
                    
                    <TextInput
                      mode="outlined"
                      label="Reason for Request"
                      placeholder="Please explain why you need this room"
                      multiline
                      numberOfLines={5}
                      onChangeText={handleChange("reason")}
                      onBlur={handleBlur("reason")}
                      value={values.reason}
                      style={styles.textAreaInput}
                      outlineColor={touched.reason && errors.reason ? COLORS.error : COLORS.border}
                      activeOutlineColor={COLORS.primary}
                      left={<TextInput.Icon icon="text-box" />}
                    />
                    {errors.reason && touched.reason && (
                      <Text style={styles.errorText}>{errors.reason}</Text>
                    )}
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="outlined"
                      style={styles.cancelButton}
                      textColor={green}
                      onPress={() => navigation.goBack()}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      style={styles.submitButton}
                      buttonColor={green}
                      onPress={handleSubmit}
                      disabled={!(isValid && dirty)}
                    >
                      Submit Request
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          </Surface>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: green,
    elevation: 3,
    alignItems: "center",
  },
  headerIcon: {
    backgroundColor: COLORS.primary,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: "center",
    marginTop: 5,
  },
  statusCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.text,
  },
  statusMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginVertical: 10,
    lineHeight: 24,
  },
  viewRequestButton: {
    marginTop: 15,
    borderRadius: 8,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  divider: {
    marginBottom: 15,
    height: 1.5,
    backgroundColor: COLORS.lightGrey,
  },
  formContainer: {
    width: "100%",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: COLORS.white,
  },
  textInput: {
    marginTop: 8,
    backgroundColor: COLORS.white,
  },
  textAreaInput: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    height: 120,
    textAlignVertical: "top",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 5,
    marginTop: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    borderColor: green,
  },
  submitButton: {
    flex: 2,
    marginLeft: 8,
    borderRadius: 8,
  },
});

export default Rooms;