// Точка входу в додаток
// Ініціалізуємо всі компоненти сервера

import { io } from './server.js';
import { initializeSocket } from './socket/index.js';
import './shutdown.js';

// Ініціалізуємо Socket.IO обробники
initializeSocket(io);

console.log('Server initialized successfully');
