import React from 'react';
import './HomeScreen.css';

const HomeScreen = ({ onCreateRoom, onJoinRoom }) => {
  return (
    <div className="home-screen">
      <div className="home-container">
        <h1 className="game-title">Liar's Poker</h1>
        <p className="game-description">
          A bluffing and probability-based game where players bet on the frequency 
          of digits across all players' numbers. Out-bluff your opponents to win!
        </p>
        
        <div className="game-features">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <span>Bluff your way to victory</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎲</span>
            <span>Probability-based gameplay</span>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <span>2+ players supported</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="create-room-btn"
            onClick={onCreateRoom}
          >
            Create New Room
          </button>
          
          <button 
            className="join-room-btn"
            onClick={onJoinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen; 