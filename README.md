# HolaChat (chat-application)

A full-stack, real-time chat application featuring direct messaging, group channels, file sharing, and AI-powered conversation summarization.

## 🚀 Key Features

*   **Real-Time Messaging:** Instant message delivery for both direct messages (DMs) and group channels using WebSockets.
*   **AI Chat Summarization:** Utilizes the OpenAI API to automatically generate concise summaries of missed messages in channels when users return.
*   **Secure Authentication:** User signup and login secured with bcrypt password hashing and HTTP-only JWT cookies.
*   **Rich Media Sharing:** Users can upload, send, preview, and download images and file attachments.
*   **Profile Customization:** Personalized user experience with customizable display names, profile pictures, and fallback avatar colors.
*   **Intuitive UI/UX:** Built with a modern, responsive interface featuring emoji pickers, seamless scrolling, and unread message management.

## 🛠️ Tech Stack

**Frontend**
*   **Core:** React (Vite)
*   **State Management:** Zustand
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Routing:** React Router
*   **Real-time & API:** Socket.io-client, Axios

**Backend**
*   **Core:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose
*   **Real-time:** Socket.io
*   **File Handling:** Multer (Local storage)
*   **AI Integration:** OpenAI API (gpt-4o-mini)
*   **Security:** JSON Web Tokens (JWT), bcrypt

---

## ⚙️ Local Development Setup

### Prerequisites
*   Node.js installed on your machine
*   A running instance of MongoDB (Local or Atlas)
*   An OpenAI API Key

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd chat-application
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory and add the following:
```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
ORIGIN=http://localhost:5173
JWT_KEY=your_super_secret_jwt_key
OPENAI_API_KEY=your_openai_api_key
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `/frontend` directory and add the following:
```env
VITE_SERVER_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173` to start using HolaChat!

---

## 📂 Project Structure Overview

```text
└── harshith-teja-chat-application/
    ├── backend/                 # Node.js & Express server
    │   ├── controller/          # Route logic (Auth, Channels, Contacts, Messages)
    │   ├── middleware/          # JWT Verification
    │   ├── model/               # Mongoose schemas
    │   ├── routes/              # Express API routes
    │   ├── socket.js            # WebSocket event handling
    │   └── uploads/             # Local storage for profiles and file attachments
    │
    └── frontend/                # React client
        ├── src/
        │   ├── components/      # Reusable UI components (Shadcn) & Socket Context
        │   ├── lib/             # Axios API client & utility functions
        │   ├── pages/           # Main views (Auth, Chat interface, Profile)
        │   ├── store/           # Zustand global state slices
        │   └── utils/           # Shared constants & API route strings
```
