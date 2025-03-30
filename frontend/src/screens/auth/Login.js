import { useState, useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  TextInput,
  Checkbox,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import logo from "../../../assets/images/logo.png";
import {
  primaryBlue,
  textLightGray,
  lightGray,
  textDarkGray,
  white,
  darkRed,
  green,
  alaBaster,
} from "../../constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";

import { AuthContext } from "../../context/AuthContext";

const Login = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, err, isLoading } = useContext(AuthContext);

  const showToast = () => {
    ToastAndroid.show("User login successfully!", ToastAndroid.SHORT);
  };

  const handleLogin = async (values) => {
    try {
      const response = await login(values.email, values.password);
  
      console.log("Login Response:", response); // Debugging: Log response
  
      if (response && response.data && response.data.token) {
        const { user, token } = response.data;
  
        // Store userId & token in AsyncStorage
        await AsyncStorage.setItem("userId", user.toString());
        await AsyncStorage.setItem("token", token); // Ensure token is stored
  
        showToast(); // Show success message
        navigation.navigate("Home"); // Navigate after login
      } else {
        // console.error("Invalid response data:", response);
      }
    } catch (error) {
      console.log("Error during login:", error.response?.data || error);
    }
  };
  

  const handleMicrosoftLogin = () => {
  };

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email!")
      .required("Email is required!"),
    password: Yup.string().required("Password is required!"),
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={logo} resizeMode="contain" style={styles.image} />
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.text}>
          Welcome to AGC - Hostel Management Application
        </Text>
        <View style={styles.loginForm}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => {
              return (
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      mode="outlined"
                      label={"Email"}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={green}
                      outlineStyle={{ borderRadius: 20 }}
                    />
                    {errors.email && touched.email ? (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    ) : null}
                    <TextInput
                      mode="outlined"
                      label={"Password"}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      selectionColor={lightGray}
                      cursorColor={primaryBlue}
                      outlineColor={lightGray}
                      activeOutlineColor={green}
                      outlineStyle={{ borderRadius: 20 }}
                      secureTextEntry={!showPassword}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? "eye-off" : "eye"}
                          iconColor={textLightGray}
                          size={20}
                          onPress={() => {
                            setShowPassword(!showPassword);
                          }}
                        />
                      }
                      style={{ marginTop: 10 }}
                    />
                    {errors.password && touched.password ? (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    ) : null}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          status={rememberMe ? "checked" : "unchecked"}
                          color={green}
                          uncheckedColor={lightGray}
                          onPress={() => {
                            setRememberMe(!rememberMe);
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: "fontRegular",
                            fontSize: 16,
                          }}
                        >
                          Remember me
                        </Text>
                      </View>
                      <Button
                        mode="text"
                        textColor={primaryBlue}
                        labelStyle={{
                          textDecorationLine: "underline",
                          textDecorationStyle: "solid",
                          fontFamily: "fontRegular",
                          fontSize: 16,
                        }}
                        onPress={() => {
                          navigation.navigate("ForgotPassword");
                        }}
                      >
                        Forgot password
                      </Button>
                    </View>
                    <Button
                      mode="contained"
                      style={{
                        width: "100%",
                        borderRadius: 20,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      buttonColor={green}
                      labelStyle={{
                        fontFamily: "fontRegular",
                        fontSize: 16,
                      }}
                      onPress={handleSubmit}
                      disabled={isLoading} // Disable button when loading
                    >
                      {isLoading ? (
                        <ActivityIndicator animating={true} color={white} />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "fontRegular",
                        fontSize: 16,
                        color: textLightGray,
                      }}
                    >
                      Don't have an account?{" "}
                    </Text>
                    <Button
                      mode="text"
                      textColor={primaryBlue}
                      labelStyle={{
                        textDecorationLine: "underline",
                        textDecorationStyle: "solid",
                        fontFamily: "fontRegular",
                        fontSize: 16,
                      }}
                      onPress={() => {
                        navigation.navigate("SignUp");
                      }}
                    >
                      Sign up
                    </Button>
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: alaBaster,
  },
  contentContainer: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  image: {
    height: 150,
  },
  title: {
    fontFamily: "fontBold",
    fontSize: 24,
    color: textDarkGray,
    textAlign: "center",
    margin: 15,
  },
  text: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: textLightGray,
    width: "70%",
    textAlign: "center",
  },
  loginForm: {
    marginTop: 15,
    width: "100%",
  },
  errorText: {
    color: darkRed,
    fontFamily: "fontRegular",
    fontSize: 16,
    marginTop: 3,
  },
});

export default Login;
