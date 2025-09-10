# Windows Engineering OS Team - Sprint Retrospective Board

A collaborative Sprint Retrospective board designed for the Walmart Windows Engineering OS Team. This single-page web application uses browser local storage for data persistence and supports team retrospectives using the "4 L's" format.

## Features

### Core Functionality
- **4 L's Retrospective Format**:
  - **Liked**: What went well
  - **Learned**: New discoveries
  - **Lacked**: What was missing
  - **Longed For**: What we wished we had

### Collaboration Features
- Cross-tab synchronization on the same device
- User identification system
- Data persists in browser local storage
- Works completely offline

### Note Management
- Add sticky notes to any column
- Character limit (280 characters) for focused feedback
- Color coding with 4 color options (yellow, blue, green, pink)
- Edit and delete capabilities (author only)
- Voting system (thumbs up, max 1 vote per user per note)
- Timestamps and author attribution

### Additional Features
- **Action Items Section**: Track follow-up tasks with owner assignment
- **Timer**: 5/15/30 minute countdown for timeboxing discussions
- **Export to Markdown**: Generate formatted retrospective summaries
- **Sprint Management**: Editable sprint number and date
- **Keyboard Shortcuts**:
  - Ctrl/Cmd + N: New note focus
  - Ctrl/Cmd + E: Export to markdown
- **Clear Board**: Admin function with confirmation dialog

## Technology Stack

- **Frontend**: React with TypeScript and Hooks
- **Data Storage**: Browser Local Storage
- **Cross-tab Sync**: Storage events and polling
- **Styling**: Tailwind CSS with Walmart branding
- **Build Tool**: Create React App
- **Deployment**: Optimized for Cloudflare Pages (no backend required)

## Quick Start

### Prerequisites
- Node.js (v14 or higher) - only for development
- npm or yarn - only for development
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd board
```

2. Install dependencies:
```bash
cd retro-board
npm install
```

3. Start development server:
```bash
npm start
```

The application will open at http://localhost:3000

## Deployment

### Cloudflare Pages

The project includes a pre-built `HTML` folder ready for Cloudflare Pages deployment:

1. Upload the contents of the `HTML` folder directly to Cloudflare Pages
2. No build step or environment variables required
3. Deploy!

**Or use any static hosting service:**
- GitHub Pages
- Netlify
- Vercel
- Any web server
- Even open index.html directly in a browser

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Data Storage

The application uses browser local storage:
- Data persists between sessions
- Automatically syncs across tabs on the same browser
- Each browser/device maintains its own data
- No server or database required

## Project Structure

```
retro-board/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── Note.tsx     # Individual note component
│   │   ├── Column.tsx   # Column component for 4 L's
│   │   ├── ActionItems.tsx # Action items section
│   │   └── Timer.tsx    # Timer component
│   ├── storage.ts       # Local storage management
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   ├── App.tsx          # Main application component
│   └── index.css        # Global styles with Tailwind
├── HTML/                # Pre-built files for Cloudflare Pages
└── package.json         # Project dependencies
```

## Usage Guide

### Starting a Retrospective

1. **Enter Your Name**: On first visit, enter your name to identify your contributions
2. **Set Sprint Info**: Click on the sprint number/date to edit
3. **Add Notes**: Click the + button in any column to add a note
4. **Choose Color**: Select a color for your note before adding
5. **Edit/Delete**: Only authors can edit or delete their own notes
6. **Vote**: Click the thumbs up to vote (one vote per person per note)

### Managing Action Items

1. Click "Add Action Item" button
2. Enter the task description and owner name
3. Mark items as complete with the checkbox
4. Delete items with the X button

### Using the Timer

1. Select duration (5, 15, or 30 minutes)
2. Click play to start countdown
3. Click pause to stop
4. Click reset to restart

### Exporting Results

1. Click the "Export" button in the header
2. A markdown file will be downloaded with:
   - Sprint information
   - All notes organized by column
   - Vote counts
   - Action items with owners
   - Timestamp of export

## Customization

### Branding

Edit the Tailwind configuration in `tailwind.config.js`:

```javascript
colors: {
  'walmart-blue': '#0071ce',
  'walmart-yellow': '#ffc220',
  'walmart-dark': '#004c91',
  'walmart-light': '#e6f2ff',
}
```

### Column Configuration

Modify the column setup in `src/utils.ts`:

```javascript
const configs = {
  liked: {
    title: 'Liked',
    subtitle: 'What went well',
    icon: '👍',
    // ... styling
  },
  // Add or modify columns here
}
```

## Performance Considerations

- Optimized re-rendering with React.memo
- Debounced Firebase updates
- Maximum 50 notes per column limit
- Client-side rate limiting
- Local storage backup for connection issues

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Local Storage Issues
- Check browser settings allow local storage
- Verify browser is not in private/incognito mode
- Clear browser cache if data appears corrupted

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure Node.js version is 14 or higher
- Check for conflicting global packages

### Cross-tab Sync Not Working
- Ensure tabs are in the same browser
- Check that local storage is enabled
- Refresh the tab if sync appears stuck

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with multiple users
5. Submit a pull request

## License

Internal use only - Walmart Windows Engineering OS Team

## Credits

Developed by Joshua Walderbach - September 2025

## Support

For issues or questions, please contact the Windows Engineering OS Team or create an issue in the repository.