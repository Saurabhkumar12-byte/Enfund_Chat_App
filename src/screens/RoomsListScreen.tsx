import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Room {
  name: string;
  id: string;
  created_at: string;
  expires_at: string;
}

const RoomsListScreen = ({ navigation, route }: any) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = route.params;
  
  const TOP_BAR_COLOR = '#1E3A8A';

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://chat-api-k4vi.onrender.com/chat/rooms', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data: Room[] = await response.json();
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      Alert.alert('Connection Issue', 'Unable to load chat rooms. Pull down to refresh.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms();
      
      StatusBar.setBarStyle('dark-content');
        StatusBar.setBackgroundColor(TOP_BAR_COLOR);
      
      return () => {
        StatusBar.setBarStyle('default');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('transparent');
        }
      };
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://api.placeholder.com/400/320' }} 
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>No Active Conversations</Text>
      <Text style={styles.emptySubText}>Be the first to create a chat room!</Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('CreateRoom', { username })}
      >
        <Text style={styles.emptyButtonText}>Start a New Room</Text>
      </TouchableOpacity>
    </View>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    
    if (diffTime <= 0) return "Expired";
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`;
    } else {
      return `${diffHours}h left`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {}
      <View style={[styles.header, { backgroundColor: TOP_BAR_COLOR }]}>
        <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackNavigation}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ChatSphere</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => Alert.alert('Hello!', `Logged in as ${username}`)}
        >
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>
      
      {loading && rooms.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Discovering chat rooms...</Text>
        </View>
      ) : (
        <>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Hello, {username}!</Text>
            <Text style={styles.subtitleText}>Join a conversation or start your own</Text>
          </View>
          
          <FlatList
            data={rooms}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.roomItem}
                onPress={() => navigation.navigate('ChatScreen', { 
                  roomID: item.id, 
                  username,
                  roomName: item.name 
                })}
                activeOpacity={0.7}
              >
                <View style={styles.roomContent}>
                  <View style={styles.roomIconContainer}>
                    <Text style={styles.roomIcon}>{item.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  
                  <View style={styles.roomInfo}>
                    <View style={styles.roomHeader}>
                      <Text style={styles.roomName} numberOfLines={1}>{item.name}</Text>
                      <View style={[
                        styles.badgeContainer,
                        {backgroundColor: getTimeLeft(item.expires_at) === "Expired" 
                          ? '#EF4444' 
                          : getTimeLeft(item.expires_at).includes('d') 
                            ? '#10B981' 
                            : '#F59E0B'}
                      ]}>
                        <Text style={styles.badgeText}>{getTimeLeft(item.expires_at)}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.roomDetails}>
                      Created: {formatDate(item.created_at)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              rooms.length === 0 ? { flex: 1 } : {}
            ]}
            ListEmptyComponent={renderEmptyList}
            onRefresh={fetchRooms}
            refreshing={loading}
          />
          
          {rooms.length > 0 && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: TOP_BAR_COLOR }]}
              onPress={() => navigation.navigate('CreateRoom', { username })}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>+ New Conversation</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 8,
  },
  profileText: {
    fontSize: 20,
  },
  welcomeContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#F0F9FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A'
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500'
  },
  listContent: {
    padding: 16,
  },
  roomItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  roomIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roomInfo: {
    flex: 1,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  roomDetails: {
    fontSize: 14,
    color: '#64748B'
  },
  createButton: {
    padding: 16,
    borderRadius: 14,
    margin: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
    opacity: 0.8
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default RoomsListScreen;