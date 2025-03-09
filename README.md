# 🚀 Enfund ChatApp

Enfund ChatApp is a simple and interactive chat application built with **React Native**. This app allows users to create chat rooms, join active conversations, and stay connected with others in real-time.

## ✨ Features

- 👤 Set unique usernames to identify users  
- 💬 Create and join chat rooms with live updates  
- ⏱️ Displays room creation time and expiration status  
- 🎨 Clean UI with a professional look and feel  
- 📱 Fully responsive and optimized for both Android and iOS devices  

## 🛠️ Tech Stack

- 📱 **React Native** (CLI-based)  
- 🔒 **TypeScript** for type safety  
- 🧭 **React Navigation** for screen management  
- 🔄 **WebSocket** for real-time chat functionality  

## 📥 Installation

1. **Clone the Repository** 📂
   ```bash
   git clone https://github.com/Saurabhkumar12-byte/Enfund_Chat_App.git
   cd Enfund_Chat_App
   ```

2. **Install Dependencies** 📦
   ```bash
   npm install
   ```

3. **Link Dependencies** (For iOS only) 🔗
   ```bash
   npx pod-install ios
   ```

4. **Start the Application** 🚀
   ```bash
   npm run android    # For Android devices/emulators
   npm run ios        # For iOS devices/simulators
   ```

## 📱 Usage

1. **Set Username** 👤: Enter your unique username to get started.
2. **Join a Room** 🚪: Select from the available chat rooms or create a new one.
3. **Chat in Real-Time** 💬: Send and receive messages instantly using WebSocket communication.

## 🔌 API Endpoints

- 👤 **Set Username:** `POST /chat/username`
- 📋 **Fetch Rooms:** `GET /chat/rooms`
- ➕ **Create Room:** `POST /chat/rooms`
- 💬 **Get Messages in Room:** `GET /chat/rooms/{roomID}/messages`

## 📱 Screens Overview

- 👤 **SetUsernameScreen**: Users enter their desired username  
- 🏠 **RoomsListScreen**: Displays available chat rooms with details like expiration time  
- 💬 **ChatScreen**: Provides real-time messaging within selected chat rooms  
- ➕ **CreateRoomScreen**: Allows users to create custom chat rooms  

## 📂 Folder Structure

```
├── src
│   ├── components
│   │   ├── CustomTopBar.tsx
│   ├── screens
│   │   ├── SetUsernameScreen.tsx
│   │   ├── RoomsListScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── CreateRoomScreen.tsx
│   ├── services
│   │   ├── apiService.ts
│   ├── App.tsx
│   ├── navigation.tsx
│
├── package.json
├── README.md
```

## 🔮 Future Improvements

- 😀 Add emoji support for chats  
- 👤 Implement user profile management  
- 🎨 Enhance the design for improved user experience  
- 🔔 Add push notifications for new messages  
- 🌙 Implement dark mode  
- 📸 Support for image sharing in chats  
- 🔐 Enhanced security with end-to-end encryption  
- 📊 User activity analytics dashboard  

---

Developed with ❤️ by **Saurabh**
