import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const MAX_LINES = 5;

export default function ActivityInput({ 
  selectedActivities, 
  onAddActivity, 
  onRemoveActivity,
  disabled 
}) {
  const [activityInput, setActivityInput] = useState('');
  const [measurementKey, setMeasurementKey] = useState(0);
  const tempMeasureRef = useRef(null);

  const calculateLines = (height) => {
    if (height === 0) return 0;
    const bubbleHeight = 32;
    const gap = 8;
    const lineHeight = bubbleHeight + gap;
    return Math.ceil(height / lineHeight);
  };

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      const newActivity = activityInput.trim();
      const tempActivities = [...selectedActivities, newActivity];
      
      setMeasurementKey(prev => prev + 1);
      
      setTimeout(() => {
        if (tempMeasureRef.current) {
          tempMeasureRef.current.measure((x, y, width, height) => {
            const wouldBeLines = calculateLines(height);
            
            if (wouldBeLines <= MAX_LINES) {
              onAddActivity(newActivity);
              setActivityInput('');
            } else {
              console.log('Cannot add activity: would exceed 4 lines');
            }
          });
        } else {
          onAddActivity(newActivity);
          setActivityInput('');
        }
      }, 0);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Add at least 5 activities that you do regularly
      </Text>
      
      <TextInput
        style={styles.input}
        value={activityInput}
        onChangeText={setActivityInput}
        onSubmitEditing={handleAddActivity}
        placeholder="Activity (i.e. Dinner, Scrolling, Sports)"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        returnKeyType="done"
        editable={!disabled}
      />

      {selectedActivities.length > 0 && (
        <View style={styles.bubblesContainer}>
          {selectedActivities.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bubbleSelected}
              onPress={() => onRemoveActivity(activity)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Text style={styles.bubbleTextSelected}>
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Hidden measurement container */}
      <View 
        style={styles.hiddenMeasurement}
        key={measurementKey}
      >
        <View 
          ref={tempMeasureRef}
          style={styles.bubblesContainer}
          collapsable={false}
        >
          {[...selectedActivities, activityInput.trim()].map((activity, index) => (
            activity && (
              <View key={index} style={styles.bubbleSelected}>
                <Text style={styles.bubbleTextSelected}>
                  {activity}
                </Text>
              </View>
            )
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bubblesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bubbleSelected: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bubbleTextSelected: {
    color: '#3D5E4A',
    fontSize: 14,
    fontWeight: '500',
  },
  hiddenMeasurement: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: '100%',
  },
});