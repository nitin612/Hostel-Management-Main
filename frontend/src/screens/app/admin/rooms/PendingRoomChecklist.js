import React, { useCallback, useState } from "react";
import { View, Text, RefreshControl, FlatList, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  black,
  green,
  lightGray,
  primaryBlue,
  textDarkGray,
  white,
} from "../../../../constants/Colors";
import { Avatar, Badge, Divider } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';

// Create Animatable Components
const AnimatableView = Animatable.createAnimatableComponent(View);
const AnimatableTouchable = Animatable.createAnimatableComponent(TouchableOpacity);
const AnimatableText = Animatable.createAnimatableComponent(Text);
const AnimatableIcon = Animatable.createAnimatableComponent(Ionicons);

// Define animations
const slideInRight = {
  0: { translateX: 100, opacity: 0 },
  1: { translateX: 0, opacity: 1 }
};

const fadeIn = {
  0: { opacity: 0 },
  1: { opacity: 1 }
};

const zoomIn = {
  0: { scale: 0.8, opacity: 0 },
  1: { scale: 1, opacity: 1 }
};

const pulse = {
  0: { scale: 1 },
  0.5: { scale: 1.05 },
  1: { scale: 1 }
};

const PendingRoomChecklist = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchPendingChecklists = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken"); // Retrieve token
      if (!token) {
        Alert.alert("Error", "Authentication failed. Please login again.");
        return;
      }
      const response = await axios.get(`${baseUrl}room-requests/accepted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load room checklists."
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPendingChecklists().then(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPendingChecklists();
    }, [])
  );

  const renderItem = ({ item, index }) => {
    return (
      <AnimatableTouchable
        style={styles.card}
        activeOpacity={0.9}
        animation={slideInRight}
        duration={400}
        delay={index * 100}
        useNativeDriver
        onPress={() => {
          navigation.navigate("AdminRoomChecklistForm", {
            checklist_form: item,
          });
        }}
      >
        <View style={styles.cardContent}>
          <AnimatableView 
            style={styles.avatarContainer}
            animation="bounceIn"
            delay={index * 100 + 300}
            useNativeDriver
          >
            <Avatar.Image
              size={60}
              source={require("../../../../../assets/images/profile_pic.png")}
              style={styles.avatar}
            />
            <Badge style={styles.badge} size={18}>
              {index + 1}
            </Badge>
          </AnimatableView>
          
          <AnimatableView 
            style={styles.infoContainer}
            animation="fadeIn"
            delay={index * 100 + 200}
            useNativeDriver
          >
            <AnimatableText 
              style={styles.nameText}
              animation={fadeIn}
              delay={index * 100 + 250}
              useNativeDriver
            >
              {item.userId.full_name}
            </AnimatableText>
            
            <AnimatableText 
              style={styles.emailText}
              animation={fadeIn}
              delay={index * 100 + 300}
              useNativeDriver
            >
              {item.userId.email}
            </AnimatableText>
            
            <AnimatableView 
              style={styles.statusContainer}
              animation="fadeInLeft"
              delay={index * 100 + 350}
              useNativeDriver
            >
              <AnimatableView 
                style={styles.statusBadge}
                animation={pulse}
                iterationCount="infinite"
                duration={2000}
                useNativeDriver
              >
                <Text style={styles.statusText}>Pending</Text>
              </AnimatableView>
            </AnimatableView>
          </AnimatableView>
          
          <AnimatableView 
            style={styles.rightContainer}
            animation="fadeInRight"
            delay={index * 100 + 400}
            useNativeDriver
          >
            <MaterialIcons name="chevron-right" size={28} color={primaryBlue} />
          </AnimatableView>
        </View>
        
        <Divider style={styles.divider} />
        
        <AnimatableView 
          style={styles.metaContainer}
          animation="fadeIn"
          delay={index * 100 + 450}
          useNativeDriver
        >
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={textDarkGray} />
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={textDarkGray} />
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </AnimatableView>
      </AnimatableTouchable>
    );
  };

  const EmptyListComponent = () => (
    <AnimatableView 
      style={styles.emptyContainer}
      animation="fadeIn"
      duration={800}
      useNativeDriver
    >
      <AnimatableIcon 
        name="clipboard-outline" 
        size={70} 
        color={textDarkGray} 
        animation="bounceIn"
        delay={300}
        useNativeDriver
      />
      <AnimatableText 
        style={styles.emptyTitle}
        animation="fadeInDown"
        delay={500}
        useNativeDriver
      >
        No Pending Checklists
      </AnimatableText>
      <AnimatableText 
        style={styles.emptyText}
        animation="fadeInUp"
        delay={700}
        useNativeDriver
      >
        There are no room checklists pending at the moment.
      </AnimatableText>
    </AnimatableView>
  );

  const HeaderComponent = () => (
    <AnimatableView 
      style={styles.headerContainer}
      animation="fadeInDown"
      duration={800}
      useNativeDriver
    >
      <AnimatableView 
        style={styles.headerContent}
        animation="fadeIn"
        delay={200}
        useNativeDriver
      >
        <AnimatableText 
          style={styles.headerTitle}
          animation="fadeInDown"
          delay={300}
          useNativeDriver
        >
          Pending Room Checklists
        </AnimatableText>
        <AnimatableText 
          style={styles.headerSubtitle}
          animation="fadeInDown"
          delay={400}
          useNativeDriver
        >
          Review and process pending room inspection checklists
        </AnimatableText>
      </AnimatableView>
      
      <AnimatableView 
        style={styles.statsContainer}
        animation={zoomIn}
        delay={500}
        useNativeDriver
      >
        <AnimatableView 
          style={styles.statItem}
          animation="bounceIn"
          delay={600}
          useNativeDriver
        >
          <AnimatableText 
            style={styles.statNumber}
            animation={pulse}
            iterationCount={3}
            delay={700}
            useNativeDriver
          >
            {data.length}
          </AnimatableText>
          <Text style={styles.statLabel}>Pending</Text>
        </AnimatableView>
        
        <View style={styles.statDivider} />
        
        <AnimatableView 
          style={styles.statItem}
          animation="bounceIn"
          delay={800}
          useNativeDriver
        >
          <AnimatableText 
            style={styles.statNumber}
            animation={pulse}
            iterationCount={3}
            delay={900}
            useNativeDriver
          >
            {data.filter(item => new Date(item.createdAt) > new Date(Date.now() - 86400000)).length}
          </AnimatableText>
          <Text style={styles.statLabel}>Today</Text>
        </AnimatableView>
      </AnimatableView>
    </AnimatableView>
  );

  return (
    <>
      {loading && !refreshing ? (
        <AnimatableView 
          style={styles.loadingContainer}
          animation="fadeIn"
          duration={600}
          useNativeDriver
        >
          <ActivityIndicator size="large" color={green} />
          <AnimatableText 
            style={styles.loadingText}
            animation="fadeIn"
            delay={300}
            useNativeDriver
          >
            Loading checklists...
          </AnimatableText>
        </AnimatableView>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[primaryBlue]}
              tintColor={primaryBlue}
            />
          }
          ListEmptyComponent={EmptyListComponent}
          ListHeaderComponent={HeaderComponent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: textDarkGray,
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  // Header Styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "fontBold",
    fontSize: 24,
    color: black,
    textAlign: "center",
    marginTop: 16,
  },
  headerSubtitle: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: textDarkGray,
    textAlign: "center",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F6F8FA",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-around",
    marginVertical: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "fontBold",
    fontSize: 24,
    color: green,
  },
  statLabel: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: textDarkGray,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: lightGray,
  },
  // Card Styles
  card: {
    backgroundColor: white,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    backgroundColor: primaryBlue,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: green,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontFamily: "fontBold",
    fontSize: 16,
    color: black,
    marginBottom: 2,
  },
  emailText: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: textDarkGray,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: "#FF9800",
  },
  rightContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: lightGray,
  },
  metaContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#F9FAFC",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  metaText: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: textDarkGray,
    marginLeft: 4,
  },
  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 30,
  },
  emptyTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: black,
    marginVertical: 12,
  },
  emptyText: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: textDarkGray,
    textAlign: "center",
  },
});

export default PendingRoomChecklist;