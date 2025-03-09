import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  Alert,
  StatusBar,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from 'react-native';

const CreateRoomScreen = ({ navigation, route }: any) => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#1E3A8A');
    }
    
    return () => {
      StatusBar.setBarStyle('default');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
      }
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert('Oops!', 'Please give your chat room a name to continue.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://chat-api-k4vi.onrender.com/chat/rooms`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: roomName })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      
      const data = await response.json();
      Alert.alert('Room Created! 🎉', `Your room "${data.name}" is ready for awesome conversations!`);
      navigation.navigate('ChatScreen', { roomID: data.id, username: route.params.username });
    } catch (error) {
      console.error('Error creating room:', error);
      Alert.alert('Uh-oh!', 'Something went wrong. Let\'s try that again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Create Room</Text>
        <View style={styles.topBarSpacer} />
      </View>
      
      <View style={styles.container}>
        <Image 
          source={{ uri: 'https://api.placeholder.com/400/320' }} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Create Your Chat Space!</Text>
        <Text style={styles.subtitle}>Where conversations come to life...</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Give your room a catchy name"
            placeholderTextColor="#8890A6"
            value={roomName}
            onChangeText={setRoomName}
            autoCapitalize="none"
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.createButton,
            !roomName.trim() && styles.disabledButton
          ]}
          onPress={handleCreateRoom}
          disabled={loading || !roomName.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.createButtonText}>LAUNCH ROOM</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.infoText}>
          Create a room and invite friends to start chatting instantly!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    paddingLeft:5,
    fontWeight: 'bold',
  },
  topBarSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5A67D8',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0.1,
  },
  infoText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 16,
  }
});

export default CreateRoomScreen;