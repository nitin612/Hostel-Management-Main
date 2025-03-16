import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Button } from "react-native-paper";

import welcomeImage from "../../assets/images/welcome.png";
import welcome from "../../assets/images/bunk.png";

import {
   textLightGray,
   textDarkGray,
   primaryBlue,
   white,
   green,
   alaBaster,
} from "../constants/Colors";

const Welcome = ({ navigation }) => {
   // const theme = useTheme()
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
               <Image
                  source={welcome}
                  resizeMode="contain"
                  style={styles.image}
               />
            </View>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.greetText}>
               Hostel Management by Amritsar Group of Colleges
            </Text>
            <Button
               mode="contained"
               style={styles.loginButton}
               buttonColor={green}
               labelStyle={{ fontFamily: "fontRegular", fontSize: 16 }}
               onPress={() => navigation.navigate("Login")}
            >
               Login
            </Button>
            <Button
               mode="outlined"
               style={styles.signUpButton}
               textColor={green}
               labelStyle={{ fontFamily: "fontRegular", fontSize: 16 }}
               onPress={() => navigation.navigate("SignUp")}
            >
               Sign Up
            </Button>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: alaBaster,
      height: "100%",
   },
   contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
   },
   image: {
      width: "80%",
      height: 240,
   },
   welcomeText: {
      fontFamily: "fontBold",
      fontSize: 24,
      color: textDarkGray,
      textAlign: "center",
      margin: 15,
   },
   greetText: {
      fontFamily: "fontRegular",
      fontSize: 16,
      color: textLightGray,
      width: "70%",
      textAlign: "center",
   },
   loginButton: {
      marginTop: 20,
      marginBottom: 8,
      width: "80%",
      borderRadius: 9,
   },
   signUpButton: {
      width: "80%",
      borderColor: green,
      borderRadius: 9,
   },
});

export default Welcome;
