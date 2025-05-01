import React, { useContext, useCallback, useState } from "react";
import { 
  View, 
  Text, 
  RefreshControl, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { AuthContext } from "../../../../context/AuthContext";
import SuccessModal from "../../../../components/SuccessModal";
import { baseUrl } from "../../../../config/BaseUrl";


const RoomAcceptance = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useContext(AuthContext);

  const hideModal = () => setVisible(false);

  const fetchAcceptedRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${baseUrl}room-requests/accepted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userRoomData = response.data.filter(
        (req) => req.userId?._id === userInfo.id
      );
      
      setData(userRoomData);
    } catch (error) {
      console.error("Error fetching room requests:", error);
      setError(error?.response?.data?.message || "Failed to fetch room requests");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAcceptedRequests().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAcceptedRequests();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_acceptance":
        return "#FFA000"; // Amber
      case "accepted":
        return "#4CAF50"; // Green
      default:
        return "#2196F3"; // Blue
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_acceptance":
        return "time-outline";
      case "accepted":
        return "checkmark-circle-outline";
      default:
        return "information-circle-outline";
    }
  };

  const navigateToDetails = (item) => {
    const screen = item.status === "pending" 
      ? "UserRoomAcceptanceView" 
      : "UserPendingRoomChecklist";
      
    navigation.navigate("UserRoomsDashboard", {
      screen,
      params: { room_acceptance: item },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => navigateToDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.requestHeader}>
        <View style={styles.leftContent}>
          <Avatar.Text 
            size={40} 
            label={item?.userId?.full_name?.substring(0, 2)?.toUpperCase() || "??"}
            color="#FFF"
            style={{ backgroundColor: getStatusColor(item.status) }}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item?.userId?.full_name}</Text>
            <Text style={styles.userReg}>{item?.userId?.registration_no}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={18} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === "pending_acceptance" ? "Pending" : "Accepted"}
          </Text>
        </View>
      </View>
      
      <View style={styles.requestFooter}>
        {item.room && (
          <View style={styles.roomInfo}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.roomText}>
              Room {item.room.room_number}, {item.room.block_name} Block
            </Text>
          </View>
        )}
        
        <View style={styles.viewDetails}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#2196F3" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Room Acceptance</Text>
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#2196F3"]} 
          />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="home-outline"
            title="No Requests Found"
            message="You don't have any room acceptance requests at the moment."
            loading={loading}
            error={error}
          />
        }
      />
      
      <SuccessModal
        message="Room request processed successfully!"
        visible={visible}
        hideModal={hideModal}
      />
    </>
  );
};

// Note: EmptyState component would need to be created
const EmptyState = ({ icon, title, message, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Loading requests...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.emptyTitle}>Error</Text>
        <Text style={styles.emptyMessage}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name={icon} size={48} color="#9E9E9E" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  requestCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  userReg: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
  },
  requestFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomInfo: {
    flexDirection: "row", 
    alignItems: "center",
  },
  roomText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptyMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  }
});

export default RoomAcceptance;