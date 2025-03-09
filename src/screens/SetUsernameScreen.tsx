import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';

const CustomTopBar = () => (
  <View style={styles.topBarWrapper}>
    <View style={styles.topBar}>
      <View style={styles.topBarContent}>
        <Text style={styles.topBarText}>🚀 Enfund ChatApp</Text>
      </View>
    </View>
  </View>
);

const SetUsernameScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Oops!', 'Please enter a username to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://chat-api-k4vi.onrender.com/chat/username', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      const userID = data.userID;
      console.log('response', data);
      navigation.navigate('RoomsList', { username, userID });
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Connection Error', 'Unable to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomTopBar />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.header}>Welcome to ChatApp</Text>
            <Text style={styles.subHeader}>Join thousands of users and start connecting instantly</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Create your unique identity"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSetUsername}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.buttonText}>Setting up...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Get Started</Text>
              )}
            </TouchableOpacity>
            
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  topBarWrapper: {
    backgroundColor: '#1E40AF',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  topBar: { 
    width: '100%', 
    paddingVertical: 16,
    backgroundColor: '#1E40AF',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 20
  },
  topBarText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  keyboardAvoid: {
    flex: 1
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 8,
    textAlign: 'center',
  },
  subHeader: { 
    fontSize: 15, 
    color: '#6B7280', 
    marginBottom: 32, 
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: { 
    width: '100%', 
    borderWidth: 1, 
    padding: 14,
    paddingLeft: 16,
    borderRadius: 12, 
    borderColor: '#D1D5DB', 
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    color: '#1F2937',
  },
  button: { 
    backgroundColor: '#2563EB', 
    padding: 16, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  }
});

export default SetUsernameScreen;
