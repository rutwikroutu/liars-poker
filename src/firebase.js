import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC84n5E2QWT0Bxk5ExWvxbDI2z6lUJen_Q",
    authDomain: "liars-poker-e2172.firebaseapp.com",
    projectId: "liars-poker-e2172",
    storageBucket: "liars-poker-e2172.firebasestorage.app",
    messagingSenderId: "773209002237",
    appId: "1:773209002237:web:7059a4d9e1f061bd092e94"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Collections
export const ROOMS_COLLECTION = 'rooms';
export const PLAYERS_COLLECTION = 'players';
export const GAMES_COLLECTION = 'games';

// Room management functions
export const createRoom = async (hostId, hostName, hostSerialNumber) => {
  try {
    console.log('Creating room for host:', hostName, 'with serial:', hostSerialNumber);
    const roomData = {
      hostId,
      hostName,
      hostSerialNumber,
      players: [{
        id: hostId,
        name: hostName,
        serialNumber: hostSerialNumber,
        isHost: true,
        joinedAt: new Date()
      }],
      status: 'waiting', // waiting, playing, finished
      createdAt: new Date(),
      gameState: null
    };
    
    const docRef = await addDoc(collection(db, ROOMS_COLLECTION), roomData);
    console.log('Room created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const joinRoom = async (roomId, playerId, playerName) => {
  try {
    console.log('Attempting to join room:', roomId);
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const roomDoc = await getDoc(roomRef);
    
    console.log('Room document exists:', roomDoc.exists());
    
    if (!roomDoc.exists()) {
      console.log('Room not found in Firebase');
      throw new Error('Room not found');
    }
    
    const roomData = roomDoc.data();
    console.log('Room data retrieved:', roomData);
    
    // Check if player is already in the room
    const existingPlayer = roomData.players.find(p => p.id === playerId);
    if (existingPlayer) {
      console.log('Player already in room');
      return roomData;
    }
    
    // Generate serial number for the joining player
    const serialNumber = generateSerialNumber();
    console.log('Generated serial number for new player:', serialNumber);
    
    // Add new player
    const updatedPlayers = [...roomData.players, {
      id: playerId,
      name: playerName,
      serialNumber: serialNumber,
      isHost: false,
      joinedAt: new Date()
    }];
    
    await updateDoc(roomRef, {
      players: updatedPlayers
    });
    
    console.log('Successfully joined room');
    return { ...roomData, players: updatedPlayers, playerSerialNumber: serialNumber };
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

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

export const getRoom = async (roomId) => {
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      return null;
    }
    
    return { id: roomDoc.id, ...roomDoc.data() };
  } catch (error) {
    console.error('Error getting room:', error);
    throw error;
  }
};

export const listenToRoom = (roomId, callback) => {
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export const updateRoomStatus = async (roomId, status) => {
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await updateDoc(roomRef, { status });
  } catch (error) {
    console.error('Error updating room status:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId);
    await deleteDoc(roomRef);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// Player management functions
export const generatePlayerId = () => {
  return 'player_' + Math.random().toString(36).substr(2, 9);
};

export default db;
