import React, { useCallback, useState } from "react";
import { View, Text, RefreshControl, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import {
   black,
   lightGray,
   white,
   green,
 } from "../../../../constants/Colors";

const COLORS = {
  primary: "#4F6CFF",
  secondary: "#3D56CC",
  background: "#F8FAFF",
  white: "#FFFFFF",
  text: "#1E2641",
  textLight: "#717CB4",
  accent: "#FF7D54",
  success: "#53D769",
  card: "#FFFFFF",
  shadow: "#E2E8F0",
  border: "#EDF2F7",
  headerBg: "#4F6CFF",
};

const AcceptedRoomRequests = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchAcceptedRequests = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Authentication Error", "Please login again to continue.");
        return;
      }
      
      const response = await axios.get(`${baseUrl}room-requests/accepted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load accepted requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAcceptedRequests().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAcceptedRequests();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    // Determine the background color based on the index
    const isEven = index % 2 === 0;
    const cardStyle = isEven ? styles.cardPrimary : styles.cardSecondary;
    const iconStyle = isEven ? COLORS.primary : COLORS.accent;
    
    return (
      <TouchableOpacity
        style={[styles.card, cardStyle]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("AdminRoomDetails", { item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <Ionicons name="person-circle" size={48} color={iconStyle} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item?.userId?.full_name}</Text>
            <Text style={styles.cardSubtitle}>{item?.userId?.registration_no}</Text>
            
            <View style={styles.cardTags}>
              <View style={[styles.tag, isEven ? styles.tagPrimary : styles.tagAccent]}>
                <Text style={styles.tagText}>Accepted</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardAction}>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={iconStyle} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="inbox" size={80} color={COLORS.textLight} />
      <Text style={styles.emptyTitle}>No Accepted Requests</Text>
      <Text style={styles.emptyText}>
        There are no current accepted room requests.
        Pull down to refresh and check again.
      </Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Accepted Requests</Text>
        <Text style={styles.headerSubtitle}>
          View all accepted room allocation requests
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary, COLORS.accent]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={EmptyListComponent}
          ListHeaderComponent={ListHeaderComponent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: -35,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 15,
  },
  headerContent: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: green,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontFamily: "fontBold",
    fontSize: 24,
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 5,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPrimary: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 5,
    borderLeftColor: green,
  },
  cardSecondary: {
    backgroundColor: COLORS.card,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.accent,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIcon: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "fontBold",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
  },
  tagPrimary: {
    backgroundColor: "rgba(79, 108, 255, 0.1)",
  },
  tagAccent: {
    backgroundColor: "rgba(255, 125, 84, 0.1)",
  },
  tagText: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: COLORS.primary,
  },
  cardAction: {
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: COLORS.text,
    marginVertical: 10,
  },
  emptyText: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 10,
  },
});

export default AcceptedRoomRequests;