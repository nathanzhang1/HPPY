import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ActivityLog({ activities, onActivityPress }) {
  const formatActivityLog = (activity) => {
    const date = new Date(activity.created_at);
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
      <Text style={styles.title}>Activity Log</Text>
      
      {activities.length === 0 ? (
        <Text style={styles.emptyText}>No activities logged yet</Text>
      ) : (
        activities.map((activity) => {
          const formatted = formatActivityLog(activity);
          return (
            <TouchableOpacity
              key={activity.id}
              style={styles.logItem}
              onPress={() => onActivityPress(activity)}
              activeOpacity={0.7}
            >
              <View style={styles.logItemLeft}>
                <Text style={styles.logItemActivity}>
                  {activity.name}
                </Text>
                <Text style={styles.logItemTime}>
                  {' @ '}{formatted.time}  {formatted.date}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
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
});