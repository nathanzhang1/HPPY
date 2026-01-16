import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles. header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles. subtitle}>You're successfully signed in</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user?.phone}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Sign Out"
            onPress={signOut}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex:  1,
    padding: 24,
    justifyContent:  'space-between',
  },
  header: {
    marginTop: 40,
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
    padding:  20,
    shadowColor:  '#000',
    shadowOffset:  { width: 0, height:  2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor:  '#f0f0f0',
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
  footer: {
    marginBottom: 20,
  },
});