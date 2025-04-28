import { View, Text, RefreshControl, FlatList, StyleSheet, Alert,ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { 
  Button, 
  List, 
  Avatar, 
  Card, 
  Appbar, 
  Chip, 
  IconButton, 
  ActivityIndicator,
  FAB,
  Divider
} from "react-native-paper";
import { baseUrl } from "../../../config/BaseUrl";
import { green,white } from '../../../constants/Colors'

const COLORS = {
  primary: "#3f51b5",       // Deep blue
  primaryLight: "#e8eaf6",  // Light blue background
  accent: "#ff4081",        // Pink accent
  success: "#4caf50",       // Green for resolved
  warning: "#ff9800",       // Orange for pending
  error: "#f44336",         // Red for rejected
  background: "#f5f7fa",    // Light background
  card: "#ffffff",          // White card background
  text: "#263238",          // Dark text
  textSecondary: "#78909c", // Secondary text
  border: "#e1e2e6",        // Border color
  divider: "#eceff1"        // Divider color
};

const Complains = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "pending", "resolved", "rejected"

  const getComplains = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Authentication Error", "Please login again to continue.");
        return;
      }
      
      const response = await axios.get(`${baseUrl}complains/allcomplains`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setComplaints(response.data.request);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateComplainStatus = async (id, status) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Authentication Error", "Please login again to continue.");
        return;
      }

      await axios.post(
        `${baseUrl}complains/status`,
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state to reflect the change
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint._id === id ? {...complaint, status} : complaint
        )
      );

      // Show success message
      Alert.alert("Success", `Complaint marked as ${status}.`);
    } catch (error) {
      console.error("Error updating complaint status:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update complaint status."
      );
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getComplains().finally(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    getComplains();
  }, []);

  // Filter complaints based on selected filter
  const filteredComplaints = complaints.filter(complaint => {
    if (filter === "all") return true;
    return complaint.status === filter;
  });

  // Get status color based on complaint status
  const getStatusColor = (status) => {
    switch(status) {
      case "resolved": return COLORS.success;
      case "rejected": return COLORS.error;
      case "pending": 
      default: return COLORS.warning;
    }
  };

  // Get status icon based on complaint status
  const getStatusIcon = (status) => {
    switch(status) {
      case "resolved": return "check-circle";
      case "rejected": return "close-circle";
      case "pending": 
      default: return "clock-outline";
    }
  };

  const renderComplaintItem = ({ item }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate("AdminViewComplain", { complain: item })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Avatar.Image
              size={50}
              source={require("../../../../assets/images/profile_pic.png")}
              style={styles.avatar}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{item.userId?.name || "User"}</Text>
              <Chip 
                icon={getStatusIcon(item.status)}
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                textStyle={styles.statusText}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>
          </View>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.complaintTitle}>{item.title}</Text>
          <Text style={styles.complaintDescription}>
            {item.description.length > 120
              ? `${item.description.substring(0, 120)}...`
              : item.description}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionSection}>
          <Text style={styles.actionLabel}>Update Status:</Text>
          <View style={styles.actionButtons}>
            {(item.status !== "rejected") && (
              <IconButton
                icon="close-circle"
                iconColor={COLORS.error}
                size={24}
                mode="contained"
                containerColor={COLORS.error + "20"}  // 20% opacity
                onPress={() => updateComplainStatus(item._id, "rejected")}
                style={styles.actionButton}
              />
            )}
            {(item.status !== "resolved") && (
              <IconButton
                icon="check-circle"
                iconColor={COLORS.success}
                size={24}
                mode="contained"
                containerColor={COLORS.success + "20"}  // 20% opacity
                onPress={() => updateComplainStatus(item._id, "resolved")}
                style={styles.actionButton}
              />
            )}
            {(item.status !== "pending") && (
              <IconButton
                icon="clock-outline"
                iconColor={COLORS.warning}
                size={24}
                mode="contained"
                containerColor={COLORS.warning + "20"}  // 20% opacity
                onPress={() => updateComplainStatus(item._id, "pending")}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Avatar.Icon 
        size={80} 
        icon="clipboard-text-outline" 
        color={COLORS.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        No complaints found
      </Text>
      <Text style={styles.emptySubtext}>
        {filter !== "all" 
          ? `There are no ${filter} complaints right now` 
          : "No complaints have been submitted yet"}
      </Text>
      <Button 
        mode="contained" 
        onPress={onRefresh}
        style={styles.refreshButton}
        buttonColor={green}
      >
        Refresh
      </Button>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Complaint Management</Text>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip 
            selected={filter === "all"}
            onPress={() => setFilter("all")}
            style={[styles.filterChip, filter === "all" && styles.selectedFilterChip]}
            textStyle={[styles.filterChipText, filter === "all" && styles.selectedFilterChipText]}
          >
            All
          </Chip>
          <Chip 
            selected={filter === "pending"}
            onPress={() => setFilter("pending")}
            style={[styles.filterChip, filter === "pending" && styles.selectedFilterChip]}
            textStyle={[styles.filterChipText, filter === "pending" && styles.selectedFilterChipText]}
            icon="clock-outline"
          >
            Pending
          </Chip>
          <Chip 
            selected={filter === "resolved"}
            onPress={() => setFilter("resolved")}
            style={[styles.filterChip, filter === "resolved" && styles.selectedFilterChip]}
            textStyle={[styles.filterChipText, filter === "resolved" && styles.selectedFilterChipText]}
            icon="check-circle"
          >
            Resolved
          </Chip>
          <Chip 
            selected={filter === "rejected"}
            onPress={() => setFilter("rejected")}
            style={[styles.filterChip, filter === "rejected" && styles.selectedFilterChip]}
            textStyle={[styles.filterChipText, filter === "rejected" && styles.selectedFilterChipText]}
            icon="close-circle"
          >
            Rejected
          </Chip>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appbar: {
    backgroundColor: COLORS.primary,
    elevation: 4,
  },
  appbarTitle: {
    fontFamily: "fontBold",
    color: COLORS.card,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "fontBold",
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: COLORS.primaryLight,
  },
  selectedFilterChip: {
    backgroundColor: green,
  },
  filterChipText: {
    fontFamily: "fontMedium",
    color: COLORS.text,
  },
  selectedFilterChipText: {
    color: white,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  nameContainer: {
    marginLeft: 12,
  },
  userName: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    color: COLORS.card,
    fontSize: 12,
    fontFamily: "fontMedium",
  },
  date: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  contentSection: {
    marginVertical: 12,
  },
  complaintTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  complaintDescription: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLabel: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 2,
  },
  emptyIcon: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: "fontRegular",
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  refreshButton: {
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.accent,
  },
});

export default Complains;