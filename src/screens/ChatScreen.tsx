import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  StyleSheet, 
  Text, 
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Message {
  content: string;
  id: number;
  created_at: string;
  username: string;
}

const ChatScreen = ({ navigation, route }: any) => {
  const { roomID, username, roomName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: roomName || `Chat Room`,
      headerStyle: {
        backgroundColor: '#3498DB',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://chat-api-k4vi.onrender.com/chat/rooms/${roomID}/messages`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        const data: Message[] = await response.json();
        setMessages(data.reverse());
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load message history.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const connectWebSocket = () => {
      const socket = new WebSocket(`wss://chat-api-k4vi.onrender.com/ws/${roomID}/${username}`);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'message') {
          setMessages((prevMessages) => [{
            content: data.message.content,
            id: data.message.id,
            created_at: data.message.created_at,
            username: data.message.username
          }, ...prevMessages]);
        }
      };

      socket.onerror = () => {
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);

        setTimeout(() => {
          if (socketRef.current?.readyState !== WebSocket.OPEN) {
            connectWebSocket();
          }
        }, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomID, username, navigation, roomName]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event: 'message', content: newMessage }));
      setNewMessage('');
    } else {
      Alert.alert(
        'Connection Error', 
        'Unable to send message. Trying to reconnect...',
        [
          { 
            text: 'Try Again', 
            onPress: () => {
              if (socketRef.current) socketRef.current.close();
              const socket = new WebSocket(`wss://chat-api-k4vi.onrender.com/ws/${roomID}/${username}`);
              socketRef.current = socket;
              socket.onopen = () => {
                setIsConnected(true);
                sendMessage();
              };
            } 
          }
        ]
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.username === username;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {!isMyMessage && (
          <Text style={styles.username}>{item.username}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
        </View>
        <Text style={[
          styles.timestamp,
          isMyMessage ? styles.myTimestamp : styles.otherTimestamp
        ]}>
          {formatTime(item.created_at)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2980B9" barStyle="light-content" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={90}
        >
          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusIndicator, 
              isConnected ? styles.connected : styles.disconnected
            ]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </Text>
            <TouchableOpacity 
              style={styles.roomsButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.roomsButtonText}>Back to Rooms</Text>
            </TouchableOpacity>
          </View>
          
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubText}>Be the first to say hello!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesList}
              inverted
            />
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              placeholderTextColor="#95A5A6"
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (!newMessage.trim() || !isConnected) && styles.sendButtonDisabled
              ]} 
              onPress={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  keyboardAvoidingView: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: '#3498DB',
    fontSize: 16
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 2,
    marginLeft: 4
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginVertical: 1
  },
  myMessageBubble: {
    backgroundColor: '#3498DB',
    borderTopRightRadius: 2,
  },
  otherMessageBubble: {
    backgroundColor: '#ECF0F1',
    borderTopLeftRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  myMessageText: {
    color: 'white'
  },
  otherMessageText: {
    color: '#2C3E50'
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    marginHorizontal: 4
  },
  myTimestamp: {
    color: '#7F8C8D',
    textAlign: 'right'
  },
  otherTimestamp: {
    color: '#7F8C8D',
    textAlign: 'left'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    color: '#2C3E50'
  },
  sendButton: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8
  },
  sendButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
    marginBottom: 10
  },
  emptySubText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center'
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  connected: {
    backgroundColor: '#2ECC71'
  },
  disconnected: {
    backgroundColor: '#E74C3C'
  },
  statusText: {
    fontSize: 12,
    color: '#7F8C8D'
  },
  roomsButton: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#ECF0F1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  roomsButtonText: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: 'bold'
  }
});

export default ChatScreen;