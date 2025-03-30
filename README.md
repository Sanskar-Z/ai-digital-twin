# AI Digital Twin

A comprehensive AI-powered personal assistant that functions as your digital twin. It adapts to your browsing habits, tone, and decision-making preferences to help with daily tasks.

## Features

- **Email Reply Generation**: Create personalized email replies with customizable tones (professional, friendly, formal, casual)
- **Email Summarization**: Quickly extract key information from long email threads
- **News Summaries**: Get concise summaries of news articles tailored to your interests
- **Calendar Management**: Schedule meetings, set reminders, and manage your calendar
- **Research Assistance**: Analyze documents, summarize papers, and find relevant information

## Technologies Used

### Frontend
- React (with React Router for navigation)
- Firebase Authentication
- Axios for API requests
- Modern, responsive UI

### Backend
- Node.js with Express
- Firebase Admin SDK

## Architecture

The application follows a client-server architecture:

1. **Frontend**: React application that provides the user interface and interacts with backend APIs
2. **Backend API**: Express server that handles business logic and authentication
3. **Firebase**: Provides authentication services

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- Firebase account

### Installation

#### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/Sanskar-Z/ai-digital-twin.git
   cd ai-digital-twin/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

4. Add your Firebase service account credentials to `firebase-service-account.json`

5. Start the backend server
   ```
   npm start
   ```

#### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure Firebase in `src/firebase.js` with your Firebase project details

4. Start the development server
   ```
   npm run dev
   ```

5. The application will be available at `http://localhost:5173`

## Deployment

### Frontend
The frontend is configured for deployment to Firebase Hosting:

```
npm run build
firebase deploy --only hosting
```

### Backend
The backend can be deployed to any Node.js hosting service like Render or Vercel using the configuration in `render.yaml`.

## Project Structure

```
ai-digital-twin/
├── frontend/              # React frontend
│   ├── public/            # Public assets
│   ├── src/               # Source files
│   │   ├── assets/        # Static assets
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.jsx        # Main application component
│   │   ├── firebase.js    # Firebase configuration
│   │   └── main.jsx       # Application entry point
│   ├── index.html         # HTML template
│   └── package.json       # Dependencies and scripts
├── backend/               # Express backend
│   ├── app/               # Application files
│   ├── functions/         # Firebase functions
│   ├── models/            # Data models
│   └── index.js           # Backend entry point
├── firebase.json          # Firebase configuration
└── render.yaml            # Render deployment configuration
```

## APIs

### Email Services
- `POST /email_generate`: Generate email reply based on content and tone
- `POST /email_summarize`: Summarize email content

### News Services
- `POST /news_summarize`: Summarize news articles with customization by user interests

### Calendar Services
- `POST /calendar/schedule`: Schedule a new meeting
- `GET /calendar/events`: Retrieve calendar events
- `DELETE /calendar/events/:eventId`: Delete a calendar event

### Research Services
- `POST /api/research/insights`: Get research insights based on input and query type


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for authentication and database
- [React](https://reactjs.org/) for frontend framework
- [Express](https://expressjs.com/) for backend API