import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../config/BaseUrl";
import { Alert } from "react-native"; // ❌ Removed ToastAndroid

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [err, setErr] = useState(null);

  const showAlert = (message) => {
    Alert.alert("Notification", message); // ✅ Works on all platforms
  };

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      let userToken = await AsyncStorage.getItem("userToken");
      let userInfo = await AsyncStorage.getItem("userInfo");
      if (userToken && userInfo) {
        setUserToken(userToken);
        setUserInfo(JSON.parse(userInfo));
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}auth/login`, { email, password });
      // console.log(res,"fanfkjasn,")

      if (res.data && res.data.token) {
        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setItem(
          "userInfo",
          JSON.stringify(res.data.user)
        );

        setUserToken(res.data.accessToken);
        setUserInfo(res.data.user);
        showAlert("Login successful!"); 
        return res.data// ✅ Alert instead of ToastAndroid
      } else {
        showAlert("Invalid login response!");
      }
    } catch (e) {
      setErr(e);
      console.log("Login Error:123", e);
      showAlert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    setUserToken(null);
    setUserInfo(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, err, isLoading, userToken, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
