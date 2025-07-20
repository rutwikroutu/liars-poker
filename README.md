# 🃏 Liar's Poker - Real-Time Multiplayer Game

> **Inspired by Michael Lewis' legendary book _Liar's Poker_. Huge kudos to Michael Lewis for popularizing this iconic game of bluff and probability!**

> A modern, web-based implementation of the classic bluffing game Liar's Poker, built with React and Firebase for real-time multiplayer gameplay.

![Liar's Poker Banner](https://i.ibb.co/wZgBKKfK/Screenshot-2025-07-20-at-12-03-00-PM.png)

## 👨‍💻 **Developer & Owner**

**Rutwik Kumar Routu** - Full Stack Developer & Game Designer

This project was conceptualized, designed, and developed by Rutwik Kumar Routu. All code, game mechanics, and UI/UX design are the original work of Rutwik Kumar Routu.

---

## 🎯 **About the Game**

Liar's Poker is a thrilling bluffing and probability-based game where players bet on the frequency of digits across all players' dollar bill serial numbers. The goal is to out-bluff opponents by making increasingly risky bets or calling their bluffs at the perfect moment.

### 🎮 **Game Mechanics**

- **Each player receives** a unique 8-digit serial number (simulating dollar bills)
- **Turn-based betting** where players must either raise the bet or challenge
- **Valid raises** must increase quantity OR use same quantity with higher digit
- **Challenge resolution** reveals all serial numbers and determines the winner
- **Real-time multiplayer** with live updates across all connected players

---

## ✨ **Key Features**

### 🏠 **Room Management**
![Room Creation](https://i.ibb.co/JjGmCLZt/Screenshot-2025-07-20-at-12-04-17-PM.png)
- **Create rooms** with unique room codes
- **Join existing rooms** using room codes
- **Real-time player updates** as players join/leave
- **Host controls** for game management

### 💰 **Dollar Bill Simulation**
- **Realistic dollar bill design** with authentic styling
- **Random serial number generation** (2 letters + 8 numbers)
- **Individual serial numbers** for each player
- **Regenerate functionality** for new serial numbers

### 🎲 **Gameplay Interface**
![Gameplay Screen](https://i.ibb.co/XxFnxWbd/Screenshot-2025-07-20-at-12-05-08-PM.png)
- **Interactive sliders** for quantity and digit selection
- **Real-time bet preview** showing current bet
- **Turn indicators** with visual cues
- **Raise and Challenge buttons** with validation

### 👥 **Player Management**
![Player List](https://i.ibb.co/Mxwvnzh0/Screenshot-2025-07-20-at-12-05-00-PM.png)
- **Colorful player avatars** with unique colors
- **Host identification** with crown icon
- **Current turn highlighting** with pulsing animation
- **Real-time player status** updates

### 🏆 **Game Results**
![Game Results](https://i.ibb.co/6JPF5D60/Screenshot-2025-07-20-at-12-05-21-PM.png)
- **Winner announcement** with trophy icon
- **Complete game statistics** showing claimed vs actual counts
- **All serial numbers revealed** for transparency
- **Leave room functionality** with cleanup

---

## 🚀 **Technology Stack**

### **Frontend**
- **React 19** - Modern UI framework
- **CSS3** - Custom styling with gradients and animations
- **Firebase SDK** - Real-time database integration

### **Backend & Database**
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Authentication** - User management (future enhancement)
- **Real-time listeners** - Live game state synchronization

### **Key Libraries**
- **Firebase/Firestore** - Database operations
- **React Hooks** - State management
- **CSS Grid/Flexbox** - Responsive layouts

---

## 🎯 **Game Rules**

### **Setup**
1. **Host creates room** and gets unique room code
2. **Players join** using room code
3. **Each player receives** random 8-digit serial number
4. **Host starts game** when 2+ players join

### **Gameplay**
1. **Host places initial bet** (e.g., "3 fives")
2. **Players take turns** raising or challenging
3. **Valid raises** must increase quantity OR use higher digit
4. **Challenge ends game** and reveals all serial numbers

### **Winning Conditions**
- **Challenger wins** if actual count < claimed count
- **Bettor wins** if actual count ≥ claimed count
- **Winner determined** by comparing all serial numbers

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/rutwikofficial/liars-poker.git
   cd liars-poker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore database
   - Update `src/firebase.js` with your Firebase config

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🎮 **How to Play**

### **For Hosts**
1. **Create a new room** from the home screen
2. **Share the room code** with other players
3. **Start the game** when 2+ players join
4. **Place initial bet** using the sliders
5. **Manage the game** and watch for challenges

### **For Players**
1. **Join room** using the provided room code
2. **Wait for host** to start the game
3. **Take your turn** when indicated
4. **Raise or challenge** based on your strategy
5. **Enjoy the game** and try to out-bluff others!

---

## 🔧 **Technical Architecture**

### **Component Structure**
```
src/
├── components/
│   ├── HomeScreen.js      # Main landing page
│   ├── CreateRoom.js      # Room creation interface
│   ├── JoinRoom.js        # Room joining interface
│   ├── GameRoom.js        # Main game interface
│   └── *.css              # Component-specific styles
├── firebase.js            # Firebase configuration & functions
└── App.js                 # Main app component
```

### **Data Flow**
1. **Room Creation** → Firebase Firestore
2. **Player Joining** → Real-time updates
3. **Game State** → Live synchronization
4. **Betting Actions** → Immediate propagation
5. **Game Results** → Final state storage

---

## 🎨 **Design Philosophy**

### **User Experience**
- **Intuitive interface** with clear visual hierarchy
- **Responsive design** for all device sizes
- **Smooth animations** and transitions
- **Real-time feedback** for all actions

### **Visual Design**
- **Modern gradient backgrounds** for visual appeal
- **Consistent color scheme** throughout the app
- **Professional typography** for readability
- **Interactive elements** with hover effects

---

## 🚀 **Future Enhancements**

### **Planned Features**
- [ ] **User authentication** with Firebase Auth
- [ ] **Game history** and statistics
- [ ] **Custom room settings** (max players, time limits)
- [ ] **Sound effects** and background music
- [ ] **Mobile app** versions (iOS/Android)
- [ ] **Tournament mode** with brackets
- [ ] **Achievement system** and leaderboards

### **Technical Improvements**
- [ ] **Performance optimization** for large rooms
- [ ] **Offline support** with service workers
- [ ] **Progressive Web App** features
- [ ] **Advanced analytics** and monitoring

---

## 🤝 **Contributing**

This project is developed and maintained by **Rutwik Kumar Routu**. While this is primarily a personal project, suggestions and feedback are welcome.

### **Guidelines**
- Fork the repository
- Create a feature branch
- Make your changes
- Submit a pull request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright © 2024 Rutwik Kumar Routu. All rights reserved.**
---

## 📞 **Contact**

**Developer:** Rutwik Kumar Routu  
**Email:** [rutwik.routu@duke.edu]  
**GitHub:** [@rutwikofficial](https://github.com/rutwikofficial)  
**LinkedIn:** [https://www.linkedin.com/in/rutwikroutu/]  

---

<div align="center">

### 🎉 **Ready to start bluffing? Create a room and invite your friends!**

[👉 **Play Now on liars-poker-e2172.web.app**](https://liars-poker-e2172.web.app)

*Built with ❤️ by Rutwik Routu*

</div>
