import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TextStroke from '../components/TextStroke';

const { width } = Dimensions.get('window');

const MENTAL_HEALTH_RESOURCES = [
  { label: 'Find a Therapist', buttonText: 'More', url: 'https://www.psychologytoday.com/us/therapists' },
  { label: 'Crisis Helplines', buttonText: 'More', url: 'https://www.samhsa.gov/find-help/national-helpline' },
  { label: 'Support Groups', buttonText: 'More', url: 'https://www.nami.org/Support-Education/Support-Groups' },
];

const HAPPINESS_RESOURCES = [
  { label: 'The Science of Joy', buttonText: 'Read', url: 'https://www.apa.org/topics/positive-psychology' },
  { label: 'Gratitude Practices', buttonText: 'More', url: 'https://greatergood.berkeley.edu/topic/gratitude' },
  { label: 'Mindfullness', buttonText: 'More', url: 'https://www.mindful.org/what-is-mindfulness/' },
];

function ResourceRow({ label, buttonText, url }) {
  return (
    <View style={styles.resourceRow}>
      <Text style={styles.resourceLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => url && Linking.openURL(url)}
        activeOpacity={0.8}
      >
        <Text style={styles.moreButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ResourcesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Background */}
      <Image
        source={require('../../assets/home/resources-background.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mental Health Resources Title Plank */}
          <View style={styles.titlePlankContainer}>
            <Image
              source={require('../../assets/home/wood-plank.png')}
              style={styles.titlePlank}
              resizeMode="stretch"
            />
            <TextStroke stroke={3} color="#75383B">
              <Text style={styles.titleText}>Mental Health{'\n'}Resources</Text>
            </TextStroke>
          </View>

          {/* Mental Health Section */}
          <View style={styles.section}>
            {MENTAL_HEALTH_RESOURCES.map((item, index) => (
              <React.Fragment key={item.label}>
                <ResourceRow {...item} />
              </React.Fragment>
            ))}
          </View>

          {/* Happiness Research Title Plank */}
          <View style={styles.sectionTitlePlankContainer}>
            <Image
              source={require('../../assets/home/wood-plank.png')}
              style={styles.sectionTitlePlank}
              resizeMode="stretch"
            />
            <TextStroke stroke={3} color="#75383B">
              <Text style={styles.sectionTitleText}>Happiness Research</Text>
            </TextStroke>
          </View>

          {/* Happiness Research Section */}
          <View style={styles.section}>
            {HAPPINESS_RESOURCES.map((item, index) => (
              <React.Fragment key={item.label}>
                <ResourceRow {...item} />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 10,
  },

  // --- Title Plank (double height for 2-line title) ---
  titlePlankContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    height: 90,
  },
  titlePlank: {
    position: 'absolute',
    width: 420,
    height: 1200,
    top: -77,
  },
  titleText: {
    fontFamily: 'Sigmar',
    fontSize: 28,
    fontWeight: '400',
    color: '#F2DAB3',
    textAlign: 'center',
    paddingHorizontal: 3,
    lineHeight: 22,
  },

  // --- Section Plank (single height) ---
  sectionTitlePlankContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 35,
    height: 50,
  },
  sectionTitlePlank: {
    position: 'absolute',
    width: 420,
    height: 900,
    top: -66,
  },
  sectionTitleText: {
    fontFamily: 'Sigmar',
    fontSize: 28,
    fontWeight: '400',
    color: '#F2DAB3',
    textAlign: 'center',
    paddingHorizontal: 3,
  },

  // --- Resource Section Card ---
  section: {
    backgroundColor: '#25B0ABE5',
    borderRadius: 32,
    paddingVertical: 2,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  resourceLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  moreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 26,
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#25B0AB',
  },

  // --- Home Button ---
  homeButton: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 26,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#25B0AB',
  },
});
