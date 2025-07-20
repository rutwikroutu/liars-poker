import React, { useState, useEffect } from 'react';
import { createRoom, generatePlayerId } from '../firebase';
import './CreateRoom.css';

const CreateRoom = ({ onBack, onRoomCreated }) => {
  const [playerName, setPlayerName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  // Generate random serial number (2 letters + 8 numbers)
  const generateSerialNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let serial = '';
    // Add 2 random letters
    for (let i = 0; i < 2; i++) {
      serial += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Add 8 random numbers
    for (let i = 0; i < 8; i++) {
      serial += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return serial;
  };

  // Generate serial number on component mount
  useEffect(() => {
    setSerialNumber(generateSerialNumber());
  }, []);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreating(true);
    try {
      const playerId = generatePlayerId();
      const roomId = await createRoom(playerId, playerName.trim(), serialNumber);
      setRoomCode(roomId);
      
      // Store player info in localStorage for persistence
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('playerName', playerName.trim());
      localStorage.setItem('serialNumber', serialNumber);
      
      // Call the callback to navigate to room
      if (onRoomCreated) {
        onRoomCreated(roomId, playerId, playerName.trim(), serialNumber);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRegenerateSerial = () => {
    setSerialNumber(generateSerialNumber());
  };

  return (
    <div className="create-room-screen">
      <div className="create-room-container">
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>

        <h1 className="create-room-title">Create New Room</h1>
        <p className="create-room-subtitle">You'll be the host of this game</p>

        <div className="dollar-bill-container">
          <div className="dollar-bill">
            <div className="bill-header">
              <div className="federal-reserve">FEDERAL RESERVE NOTE</div>
              <div className="series">Series 2021</div>
            </div>
            
            <div className="bill-content">
              <div className="bill-left">
                <div className="portrait-placeholder">
                  <div className="portrait-circle">G</div>
                </div>
                <div className="bill-text">
                  <div className="denomination">ONE DOLLAR</div>
                  <div className="treasury">THE UNITED STATES OF AMERICA</div>
                  <div className="promise">THIS NOTE IS LEGAL TENDER FOR ALL DEBTS, PUBLIC AND PRIVATE</div>
                </div>
              </div>
              
              <div className="bill-right">
                <div className="seal-placeholder">
                  <div className="seal-circle">★</div>
                </div>
                <div className="serial-label">SERIAL NUMBER</div>
                <div className="serial-number">{serialNumber}</div>
                <button 
                  className="regenerate-btn"
                  onClick={handleRegenerateSerial}
                  disabled={isCreating}
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label htmlFor="playerName">Your Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              disabled={isCreating}
              maxLength={20}
            />
          </div>

          <button 
            className="create-room-btn"
            onClick={handleCreateRoom}
            disabled={isCreating || !playerName.trim()}
          >
            {isCreating ? 'Creating Room...' : 'Create Room'}
          </button>
        </div>

        {roomCode && (
          <div className="room-created">
            <div className="success-message">
              <span className="success-icon">✅</span>
              Room created successfully!
            </div>
            <div className="room-code">
              Room Code: <span className="code">{roomCode}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoom; 