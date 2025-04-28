import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import {
  black,
  green,
  lightGray,
  primaryBlue,
  textDarkGray,
  textLightGray,
  white,
} from "../../../../constants/Colors";
import DropDown from "react-native-paper-dropdown";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  IconButton,
  TextInput,
  Portal,
  Dialog,
  Avatar,
  Card,
  Surface,
  Divider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";

const { width } = Dimensions.get("window");

// Custom animations
const customSlideRight = {
  0: {
    opacity: 0,
    translateX: 100,
  },
  1: {
    opacity: 1,
    translateX: 0,
  },
};

const fadeInBottomWithScale = {
  0: {
    opacity: 0,
    translateY: 40,
    scale: 0.8,
  },
  1: {
    opacity: 1,
    translateY: 0,
    scale: 1,
  },
};

const RoomAllocation = ({ navigation, route }) => {
  const { room_request } = route.params;

  const [showBlock, setShowBlock] = useState(false);
  const [showFloor, setShowFloor] = useState(false);
  const [showRoomNumber, setShowRoomNumber] = useState(false);
  const [showDeclineRequest, setShowDeclineRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Animation references
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const memberContainerRef = useRef(null);
  const formRef = useRef(null);
  const reasonRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const dividerRefs = useRef([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Start sequence animation when component mounts
    const timeout = setTimeout(() => {
      startAnimations();
    }, 300);
    
    return () => clearTimeout(timeout);
  }, []);

  // Start animations when component mounts
  const startAnimations = () => {
    if (titleRef.current) titleRef.current.animate({ 
      0: { opacity: 0, scale: 0.5 },
      1: { opacity: 1, scale: 1 }
    }, 800);
    
    if (headerRef.current) headerRef.current.fadeIn(1000);
    if (reasonRef.current) reasonRef.current.fadeIn(1200);
    
    // Fixed the divider animations to not use width property with native driver
    dividerRefs.current.forEach((ref, index) => {
      if (ref) {
        // Use fadeIn animation which is supported by native driver
        setTimeout(() => {
          ref.fadeIn(800);
        }, index * 200);
      }
    });
    
    if (memberContainerRef.current) memberContainerRef.current.animate(customSlideRight, 1000);
    if (formRef.current) formRef.current.animate(fadeInBottomWithScale, 1500);
    if (buttonContainerRef.current) buttonContainerRef.current.bounceIn(2000);
  };

  const handleRoomAllocation = async (status, values) => {
    try {
      if (
        !values.block ||
        !values.floor ||
        !values.roomNumber ||
        !values.comments
      ) {
        Alert.alert("Validation Error", "All fields are required.");
        return;
      }
      
      setLoading(true);
      
      if (buttonContainerRef.current) {
        await buttonContainerRef.current.pulse(500);
      }
      
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Authentication failed. Please login again.");

      const response = await axios.put(
        `${baseUrl}room-requests/approval`,
        { status, id: room_request._id, adminResponse: values },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      
      // Success animation before navigating away
      if (formRef.current) {
        await formRef.current.animate({
          0: { opacity: 1, translateY: 0 },
          1: { opacity: 0, translateY: -50 }
        }, 500);
      }
      
      Alert.alert("Success", `Room request has been ${status}`);
      navigation.pop();
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert(
        "Error",
        error?.response?.data?.message || `Failed to ${status} room request.`
      );
    }
  };

  const showDeclineModal = () => {
    setShowDeclineRequest(true);
  };

  const hideDeclineModal = () => {
    (async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        if (!token)
          throw new Error("Authentication failed. Please login again.");

        const response = await axios.put(
          `${baseUrl}room-requests/approval`,
          { status: "rejected", id: room_request._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLoading(false);
        Alert.alert("Success", `Room request has been Rejected`);
        navigation.pop();
      } catch (error) {
        console.error(error);
        setLoading(false);
        Alert.alert(
          "Error",
          error?.response?.data?.message || `Failed to rejected room request.`
        );
      }
    })();
    setShowDeclineRequest(false);
  };

  const roomAllocationSchema = Yup.object({
    block: Yup.string(),
    floor: Yup.string(),
    roomNumber: Yup.string(),
    comments: Yup.string(),
  });

  // Function to handle focus on comments field
  const handleCommentsFocus = () => {
    // Scroll to the bottom when comments field is focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animatable.View 
            style={styles.card}
            animation="fadeInUp" 
            duration={800}
            delay={200}
            useNativeDriver
          >
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <Animatable.View ref={headerRef} useNativeDriver>
                  <View style={styles.headerInfo}>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusLabel}>Status</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Pending</Text>
                      </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Date Requested</Text>
                        <Text style={styles.infoValue}>
                          {room_request.createdAt.split("T")[0]}
                        </Text>
                      </View>
                      
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Batch</Text>
                        <Text style={styles.infoValue}>
                          {room_request.faculty} | {room_request.batch}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animatable.View>
                
                {/* Replace animated width dividers with pre-styled dividers */}
                <Animatable.View 
                  ref={ref => (dividerRefs.current[0] = ref)}
                  style={styles.divider}
                  useNativeDriver
                />
                
                <Text style={styles.sectionTitle}>Member Details</Text>
                <Animatable.View ref={memberContainerRef} useNativeDriver>
                  {room_request.members.map((member, index) => {
                    return (
                      <Animatable.View 
                        key={index} 
                        style={styles.memberContainer}
                        animation="fadeIn" 
                        delay={500 + (index * 300)}
                        useNativeDriver
                      >
                        <View style={styles.memberContent}>
                          <Avatar.Text 
                            size={40} 
                            label={member.substring(0, 2).toUpperCase()} 
                            style={styles.avatar}
                            color="#fff"
                            backgroundColor={green}
                          />
                          <Text style={styles.memberDetail}>{member}</Text>
                        </View>
                        <IconButton
                          icon={"account-search"}
                          iconColor={green}
                          size={24}
                          style={styles.actionIcon}
                        />
                      </Animatable.View>
                    );
                  })}
                </Animatable.View>
                
                <Animatable.View 
                  ref={ref => (dividerRefs.current[1] = ref)}
                  style={styles.divider}
                  useNativeDriver
                />
                
                <Text style={styles.sectionTitle}>Reason</Text>
                <Animatable.View ref={reasonRef} useNativeDriver>
                  <Surface style={styles.reasonCard}>
                    <Text style={styles.reasonText}>
                      {room_request.reason}
                    </Text>
                  </Surface>
                </Animatable.View>

                <Animatable.View 
                  ref={ref => (dividerRefs.current[2] = ref)}
                  style={styles.divider}
                  useNativeDriver
                />
                
                <Text style={styles.sectionTitle}>Room Allocation</Text>
                <Formik
                  initialValues={{
                    block: "",
                    floor: "",
                    roomNumber: "",
                    comments: "",
                  }}
                  onSubmit={(values) => handleRoomAllocation("accepted", values)}
                  validationSchema={roomAllocationSchema}
                >
                  {({ handleBlur, handleChange, handleSubmit, values }) => {
                    return (
                      <Animatable.View 
                        ref={formRef}
                        style={styles.formContainer}
                        useNativeDriver
                      >
                        <View style={styles.formField}>
                          <Text style={styles.fieldLabel}>Block</Text>
                          <DropDown
                            mode="outlined"
                            label="Select Block"
                            visible={showBlock}
                            showDropDown={() => setShowBlock(true)}
                            onDismiss={() => setShowBlock(false)}
                            list={[
                              { label: "A", value: "a" },
                              { label: "B", value: "b" },
                              { label: "C", value: "c" },
                            ]}
                            value={values.block}
                            setValue={handleChange("block")}
                            activeColor="#6a11cb"
                            theme={{
                              colors: { primary: '#6a11cb', background: white }
                            }}
                            inputProps={{
                              outlineColor: lightGray,
                              activeOutlineColor: '#6a11cb',
                              right: <TextInput.Icon icon={"chevron-down"} color="#6a11cb" />,
                              style: styles.dropdownInput
                            }}
                          />
                        </View>
                        
                        <View style={styles.roomNumberContainer}>
                          <View style={styles.halfField}>
                            <Text style={styles.fieldLabel}>Floor</Text>
                            <DropDown
                              mode="outlined"
                              label="Select Floor"
                              visible={showFloor}
                              showDropDown={() => setShowFloor(true)}
                              onDismiss={() => setShowFloor(false)}
                              list={[
                                { label: "1", value: "1" },
                                { label: "2", value: "2" },
                                { label: "3", value: "3" },
                                { label: "4", value: "4" },
                              ]}
                              value={values.floor}
                              setValue={handleChange("floor")}
                              activeColor="#6a11cb"
                              theme={{
                                colors: { primary: '#6a11cb', background: white }
                              }}
                              inputProps={{
                                outlineColor: lightGray,
                                activeOutlineColor: '#6a11cb',
                                right: <TextInput.Icon icon={"chevron-down"} color="#6a11cb" />,
                                style: styles.dropdownInput
                              }}
                            />
                          </View>
                          
                          <View style={styles.halfField}>
                            <Text style={styles.fieldLabel}>Room Number</Text>
                            <DropDown
                              mode="outlined"
                              label="Select Room"
                              visible={showRoomNumber}
                              showDropDown={() => setShowRoomNumber(true)}
                              onDismiss={() => setShowRoomNumber(false)}
                              list={[
                                { label: "101", value: "101" },
                                { label: "102", value: "102" },
                                { label: "103", value: "103" },
                                { label: "104", value: "104" },
                                { label: "105", value: "105" },
                                { label: "106", value: "106" },
                                { label: "107", value: "107" },
                                { label: "108", value: "108" },
                                { label: "109", value: "109" },
                                { label: "110", value: "110" },
                                { label: "111", value: "111" },
                                { label: "112", value: "112" },
                                { label: "113", value: "113" },
                                { label: "114", value: "114" },
                                { label: "115", value: "115" },
                                { label: "116", value: "116" },
                                { label: "117", value: "117" },
                                { label: "118", value: "118" },
                                { label: "119", value: "119" },
                                { label: "120", value: "120" },
                               
                              ]}
                              value={values.roomNumber}
                              setValue={handleChange("roomNumber")}
                              activeColor="#6a11cb"
                              theme={{
                                colors: { primary: '#6a11cb', background: white }
                              }}
                              inputProps={{
                                outlineColor: lightGray,
                                activeOutlineColor: '#6a11cb',
                                right: <TextInput.Icon icon={"chevron-down"} color="#6a11cb" />,
                                style: styles.dropdownInput
                              }}
                            />
                          </View>
                        </View>
                        
                        <View style={styles.formField}>
                          <Text style={styles.fieldLabel}>Comments</Text>
                          <TextInput
                            mode="outlined"
                            label="Additional Notes"
                            placeholder="Any comments for this room allocation"
                            multiline
                            numberOfLines={6}
                            style={styles.textArea}
                            onChangeText={handleChange("comments")}
                            onBlur={handleBlur("comments")}
                            onFocus={handleCommentsFocus}
                            selectionColor="#2575fc"
                            cursorColor="#6a11cb"
                            outlineColor={lightGray}
                            activeOutlineColor={green}
                            outlineStyle={{ borderRadius: 8 }}
                            theme={{
                              colors: { primary: '#6a11cb', text: textDarkGray }
                            }}
                          />
                        </View>

                        {/* Decline modal */}
                        <Portal>
                          <Dialog
                            visible={showDeclineRequest}
                            onDismiss={() => setShowDeclineRequest(false)}
                            style={styles.declineModal}
                          >
                            <Animatable.View animation="zoomIn" useNativeDriver>
                              <Dialog.Title>
                                <Text style={styles.modalTitle}>
                                  Are you sure you want to decline?
                                </Text>
                              </Dialog.Title>
                              <Dialog.Content>
                                <Text style={styles.modalText}>
                                  This process cannot be undone. Be careful!
                                </Text>
                                <TextInput
                                  mode="outlined"
                                  label="Reason"
                                  placeholder="Why are you declining this request?"
                                  style={styles.modalInput}
                                  selectionColor="#2575fc"
                                  cursorColor="#6a11cb"
                                  outlineColor={lightGray}
                                  activeOutlineColor="#6a11cb"
                                  outlineStyle={{ borderRadius: 8 }}
                                />
                              </Dialog.Content>
                              <Dialog.Actions>
                                <Button
                                  mode="outlined"
                                  style={styles.cancelBtn}
                                  labelStyle={styles.cancelBtnText}
                                  onPress={() => setShowDeclineRequest(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  mode="contained"
                                  style={styles.confirmBtn}
                                  labelStyle={styles.confirmBtnText}
                                  onPress={hideDeclineModal}
                                  loading={loading}
                                >
                                  Confirm
                                </Button>
                              </Dialog.Actions>
                            </Animatable.View>
                          </Dialog>
                        </Portal>
                        {/* End of decline modal */}

                        <Animatable.View 
                          ref={buttonContainerRef}
                          style={styles.actionButtonContainer}
                          useNativeDriver
                        >
                          <Button
                            mode="outlined"
                            style={styles.declineButton}
                            labelStyle={styles.declineButtonText}
                            onPress={showDeclineModal}
                            icon="close-circle-outline"
                          >
                            Decline
                          </Button>
                          <Button
                            mode="contained"
                            style={styles.allocateButton}
                            labelStyle={styles.allocateButtonText}
                            onPress={handleSubmit}
                            loading={loading}
                            icon="check-circle-outline"
                          >
                            Allocate
                          </Button>
                        </Animatable.View>
                      </Animatable.View>
                    );
                  }}
                </Formik>
              </View>
            </View>
          </Animatable.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 20,
    paddingTop: 20,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientTitle: {
    color: white,
    fontSize: 24,
    fontFamily: "fontBold",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: white,
    borderRadius: 16,
    marginTop: -20,
    marginHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    width: "92%",
    alignItems: "center",
  },
  headerInfo: {
    width: "100%",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: "fontMedium",
    fontSize: 16,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#ffe0b2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#e65100",
    fontFamily: "fontMedium",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoItem: {
    width: "48%",
  },
  infoLabel: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: textDarkGray,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: black,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
    marginVertical: 16,
    // Remove width animation and have it pre-styled at 100%
  },
  sectionTitle: {
    width: "100%",
    fontFamily: "fontBold",
    fontSize: 18,
    color: green,
    marginBottom: 12,
  },
  memberContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f6f8fa",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  memberContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 12,
  },
  memberDetail: {
    fontFamily: "fontRegular",
    fontSize: 16,
  },
  actionIcon: {
    margin: 0,
    backgroundColor: "#f0e6fa",
  },
  reasonCard: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f6f8fa",
    elevation: 0,
  },
  reasonText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: textDarkGray,
    marginBottom: 4,
  },
  dropdownInput: {
    backgroundColor: white,
    height: 56,
  },
  roomNumberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfField: {
    width: "48%",
  },
  textArea: {
    backgroundColor: white,
    minHeight: 120,
  },
  declineModal: {
    backgroundColor: white,
    borderRadius: 16,
    margin: 20,
  },
  modalTitle: {
    fontFamily: "fontBold",
    fontSize: 20,
    color: "#6a11cb",
  },
  modalText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: white,
  },
  cancelBtn: {
    borderColor: "#9e9e9e",
    borderRadius: 8,
  },
  cancelBtnText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: "#9e9e9e",
  },
  confirmBtn: {
    backgroundColor: "#6a11cb",
    borderRadius: 8,
    marginLeft: 12,
  },
  confirmBtnText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: white,
  },
  actionButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  declineButton: {
    width: "48%",
    borderRadius: 8,
    borderColor: "#f44336",
    borderWidth: 1.5,
    paddingVertical: 6,
  },
  declineButtonText: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: "#f44336",
  },
  allocateButton: {
    width: "48%",
    borderRadius: 8,
    backgroundColor: green,
    paddingVertical: 6,
  },
  allocateButtonText: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: white,
  },
});

export default RoomAllocation;