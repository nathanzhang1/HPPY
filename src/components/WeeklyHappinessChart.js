import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DAYS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
// Static heights for now (0-100 scale)
const HEIGHTS = [85, 45, 70, 60, 50, 75, 95];

export default function WeeklyHappinessChart() {
  const maxHeight = 150; // Maximum bar height in pixels to fit within axes
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Happiness</Text>
      
      <View style={styles.chartContainer}>
        {/* Y-axis icons */}
        <View style={styles.yAxis}>
          <Image
            source={require('../../assets/emoji/happy.png')}
            style={styles.axisIcon}
            resizeMode="contain"
          />
          <View style={styles.yAxisSpacer} />
          <Image
            source={require('../../assets/emoji/sad.png')}
            style={styles.axisIcon}
            resizeMode="contain"
          />
        </View>

        {/* Chart area with axes */}
        <View style={styles.chartArea}>
          {/* Vertical axis line */}
          <View style={styles.verticalAxis} />
          
          {/* Horizontal axis line */}
          <View style={styles.horizontalAxisContainer}>
            <View style={styles.horizontalAxis} />
          </View>

          {/* Bars - Inside axes */}
          <View style={styles.barsContainer}>
            <View style={styles.bars}>
              {HEIGHTS.map((height, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { height: (height / 100) * maxHeight }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Day Labels - Below horizontal axis */}
          <View style={styles.labelsContainer}>
            {DAYS.map((day, index) => (
              <View key={index} style={styles.labelWrapper}>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
  chartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  axisIcon: {
    width: 16,
    height: 16,
  },
  yAxisSpacer: {
    flex: 1,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  verticalAxis: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 30,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  horizontalAxisContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    height: 1,
  },
  horizontalAxis: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  barsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    bottom: 30,
    justifyContent: 'flex-end',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    height: '100%',
    paddingBottom: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barContainer: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 10,
  },
  labelsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  labelWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});