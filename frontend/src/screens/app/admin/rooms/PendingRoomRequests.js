import React, { useCallback, useState, useRef } from 'react';
import { View, Text, RefreshControl, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Divider, List, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../../../../config/BaseUrl';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const PendingRoomRequests = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const animationRef = useRef(null);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Session Expired', 'Please login again to continue.');
        return;
      }
      
      const response = await axios.get(`${baseUrl}room-requests/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert(
        'Something went wrong',
        error?.response?.data?.message || 'Could not load pending requests. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPendingRequests().finally(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPendingRequests();
      return () => {};
    }, [])
  );

  const filteredData = data.filter(item => {
    const studentName = item?.userId?.full_name?.toLowerCase() || '';
    const regNo = item?.userId?.registration_no?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return studentName.includes(query) || regNo.includes(query);
  });

  const EmptyListComponent = () => (
    <Animatable.View 
      style={styles.emptyContainer}
      animation="fadeIn"
      duration={800}
      useNativeDriver
    >
      <Animatable.View
        ref={animationRef}
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        duration={2000}
        style={styles.emptyIconContainer}
      >
        <Feather name="inbox" size={80} color="#CBD5E1" />
      </Animatable.View>
      <Text style={styles.emptyText}>
        No pending room requests found
      </Text>
      <Button 
        mode="contained" 
        onPress={onRefresh}
        style={styles.refreshButton}
        labelStyle={styles.buttonLabel}
      >
        Refresh
      </Button>
    </Animatable.View>
  );

  const renderHeader = () => (
    <Animatable.View 
      style={styles.header}
      animation="fadeInDown"
      duration={800}
      useNativeDriver
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Pending Room Requests</Text>
        <Text style={styles.headerSubtitle}>
          {filteredData.length} {filteredData.length === 1 ? 'request' : 'requests'} pending review
        </Text>
      </View>
    </Animatable.View>
  );

  const StatusBadge = ({ status }) => (
    <View style={[
      styles.statusBadge,
      { backgroundColor: status === 'urgent' ? '#FEECEB' : '#E5F1FF' }
    ]}>
      <Text style={[
        styles.statusText,
        { color: status === 'urgent' ? '#FF4D4F' : '#1677FF' }
      ]}>
        {status === 'urgent' ? 'Urgent' : 'Pending'}
      </Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    // Alternate between different status for demonstration
    const status = index % 3 === 0 ? 'urgent' : 'pending';
    
    return (
      <Animatable.View 
        style={styles.cardContainer}
        animation="fadeInUp"
        duration={400}
        delay={index * 100}
        useNativeDriver
      >
        <List.Item
          title={() => (
            <Text style={styles.nameText}>{item?.userId?.full_name || 'Unknown Student'}</Text>
          )}
          description={() => (
            <View style={styles.detailsContainer}>
              <Text style={styles.regNoText}>
                {item?.userId?.registration_no || 'ID Not Available'}
              </Text>
              <Text style={styles.requestDateText}>
                Requested on {new Date().toLocaleDateString()}
              </Text>
            </View>
          )}
          left={() => (
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={56}
                source={require('../../../../../assets/images/profile_pic.png')}
                style={styles.avatar}
              />
            </View>
          )}
          right={() => (
            <View style={styles.rightContainer}>
              <StatusBadge status={status} />
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="#5B6C8F" 
                style={styles.chevron} 
              />
            </View>
          )}
          onPress={() => {
            navigation.navigate('AdminRoomAllocation', {
              room_request: item,
            });
          }}
          style={styles.listItem}
        />
      </Animatable.View>
    );
  };

  return (
<>
      {loading && !refreshing ? (
        <Animatable.View 
          style={styles.loadingContainer}
          animation="fadeIn"
          duration={500}
          useNativeDriver
        >
          <ActivityIndicator size="large" color="#1677FF" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </Animatable.View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={EmptyListComponent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#1677FF']}
              tintColor="#1677FF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
</>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'fontBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'fontRegular',
  },
  searchbar: {
    borderRadius: 12,
    elevation: 0,
    backgroundColor: '#F1F5F9',
    height: 46,
  },
  searchInput: {
    fontSize: 14,
    fontFamily: 'fontRegular',
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  cardContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 8,
  },
  avatarContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#E5F1FF',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'fontBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  regNoText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'fontRegular',
  },
  requestDateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'fontRegular',
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'fontRegular',
  },
  chevron: {
    marginLeft: 4,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: height * 0.1,
  },
  emptyIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: 'fontBold',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginHorizontal: 32,
    marginTop: 16,
  },
  refreshButton: {
    marginTop: 24,
    backgroundColor: '#1677FF',
    borderRadius: 12,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontFamily: 'fontBold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'fontRegular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
});

export default PendingRoomRequests;