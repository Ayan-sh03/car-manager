# Car management Project

## Tech Stack

**Frontend:**

- React with TypeScript
- Vite
- React Router for navigation
- Zustand for state management
- Radix UI components

**Backend:**

- Node.js with Express
- MongoDB
- JWT Authentication
- Swagger for API documentation

## Environment Setup

### Backend (.env)

```env
MONGO_URI=mongodb+srv://[your-username]:[your-password]@cluster0.vflgg5f.mongodb.net/zapspell
JWT_SECRET=secret123
PORT=8080
```

### Frontend (.env)

```env
VITE_PUBLIC_SERVER_URL="deployed-url"
```

## Getting Started

1. Clone the repository:
2. Install dependencies for both frontend and backend

```
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

```

3. Start

```
# Backend
npm start

# Frontend
npm run dev
```

4. Open your browser and go to http://localhost:5173 to access the application.

API documentation is available at http://localhost:8080/api/docs.

5.To seed the Database run :

```node
npm run seed
```
