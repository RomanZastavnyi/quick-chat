import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import router from './routes/index.js';

// Створюємо Express додаток
const app = express();

// Middleware для парсингу JSON
app.use(express.json());

// Підключаємо роути
app.use(router);

// Створюємо HTTP сервер
export const httpServer: HttpServer = createServer(app);

// Створюємо Socket.IO сервер
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Запускаємо HTTP сервер
const PORT = 4000;
export const server = httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
