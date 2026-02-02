import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AddActivityModal from '../components/AddActivityModal';
import WeeklyHappinessChart from '../components/WeeklyHappinessChart';
import ActivityLog from '../components/ActivityLog';

const { width, height } = Dimensions.get('window');

export default function DataScreen({ navigation, route }) {
  const { activities = [], setActivities } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const handleActivityPress = (activity) => {
    setEditingActivity(activity);
    setModalVisible(true);
  };

  const handleSaveEdit = (activityName, happiness) => {
    if (editingActivity) {
      const updatedActivities = activities.map(act =>
        act.id === editingActivity.id
          ? { ...act, name: activityName, happiness }
          : act
      );
      setActivities(updatedActivities);
    }
    setModalVisible(false);
    setEditingActivity(null);
  };

  const handleRemove = () => {
    if (editingActivity) {
      const updatedActivities = activities.filter(act => act.id !== editingActivity.id);
      setActivities(updatedActivities);
    }
    setModalVisible(false);
    setEditingActivity(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Background Image - Fixed */}
      <View style={styles.backgroundContainer}>
        <Image
          source={require('../../assets/home/data-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with Wood Plank */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/home/wood-plank.png')}
            style={styles.woodPlank}
            resizeMode="stretch"
          />
          <Text style={styles.headerTitle}>Data</Text>
        </View>

        {/* Content Area with Overlay - Scrollable */}
        <View style={styles.contentWrapper}>
          <View style={styles.overlay} />
          
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Weekly Happiness Chart */}
            <WeeklyHappinessChart />

            {/* Activity Log */}
            <ActivityLog 
              activities={activities}
              onActivityPress={handleActivityPress}
            />
          </ScrollView>
        </View>

        {/* Home Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Edit Activity Modal */}
      <AddActivityModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveEdit}
        onRemove={handleRemove}
        initialActivity={editingActivity?.name}
        initialHappiness={editingActivity?.happiness}
        isEditing={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E0329',
  },
  backgroundContainer: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: width * 1.05,
    height: height,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    position: 'relative',
    height: 50,
  },
  woodPlank: {
    position: 'absolute',
    width: 400,
    height: 900,
    top: -30,
  },
  headerTitle: {
    position: 'absolute',
    top: 34,
    fontFamily: 'Sigmar',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F2DAB3',
    textShadowColor: '#75383B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1,
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 80,
    marginTop: 40,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(30, 3, 41, 0.9)',
    borderRadius: 24,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  homeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1E0329',
  },
});