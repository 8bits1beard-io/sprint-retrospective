# Firebase Setup Instructions

## IMPORTANT: You need to complete these steps for the shared collaboration feature to work!

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or "Add project")
3. Name your project (e.g., "sprint-retrospective")
4. Disable Google Analytics for now (you can enable it later)
5. Click "Create Project"

### Step 2: Enable Realtime Database

1. In the Firebase Console, click on "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose a location closest to your users
4. Start in "test mode" for now (you can add security rules later)
5. Click "Enable"

### Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (Web) icon to add a web app
5. Register your app with a nickname like "retro-board"
6. Copy the configuration object that appears

### Step 4: Update Your Configuration

1. Open `retro-board/src/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR-ACTUAL-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR-PROJECT.firebaseio.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};
```

### Step 5: Test the Application

1. Run `npm start` in the retro-board directory
2. Click "Start Shared Session" button
3. Share the generated link with team members
4. All participants will see real-time updates!

## How It Works

- **Local Mode**: Default mode, data stored in browser's localStorage
- **Shared Mode**: Click "Share" to create a shared session with a unique ID
- **Session Links**: Share the URL with your team (e.g., `yoursite.com?session=ABC123`)
- **Real-time Sync**: All changes sync instantly across all connected users

## Security Rules (Optional but Recommended)

After testing, update your Firebase Realtime Database rules for better security:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['sprint', 'date', 'columns', 'actionItems'])"
      }
    }
  }
}
```

## Deployment

When deploying to production:
1. Update Firebase security rules
2. Consider adding authentication
3. Set up proper CORS rules if needed
4. Monitor usage in Firebase Console

## Troubleshooting

- **"Firebase not configured" error**: Make sure you've updated the firebase.ts file with your config
- **"Permission denied" error**: Check your database rules in Firebase Console
- **Connection issues**: Ensure your Firebase project is active and database is enabled