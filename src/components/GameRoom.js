import React, { useState, useEffect } from 'react';
import { listenToRoom, updateRoomStatus, generateSerialNumber } from '../firebase';
import { updateDoc, doc } from 'firebase/firestore';
import db from '../firebase';
import './GameRoom.css';

const GameRoom = ({ roomId, playerId, playerName, serialNumber, onBack }) => {
  const [room, setRoom] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [digit, setDigit] = useState(0);
  const [currentBet, setCurrentBet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (roomId) {
      const unsubscribe = listenToRoom(roomId, (roomData) => {
        console.log('Room data updated:', roomData);
        setRoom(roomData);
        if (roomData?.status === 'playing') {
          setGameStarted(true);
          setGameEnded(false);
          setWinner(null);
          setCurrentBet(null);
        }
        if (roomData?.status === 'finished') {
          setGameEnded(true);
          setWinner(roomData.winner);
        }
        if (roomData?.currentBet) {
          setCurrentBet(roomData.currentBet);
        }
      });

      return () => unsubscribe();
    }
  }, [roomId]);

  const isHost = room?.hostId === playerId;
  const playerCount = room?.players?.length || 0;
  const currentPlayerIndex = room?.gameState?.currentPlayerIndex || 0;
  const currentPlayer = room?.players?.[currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === playerId;
  const canMakeInitialBet = isHost && playerCount >= 2 && gameStarted && !currentBet;
  const canMakeMove = gameStarted && isMyTurn && !gameEnded && currentBet;

  console.log('Game state debug:', {
    isHost,
    playerCount,
    gameStarted,
    currentBet,
    canMakeInitialBet,
    canMakeMove,
    isMyTurn,
    currentPlayerIndex
  });

  const handlePlaceBet = async () => {
    console.log('Place bet clicked. Conditions:', {
      canMakeInitialBet,
      isHost,
      playerCount,
      gameStarted,
      currentBet
    });

    if (!canMakeInitialBet) {
      console.log('Cannot place bet - conditions not met');
      return;
    }

    setIsSubmitting(true);
    try {
      const betData = {
        quantity,
        digit,
        playerId,
        playerName,
        timestamp: new Date(),
        betText: `I bet at least ${quantity} ${digit}${quantity === 1 ? '' : "'s"}`
      };

      console.log('Creating bet data:', betData);

      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        currentBet: betData,
        gameState: {
          currentBet: betData,
          round: 1,
          currentPlayerIndex: 1  // Move to next player (index 1) after initial bet
        }
      });

      console.log('Successfully placed bet, moved to player index 1');
      setCurrentBet(betData);
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartGame = async () => {
    if (!isHost || playerCount < 2) return;

    try {
      await updateRoomStatus(roomId, 'playing');
      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  const handleRaiseBet = async () => {
    if (!canMakeMove || !currentBet) {
      console.log('Cannot make move:', { canMakeMove, currentBet });
      return;
    }

    console.log('Attempting to raise bet:', { quantity, digit, currentBet });

    // Validate raise: must increase quantity OR same quantity with higher digit
    const isValidRaise = quantity > currentBet.quantity || 
                        (quantity === currentBet.quantity && digit > currentBet.digit);

    if (!isValidRaise) {
      alert('Invalid raise! You must increase the quantity OR use the same quantity with a higher digit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBetData = {
        quantity,
        digit,
        playerId,
        playerName,
        timestamp: new Date(),
        betText: `I bet at least ${quantity} ${digit}${quantity === 1 ? '' : "'s"}`
      };

      const nextPlayerIndex = (currentPlayerIndex + 1) % playerCount;
      const roomRef = doc(db, 'rooms', roomId);
      
      console.log('Updating Firebase with new bet:', newBetData);
      console.log('Next player index:', nextPlayerIndex);
      
      await updateDoc(roomRef, {
        currentBet: newBetData,
        gameState: {
          currentBet: newBetData,
          round: room.gameState?.round || 1,
          currentPlayerIndex: nextPlayerIndex
        }
      });

      console.log('Successfully raised bet');
      setCurrentBet(newBetData);
    } catch (error) {
      console.error('Error raising bet:', error);
      alert('Failed to raise bet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChallenge = async () => {
    if (!canMakeMove || !currentBet) {
      console.log('Cannot challenge:', { canMakeMove, currentBet });
      return;
    }

    console.log('Attempting to challenge bet:', currentBet);

    setIsSubmitting(true);
    try {
      // Calculate total digits across all players
      const allDigits = room.players.map(player => player.serialNumber).join('');
      const targetDigit = currentBet.digit.toString();
      const actualCount = (allDigits.match(new RegExp(targetDigit, 'g')) || []).length;

      console.log('Challenge calculation:', {
        allDigits,
        targetDigit,
        actualCount,
        claimedCount: currentBet.quantity
      });

      const challengerWins = actualCount < currentBet.quantity;
      const winner = challengerWins ? playerName : currentBet.playerName;
      const winnerId = challengerWins ? playerId : currentBet.playerId;

      console.log('Challenge result:', { challengerWins, winner, winnerId });

      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        status: 'finished',
        winner: {
          name: winner,
          id: winnerId,
          reason: challengerWins ? 'Challenge successful' : 'Challenge failed'
        },
        gameResult: {
          claimedCount: currentBet.quantity,
          actualCount: actualCount,
          targetDigit: currentBet.digit,
          allSerialNumbers: room.players.map(p => ({ name: p.name, serial: p.serialNumber }))
        }
      });

      console.log('Successfully challenged bet');
      setGameEnded(true);
      setWinner({ name: winner, id: winnerId });
    } catch (error) {
      console.error('Error challenging bet:', error);
      alert('Failed to challenge bet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveRoom = async () => {
    setIsLeaving(true);
    try {
      // Remove player from room
      const updatedPlayers = room.players.filter(p => p.id !== playerId);
      const roomRef = doc(db, 'rooms', roomId);
      
      if (updatedPlayers.length === 0) {
        // If no players left, delete the room
        await updateDoc(roomRef, { status: 'deleted' });
      } else {
        // Update room with remaining players
        await updateDoc(roomRef, { players: updatedPlayers });
      }
      
      onBack();
    } catch (error) {
      console.error('Error leaving room:', error);
      alert('Failed to leave room. Please try again.');
    } finally {
      setIsLeaving(false);
    }
  };

  const handlePlayAgain = async () => {
    if (!isHost) return;
    setIsSubmitting(true);
    try {
      // Generate new serial numbers for all players
      const newPlayers = room.players.map(player => ({
        ...player,
        serialNumber: generateSerialNumber(),
      }));
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        status: 'playing',
        currentBet: null,
        gameState: null,
        winner: null,
        gameResult: null,
        players: newPlayers
      });
      setGameEnded(false);
      setWinner(null);
      setCurrentBet(null);
      setGameStarted(true);
    } catch (error) {
      console.error('Error resetting game:', error);
      alert('Failed to start a new round. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlayerIcon = (player) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const colorIndex = room.players.indexOf(player) % colors.length;
    const isCurrentTurn = gameStarted && currentPlayerIndex === room.players.indexOf(player);
    
    return (
      <div 
        className={`player-icon ${player.isHost ? 'host' : ''} ${isCurrentTurn ? 'current-turn' : ''}`}
        style={{ backgroundColor: colors[colorIndex] }}
      >
        {player.name.charAt(0).toUpperCase()}
        {player.isHost && <span className="host-badge">👑</span>}
        {isCurrentTurn && <span className="turn-badge">🎯</span>}
      </div>
    );
  };

  if (!room) {
    return (
      <div className="game-room-screen">
        <div className="loading">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="game-room-screen">
      <div className="game-room-container">
        <button className="back-btn" onClick={onBack}>
          ← Back to Home
        </button>

        <div className="room-header">
          <h1 className="room-title">Game Room</h1>
          <div className="room-code-section">
            <div className="room-code-label">Room Code:</div>
            <div className="room-code-display">
              <span className="code">{roomId}</span>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                }}
                title="Copy room code"
              >
                📋
              </button>
            </div>
          </div>
          <div className="player-count">{playerCount} player{playerCount !== 1 ? 's' : ''} in room</div>
        </div>

        <div className="game-content">
          {/* Host's Dollar Bill */}
          <div className="host-bill-section">
            <h2>Your Dollar Bill</h2>
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
                </div>
              </div>
            </div>
          </div>

          {/* Players List */}
          <div className="players-section">
            <h2>Players in Room</h2>
            <div className="players-grid">
              {room.players.map((player, index) => (
                <div key={player.id} className="player-card">
                  {getPlayerIcon(player)}
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    {player.isHost && <div className="host-label">Host</div>}
                    {gameStarted && currentPlayerIndex === index && <div className="turn-label">Current Turn</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="game-controls">
            {/* Host Controls */}
            {isHost && !gameStarted && (
              <div className="host-controls">
                <div className="start-game-section">
                  <button 
                    className="start-game-btn"
                    onClick={handleStartGame}
                    disabled={playerCount < 2}
                  >
                    {playerCount < 2 ? 'Need at least 2 players' : 'Start Game'}
                  </button>
                </div>
              </div>
            )}

            {/* Game Play Controls */}
            {gameStarted && !gameEnded && (
              <div className="game-play-controls">
                {currentBet && (
                  <div className="current-bet">
                    <h3>Current Bet</h3>
                    <div className="bet-display">
                      <span className="bet-text">{currentBet.betText}</span>
                      <span className="bet-player">- {currentBet.playerName}</span>
                    </div>
                  </div>
                )}

                {/* Initial bet for host after game starts */}
                {canMakeInitialBet && (
                  <div className="turn-controls">
                    <h3>Place Initial Bet</h3>
                    <div className="bet-controls">
                      <div className="slider-group">
                        <label>Quantity: {quantity}</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="slider"
                        />
                      </div>
                      
                      <div className="slider-group">
                        <label>Digit: {digit}</label>
                        <input
                          type="range"
                          min="0"
                          max="9"
                          value={digit}
                          onChange={(e) => setDigit(parseInt(e.target.value))}
                          className="slider"
                        />
                      </div>
                    </div>
                    
                    <div className="bet-preview">
                      <strong>Your bet:</strong> "I bet at least {quantity} {digit}{quantity === 1 ? '' : "'s"}"
                    </div>
                    
                    <button 
                      className="place-bet-btn"
                      onClick={handlePlaceBet}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
                    </button>
                  </div>
                )}

                {isMyTurn && currentBet && (
                  <div className="turn-controls">
                    <h3>Your Turn - Make a Move</h3>
                    <div className="bet-controls">
                      <div className="slider-group">
                        <label>Quantity: {quantity}</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="slider"
                        />
                      </div>
                      
                      <div className="slider-group">
                        <label>Digit: {digit}</label>
                        <input
                          type="range"
                          min="0"
                          max="9"
                          value={digit}
                          onChange={(e) => setDigit(parseInt(e.target.value))}
                          className="slider"
                        />
                      </div>
                    </div>
                    
                    <div className="bet-preview">
                      <strong>Your bet:</strong> "I bet at least {quantity} {digit}{quantity === 1 ? '' : "'s"}"
                    </div>
                    
                    <div className="action-buttons">
                      <button 
                        className="raise-btn"
                        onClick={handleRaiseBet}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Raising...' : 'Raise Bet'}
                      </button>
                      
                      <button 
                        className="challenge-btn"
                        onClick={handleChallenge}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Challenging...' : 'Challenge'}
                      </button>
                    </div>
                  </div>
                )}

                {!isMyTurn && gameStarted && (
                  <div className="waiting-turn">
                    <h3>Waiting for {currentPlayer?.name}'s turn...</h3>
                    {currentBet && (
                      <div className="current-bet">
                        <div className="bet-display">
                          <span className="bet-text">{currentBet.betText}</span>
                          <span className="bet-player">- {currentBet.playerName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Game End */}
            {gameEnded && (
              <div className="game-end">
                <h2>Game Over!</h2>
                <div className="winner-announcement">
                  <span className="winner-icon">🏆</span>
                  <span className="winner-name">{winner?.name} wins!</span>
                </div>
                {room.gameResult && (
                  <div className="game-result">
                    <p><strong>Claimed:</strong> {room.gameResult.claimedCount} {room.gameResult.targetDigit}'s</p>
                    <p><strong>Actual:</strong> {room.gameResult.actualCount} {room.gameResult.targetDigit}'s</p>
                    <div className="serial-numbers">
                      <h4>All Serial Numbers:</h4>
                      {room.gameResult.allSerialNumbers.map((player, index) => (
                        <div key={index} className="serial-item">
                          <span>{player.name}:</span> <span className="serial">{player.serial}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {isHost && (
                  <button 
                    className="play-again-btn"
                    onClick={handlePlayAgain}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Play Again'}
                  </button>
                )}
                <button 
                  className="leave-room-btn"
                  onClick={handleLeaveRoom}
                  disabled={isLeaving}
                >
                  {isLeaving ? 'Leaving...' : 'Leave Room'}
                </button>
              </div>
            )}
          </div>

          {/* Game Status */}
          {gameStarted && !gameEnded && (
            <div className="game-status">
              <div className="status-badge playing">Game in Progress</div>
              <p>Current turn: {currentPlayer?.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameRoom; 