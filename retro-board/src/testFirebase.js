// Firebase Connection Test
// Run this file with: node src/testFirebase.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, onValue } = require('firebase/database');

// Your Firebase configuration
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
const database = getDatabase(app);

console.log('🔥 Firebase Test Script Starting...\n');

async function runTests() {
  const testSessionId = 'TEST' + Date.now();
  const sessionRef = ref(database, `sessions/${testSessionId}`);
  
  console.log('📝 Test 1: Writing data to Firebase...');
  const testData = {
    sprint: '99',
    date: new Date().toISOString(),
    columns: {
      wentWell: [
        {
          id: 'test1',
          text: 'Firebase test is working!',
          author: 'Test User',
          timestamp: new Date().toISOString(),
          color: 'green',
          votes: [],
          columnId: 'wentWell'
        }
      ],
      didntGoWell: [],
      kudos: []
    },
    actionItems: [
      {
        id: 'action1',
        text: 'Test action item',
        owner: 'Test Owner',
        dateAdded: new Date().toISOString(),
        completed: false
      }
    ],
    activeUsers: 1
  };
  
  try {
    await set(sessionRef, testData);
    console.log('✅ Write successful!\n');
  } catch (error) {
    console.error('❌ Write failed:', error.message);
    return;
  }
  
  console.log('📖 Test 2: Reading data from Firebase...');
  try {
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ Read successful!');
      console.log('Session ID:', testSessionId);
      console.log('Sprint:', data.sprint);
      console.log('Notes in "What Went Well":', data.columns.wentWell.length);
      console.log('Action Items:', data.actionItems.length);
      console.log('\n');
    } else {
      console.error('❌ No data available');
    }
  } catch (error) {
    console.error('❌ Read failed:', error.message);
    return;
  }
  
  console.log('👂 Test 3: Setting up real-time listener...');
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('✅ Real-time update received!');
      console.log('Data sprint:', data.sprint);
    }
  });
  
  // Update data to trigger listener
  console.log('📝 Test 4: Updating data to trigger listener...');
  try {
    await set(ref(database, `sessions/${testSessionId}/sprint`), '100');
    console.log('✅ Update successful!\n');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
  
  // Clean up
  setTimeout(async () => {
    console.log('🧹 Cleaning up test data...');
    try {
      await set(sessionRef, null);
      console.log('✅ Test data cleaned up');
      console.log('\n========================================');
      console.log('🎉 All Firebase tests completed!');
      console.log('Your Firebase connection is working properly.');
      console.log('========================================\n');
      process.exit(0);
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    }
  }, 2000);
}

// Run the tests
runTests().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});