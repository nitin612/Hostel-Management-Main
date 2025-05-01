import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  RefreshControl,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import { useFocusEffect } from "@react-navigation/native";
import { alaBaster, green } from "../../../constants/Colors";
import * as Animatable from 'react-native-animatable';

// Updated color palette
const COLORS = {
  primary: "#4361EE",
  secondary: "#3F37C9",
  accent: "#4CC9F0",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#212529",
  subtext: "#6C757D",
  border: "#E9ECEF",
  success: "#4CAF50",
  danger: "#F44336",
  shadow: "rgba(0, 0, 0, 0.1)",
};

const Receipts = ({ navigation }) => {
  const [receipts, setReceipts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const getReceipts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${baseUrl}receipts/allreceipts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReceipts(response.data.request);
      setLoading(false);
      setInitialLoad(false);
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Failed to fetch receipts.");
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    getReceipts();
  }, []);

  // Refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getReceipts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    getReceipts().then(() => setRefreshing(false));
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderReceiptItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 100}
      useNativeDriver
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate("AdminViewPaymentReceipt", {
            payment_receipt: item,
          });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Animatable.View
            animation="pulse"
            iterationCount={1}
            duration={1000}
            style={styles.avatarContainer}
          >
            <Image
              source={require("../../../../assets/images/profile_pic.png")}
              style={styles.avatar}
            />
          </Animatable.View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            {item.date && (
              <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
            )}
            {item.amount && (
              <Animatable.Text
                animation="fadeIn"
                duration={1000}
                delay={500 + index * 100}
                style={styles.cardAmount}
              >
                ${parseFloat(item.amount).toFixed(2)}
              </Animatable.Text>
            )}
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Animatable.Text
            animation="fadeIn"
            duration={800}
            delay={300 + index * 100}
            style={styles.cardStatus}
          >
            {item.status ? item.status : "Processed"}
          </Animatable.Text>
          <Animatable.View
            animation="bounceIn"
            duration={1000}
            delay={400 + index * 100}
          >
            <Ionicons name="chevron-forward" size={22} color={green} />
          </Animatable.View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  const ListEmptyComponent = () => (
    <Animatable.View
      animation="fadeIn"
      duration={800}
      style={styles.emptyContainer}
    >
      <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
        <Ionicons name="receipt-outline" size={64} color={COLORS.subtext} />
      </Animatable.View>
      <Animatable.Text
        animation="fadeInUp"
        duration={800}
        delay={300}
        style={styles.emptyText}
      >
        No payment receipts found
      </Animatable.Text>
      <Animatable.Text
        animation="fadeInUp"
        duration={800}
        delay={500}
        style={styles.emptySubtext}
      >
        Any processed payments will appear here
      </Animatable.Text>
      <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );

  return (
   <>
      <StatusBar style="dark" />
      <Animatable.View
        animation="slideInDown"
        duration={800}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Payment Receipts</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {
            // Animation example when filter is pressed
            Animatable.timing(this._filterButtonAnimation, {
              toValue: 1,
              duration: 500,
            }).start();
          }}
        >
          <Animatable.View
            animation="rubberBand"
            iterationCount={1}
            duration={1000}
          >
            <Ionicons name="filter" size={24} color={green} />
          </Animatable.View>
        </TouchableOpacity>
      </Animatable.View>

      {error && (
        <Animatable.View
          animation="fadeInDown"
          duration={800}
          style={styles.errorContainer}
        >
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getReceipts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {loading && !refreshing ? (
        <Animatable.View
          animation="fadeIn"
          duration={800}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={green} />
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={1500}
            style={styles.loadingText}
          >
            Loading receipts...
          </Animatable.Text>
        </Animatable.View>
      ) : (
        <Animatable.View
          animation={initialLoad ? "fadeIn" : "fadeIn"}
          duration={500}
          style={{ flex: 1 }}
        >
          <FlatList
            data={receipts}
            renderItem={renderReceiptItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}x
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[green]}
                tintColor={green}
              />
            }
            ListEmptyComponent={!loading && ListEmptyComponent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Animatable.View>
      )}
      
      <Animatable.View
        animation="slideInUp"
        duration={800}
        delay={300}
        style={styles.fab}
      >
      </Animatable.View>
</>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: alaBaster,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: green,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.subtext,
    lineHeight: 20,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 4,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.success,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: green,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.subtext,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: "center",
    marginTop: 8,
  },
  refreshButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: green,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: COLORS.card,
    fontWeight: "600",
    fontSize: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.danger,
  },
  retryButtonText: {
    color: COLORS.card,
    fontWeight: "600",
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: green,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Receipts;