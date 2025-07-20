import React, { useState } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import GameRoom from './components/GameRoom';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [roomData, setRoomData] = useState(null);

  const handleCreateRoom = () => {
    setCurrentScreen('create-room');
  };

  const handleJoinRoom = () => {
    setCurrentScreen('join-room');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setRoomData(null);
  };

  const handleRoomCreated = (roomId, playerId, playerName, serialNumber) => {
    setRoomData({
      roomId,
      playerId,
      playerName,
      serialNumber
    });
    setCurrentScreen('game-room');
  };

  const handleRoomJoined = (roomId, playerId, playerName, serialNumber, roomData) => {
    setRoomData({
      roomId,
      playerId,
      playerName,
      serialNumber
    });
    setCurrentScreen('game-room');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'create-room':
        return (
          <CreateRoom 
            onBack={handleBackToHome}
            onRoomCreated={handleRoomCreated}
          />
        );
      case 'join-room':
        return (
          <JoinRoom 
            onBack={handleBackToHome}
            onRoomJoined={handleRoomJoined}
          />
        );
      case 'game-room':
        return roomData ? (
          <GameRoom 
            roomId={roomData.roomId}
            playerId={roomData.playerId}
            playerName={roomData.playerName}
            serialNumber={roomData.serialNumber}
            onBack={handleBackToHome}
          />
        ) : (
          <div>Loading...</div>
        );
      case 'home':
      default:
        return (
          <HomeScreen 
            onCreateRoom={handleCreateRoom} 
            onJoinRoom={handleJoinRoom} 
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
