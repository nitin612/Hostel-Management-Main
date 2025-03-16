import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   black,
   green,
   lightGray,
   primaryBlue,
   white,
} from "../../../../constants/Colors";
import { Button, TextInput, TouchableRipple } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

const AddAnnouncement = ({ navigation }) => {
   const addAnnouncementSchema = Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      image: Yup.string(),
   });

   const handleAddAnnouncement = (values) => {
      //handle add announcement
      console.log(values);
   };

   const handleUploadImage = () => {
      //handle upload image
   };

   return (
      <ScrollView
         style={{ flex: 1 }}
         contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <Text style={styles.titleText}>Add Announcement</Text>
               <Formik
                  onSubmit={(values) => handleAddAnnouncement(values)}
                  initialValues={{ title: "", description: "", image: "" }}
                  validationSchema={addAnnouncementSchema}
               >
                  {({ handleBlur, handleChange, handleSubmit, values }) => {
                     return (
                        <View style={styles.form}>
                           <TextInput
                              mode="outlined"
                              label={"Title"}
                              placeholder="Announcement Title"
                              onChangeText={handleChange("title")}
                              onBlur={handleBlur("title")}
                              selectionColor={lightGray}
                              cursorColor={primaryBlue}
                              outlineColor={lightGray}
                              activeOutlineColor={green}
                              outlineStyle={{ borderRadius: 4 }}
                           />
                           <TextInput
                              mode="outlined"
                              label={"Description"}
                              placeholder="Add short description about the announcement"
                              multiline
                              numberOfLines={6}
                              style={{ marginTop: 8 }}
                              onChangeText={handleChange("description")}
                              onBlur={handleBlur("description")}
                              selectionColor={lightGray}
                              cursorColor={primaryBlue}
                              outlineColor={lightGray}
                              activeOutlineColor={green}
                              outlineStyle={{ borderRadius: 4 }}
                           />
                           {/* <TouchableRipple style={styles.uploadImage}>
                              <View style={{ flex: 1 }}></View>
                           </TouchableRipple>
                           <Button
                              mode="outlined"
                              labelStyle={{
                                 fontFamily: "fontRegular",
                                 fontSize: 16,
                                 paddingVertical: 5,
                                 color: primaryBlue,
                              }}
                              onPress={handleUploadImage}
                              style={{ marginTop: 12, borderRadius: 8 }}
                           >
                              Upload Image
                           </Button> */}
                           <Button
                              mode="contained"
                              labelStyle={{
                                 fontFamily: "fontRegular",
                                 fontSize: 16,
                                 paddingVertical: 5,
                              }}
                              buttonColor={green}
                              onPress={handleSubmit}
                              style={{ marginTop: 12, borderRadius: 8 }}
                           >
                              Add Announcement
                           </Button>
                        </View>
                     );
                  }}
               </Formik>
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
      alignItems: "center",
   },
   title: {
      width: "90%",
      fontFamily: "Roboto Regular",
      fontSize: 16,
      marginVertical: 10,
   },
   titleText: {
      fontFamily: "fontBold",
      fontSize: 20,
      marginVertical: 12,
   },
   form: {
      width: "100%",
   },
   uploadImage: {
      height: 150,
      width: "100%",
      marginTop: 15,
      borderRadius: 8,
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: lightGray,
   },
});

export default AddAnnouncement;
