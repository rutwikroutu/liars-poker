import React, { useState } from 'react';
import { joinRoom, generatePlayerId } from '../firebase';
import './JoinRoom.css';

const JoinRoom = ({ onBack, onRoomJoined }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) {
      setError('Please enter both room code and your name');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      const playerId = generatePlayerId();
      const roomData = await joinRoom(roomCode.trim(), playerId, playerName.trim());
      
      // Store player info in localStorage for persistence
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('playerName', playerName.trim());
      localStorage.setItem('serialNumber', roomData.playerSerialNumber);
      
      // Call the callback to navigate to room
      if (onRoomJoined) {
        onRoomJoined(roomCode.trim(), playerId, playerName.trim(), roomData.playerSerialNumber, roomData);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      if (error.message === 'Room not found') {
        setError('Room not found. Please check the room code.');
      } else {
        setError('Failed to join room. Please try again.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="join-room-screen">
      <div className="join-room-container">
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>

        <h1 className="join-room-title">Join Room</h1>
        <p className="join-room-subtitle">Enter the room code to join an existing game</p>

        <div className="join-form">
          <div className="input-group">
            <label htmlFor="roomCode">Room Code</label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              disabled={isJoining}
              maxLength={20}
              onKeyPress={handleKeyPress}
              className={error && !roomCode.trim() ? 'error' : ''}
            />
          </div>

          <div className="input-group">
            <label htmlFor="playerName">Your Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              disabled={isJoining}
              maxLength={20}
              onKeyPress={handleKeyPress}
              className={error && !playerName.trim() ? 'error' : ''}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            className="join-room-btn"
            onClick={handleJoinRoom}
            disabled={isJoining || !roomCode.trim() || !playerName.trim()}
          >
            {isJoining ? 'Joining Room...' : 'Join Room'}
          </button>
        </div>

        <div className="join-info">
          <div className="info-card">
            <div className="info-icon">🎮</div>
            <h3>How to Join</h3>
            <p>Ask the host for the room code and enter it above to join their game.</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">👥</div>
            <h3>Multiple Players</h3>
            <p>You can join with multiple players using the same room code.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom; 