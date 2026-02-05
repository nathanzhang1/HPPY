import React, { useState, useEffect } from 'react';
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
import api from '../services/api';
import AddActivityModal from '../components/AddActivityModal';
import WeeklyHappinessChart from '../components/data/WeeklyHappinessChart';
import ActivityLog from '../components/data/ActivityLog';

const { width, height } = Dimensions.get('window');

export default function DataScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await api.getActivities();
      setActivities(data.activities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (activity) => {
    setEditingActivity(activity);
    setModalVisible(true);
  };

  const handleSaveEdit = async (activityName, happiness) => {
    if (editingActivity) {
      try {
        await api.updateActivity(editingActivity.id, activityName, happiness);
        await loadActivities(); // Refresh activities
      } catch (error) {
        console.error('Failed to update activity:', error);
      }
    }
    setModalVisible(false);
    setEditingActivity(null);
  };

  const handleRemove = async () => {
    if (editingActivity) {
      try {
        await api.deleteActivity(editingActivity.id);
        await loadActivities(); // Refresh activities
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
    setModalVisible(false);
    setEditingActivity(null);
  };

  // Calculate weekly happiness data
  const getWeeklyData = () => {
    const now = new Date();
    
    // Group activities by local date (not UTC)
    const dayGroups = {};
    activities.forEach(activity => {
      const activityDate = new Date(activity.created_at);
      // Use local date string for grouping (YYYY-MM-DD in local timezone)
      const year = activityDate.getFullYear();
      const month = String(activityDate.getMonth() + 1).padStart(2, '0');
      const day = String(activityDate.getDate()).padStart(2, '0');
      const dayKey = `${year}-${month}-${day}`;
      
      if (!dayGroups[dayKey]) {
        dayGroups[dayKey] = [];
      }
      dayGroups[dayKey].push(activity.happiness);
    });

    // Calculate daily averages for last 7 days (in local timezone)
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dayKey = `${year}-${month}-${day}`;
      
      const dayActivities = dayGroups[dayKey] || [];
      const average = dayActivities.length > 0
        ? dayActivities.reduce((sum, h) => sum + h, 0) / dayActivities.length
        : 0;
      weekData.push(Math.round(average));
    }

    return weekData;
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
            <WeeklyHappinessChart data={getWeeklyData()} />

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