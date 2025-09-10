import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVBEw-LmizewxOiTZGsEKplUUZjCEMmZQ",
  authDomain: "sprint-retrospective-board.firebaseapp.com",
  databaseURL: "https://sprint-retrospective-board-default-rtdb.firebaseio.com",
  projectId: "sprint-retrospective-board",
  storageBucket: "sprint-retrospective-board.firebasestorage.app",
  messagingSenderId: "33872103198",
  appId: "1:33872103198:web:752ea4d67c4854688c6b0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);

export default app;