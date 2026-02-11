import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import TextStroke from '../TextStroke';

const { width } = Dimensions.get('window');

export default function ExperimentModal({ visible, onClose, type }) {
  const isDailyExercise = type === 'dailyExercise';
  
  const config = isDailyExercise ? {
    backgroundColor: '#5E9BD3',
    borderColor: '#284275',
    title: 'Daily Exercise',
    titleColor: '#C1E4EF',
    titleStroke: '#284275',
    description: 'Log a workout every day for 7 days to unlock this pack and see how it impacts your happiness!',
    descriptionColor: '#284275',
    progressCount: 7,
    checkedCount: 2,
    progressEmpty: '#C1E4EF',
    progressFilled: '#2D4574',
    progressTick: '#C1E4EF',
    badgeImage: require('../../../assets/shop/daily-exercise-badge.png'),
    items: [
      require('../../../assets/shop/daily-exercise-item1.png'),
      require('../../../assets/shop/daily-exercise-item2.png'),
      require('../../../assets/shop/daily-exercise-item3.png'),
      require('../../../assets/shop/daily-exercise-item4.png'),
    ]
  } : {
    backgroundColor: '#8C9461',
    borderColor: '#282B19',
    title: 'Weekend Vacations',
    titleColor: '#F0DAB0',
    titleStroke: '#282B19',
    description: 'Do something outside of your neighborhood on the weekend 4 times in the next 2 months. Log activity somewhere you don\'t usually go to unlock this pack.',
    descriptionColor: '#282B19',
    progressCount: 4,
    checkedCount: 1,
    progressEmpty: '#F0DAB0',
    progressFilled: '#282B19',
    progressTick: '#F0DAB0',
    badgeImage: require('../../../assets/shop/weekend-vacations-badge.png'),
    items: [
      require('../../../assets/shop/weekend-vacations-item1.png'),
      require('../../../assets/shop/weekend-vacations-item2.png'),
      require('../../../assets/shop/weekend-vacations-item3.png'),
      require('../../../assets/shop/weekend-vacations-item4.png'),
    ]
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modalContainer, 
          { 
            backgroundColor: config.backgroundColor,
            borderTopWidth: 4,
            borderLeftWidth: 4,
            borderRightWidth: 4,
            borderBottomWidth: 12,
            borderColor: config.borderColor,
          }
        ]}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Badge Circle */}
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeCircle, { borderColor: config.borderColor }]}>
              <Image
                source={config.badgeImage}
                style={styles.badgeImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Title */}
          <TextStroke stroke={3} color={config.titleStroke}>
            <Text 
              style={[
                styles.title, 
                { 
                  color: config.titleColor,
                  lineHeight: isDailyExercise ? 42 : 22,
                  paddingTop: isDailyExercise ? 5 : 20,
                }
              ]}
            >
              {config.title}
            </Text>
          </TextStroke>

          {/* Description */}
          <Text style={[styles.description, { color: config.descriptionColor }]}>
            {config.description}
          </Text>

          {/* Progress Circles */}
          <View style={styles.progressContainer}>
            {Array.from({ length: config.progressCount }).map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.progressCircle,
                  { backgroundColor: index < config.checkedCount ? config.progressFilled : config.progressEmpty }
                ]}
              >
                {index < config.checkedCount && (
                  <Text style={[styles.checkmark, { color: config.progressTick }]}>✓</Text>
                )}
              </View>
            ))}
          </View>

          {/* Item Images */}
          <View style={styles.itemsContainer}>
            {config.items.map((item, index) => (
              <Image
                key={index}
                source={item}
                style={styles.itemImage}
                resizeMode="contain"
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 480,
    borderRadius: 24,
    padding: 10,
    paddingTop: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#3D3829',
  },
  badgeContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  badgeCircle: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeImage: {
    width: 80,
    height: 80,
    borderRadius: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Sigmar',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 26,
    paddingHorizontal: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 22,
  },
  progressCircle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
});
