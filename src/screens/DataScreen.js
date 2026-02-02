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

  const formatActivityLog = (activity) => {
    const date = new Date(activity.timestamp);
    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const dateString = date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric' 
    });
    const happinessPercent = activity.happiness.toFixed(0);
    
    return {
      time: timeString,
      date: dateString,
      happiness: `${happinessPercent}%`
    };
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
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Weekly Happiness</Text>
              <Image
                source={require('../../assets/home/data-chart.png')}
                style={styles.chartImage}
                resizeMode="contain"
              />
            </View>

            {/* Activity Log */}
            <View style={styles.logSection}>
              <Text style={styles.logTitle}>Activity Log</Text>
              
              {activities.length === 0 ? (
                <Text style={styles.emptyText}>No activities logged yet</Text>
              ) : (
                activities.map((activity) => {
                  const formatted = formatActivityLog(activity);
                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={styles.logItem}
                      onPress={() => handleActivityPress(activity)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.logItemLeft}>
                        <Text style={styles.logItemActivity}>
                          {activity.name}
                        </Text>
                        <Text style={styles.logItemTime}>
                          {' @ '}{formatted.time} {formatted.date}
                        </Text>
                      </View>
                      <Text style={styles.logItemHappiness}>
                        {formatted.happiness}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
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
    width: '100%',
    height: '100%',
    marginTop: 0,
    marginLeft: 0,
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
    top: 35,
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
    marginBottom: 100,
    marginTop: 20,
    position: 'relative',
    top: 30,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(30, 3, 41, 0.9)',
    borderRadius: 16,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  chartImage: {
    width: '100%',
    height: 200,
  },
  logSection: {
    flex: 1,
  },
  logTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 20,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logItemLeft: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logItemActivity: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  logItemTime: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '200',
  },
  logItemHappiness: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 16,
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