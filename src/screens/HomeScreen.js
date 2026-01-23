import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import AddActivityModal from '../components/AddActivityModal';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [activities, setActivities] = useState([]);

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
      return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const handleAddActivity = (activity, happiness) => {
    const newActivity = {
      id: Date.now().toString(),
      name: activity,
      happiness: happiness,
      timestamp: new Date(),
    };
    setActivities([newActivity, ...activities]);
    setModalVisible(false);
  };

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityName}>{item.name}</Text>
      <Text style={styles.activityHappiness}>{item.happiness}% happy</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>You're successfully signed in</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{formatPhone(user?.phone)}</Text>
          </View>
        </View>

        {/* Activities List */}
        <View style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>Recent Activities</Text>
          {activities.length === 0 ? (
            <Text style={styles.emptyText}>No activities yet. Tap + to add one!</Text>
          ) : (
            <FlatList
              data={activities}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
              style={styles.activitiesList}
            />
          )}
        </View>

        {/* Sign Out Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/onboarding/add-button.png')}
          style={styles.addButtonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Add Activity Modal */}
      <AddActivityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddActivity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  activitiesContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  activitiesList: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activityHappiness: {
    fontSize: 14,
    color: '#C9449A',
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#C9449A',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 70,
    height: 70,
    shadowColor: '#C9449A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonImage: {
    width: 70,
    height: 70,
  },
});