# Chat (Vue 3 + Socket.IO)

## Description
A minimal chat app with a separate frontend (Vite + Vue 3) and backend (Express + Socket.IO). The backend handles `join` and `message` events, stores history in memory, and broadcasts updates to all clients; the frontend lets a user set a nickname, connect, and chat in real time.

## Tech stack
- **Frontend:** Vite, Vue 3, TypeScript, `socket.io-client`
- **Backend:** Node.js, Express, Socket.IO, TypeScript

## Clone the repository
```bash
git clone <YOUR_REPO_URL> quick-challenge
cd quick-challenge
```

## Run the backend
```bash
cd server
npm install
npm run dev        # dev mode at http://localhost:4000
```

## Run the frontend
```bash
cd client
npm install
npm run dev        # dev mode at http://localhost:4010
```

## Where to test
After both parts are running, open `http://localhost:4010`, enter a nickname, and start chatting.

## Socket message examples
- Client → server (join):
```json
{ "type": "join", "username": "Alice" }
```
- Client → server (send message):
```json
{ "type": "message", "username": "Alice", "text": "Hello!" }
```
- Server → client (history/broadcast):
```json
{ "type": "message", "username": "Alice", "text": "Hello!", "timestamp": "2024-01-01T12:00:00.000Z" }
```
- Server → client (system):
```json
{ "type": "system", "text": "Alice joined the chat", "timestamp": "2024-01-01T12:00:00.000Z" }
```
