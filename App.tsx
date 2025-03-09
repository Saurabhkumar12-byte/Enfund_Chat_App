import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SetUsernameScreen from './src/screens/SetUsernameScreen';
import  CreateRoomScreen  from './src/screens/CreateRoomScreen';
import  RoomsListScreen  from './src/screens/RoomsListScreen';
import  ChatScreen  from './src/screens/ChatScreen';



const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="SetUsername" component={SetUsernameScreen} options={{headerShown:false,headerBackVisible:false}} />
                <Stack.Screen name="RoomsList" component={RoomsListScreen} options={{headerShown:false,headerBackVisible:false}} />
                <Stack.Screen name="CreateRoom" component={CreateRoomScreen} options={{headerShown:false,headerBackVisible:false}} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown:false,headerBackVisible:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
