import { Server, Socket } from 'socket.io';
import { Type, InputSocket } from '../types.js';
import { messageService } from '../services/messageService.js';

export function initializeSocket(io: Server): void {

  // Ініціалізуємо message service з Socket.IO сервером
  messageService.initialize(io);

  // Реєструємо обробник підключень
  io.on('connection', onConnection);
}

/**
 * Обробляє підключення нового клієнта
 */
function onConnection(socket: any): void {
  console.log(`User connected: ${socket.id}`);

  // Відправляємо історію повідомлень новому клієнту
  messageService.sendHistoryToClient(socket.id);

  // Слухаємо подію 'message' від клієнта
  socket.on('message', (data: string) => {
    handleMessage(socket, data);
  });

  socket.on('disconnect', () => {
    handleDisconnect(socket);
  });
}

/**
 * 
 */
function handleDisconnect(socket: any): void {
  
  // Створюємо та відправляємо системне повідомлення
  const systemMessage = messageService.createSystemMessage(
    `${socket.nickname} disconnected from chat`
  );
  messageService.broadcastMessage(systemMessage);

  console.log(`User disconnected: ${socket.id}`);
}

/**
 * Обробляє повідомлення від клієнта
 */
function handleMessage(socket: any, dataStr: string): void {
  console.log(`Message from client: ${dataStr}`);

  let data: InputSocket;

  // Парсимо JSON
  try {
    const parsed = JSON.parse(dataStr);
    data = parsed;
  } catch (err: any) {
    return messageService.sendError('Invalid JSON format');
  }

  // Валідація типу
  if (!data.type) {
    return messageService.sendError('Field "type" is required');
  }

  // Обробка різних типів повідомлень
  switch (data.type) {
    case Type.JOIN:
      handleJoin(socket, data);
      break;

    case Type.MESSAGE:
      handleChatMessage(socket, data);
      break;

    default:
      messageService.sendError(`Type ${data.type} is not handled`);
  }
}

/**
 * Обробляє підключення користувача до чату
 */
function handleJoin(socket: any, data: InputSocket): void {
  if (!data.username) {
    return messageService.sendError('Username is required for join');
  }

  // Зберігаємо нікнейм у socket
  socket.nickname = data.username;

  // Створюємо та відправляємо системне повідомлення
  const systemMessage = messageService.createSystemMessage(
    `${data.username} joined the chat`
  );
  messageService.broadcastMessage(systemMessage);

  console.log(`User ${data.username} (${socket.id}) joined the chat`);
}

/**
 * Обробляє повідомлення користувача в чаті
 */
function handleChatMessage(socket: any, data: InputSocket): void {
  // Перевірка чи користувач підключений
  if (!socket.nickname) {
    return messageService.sendError('You must join first');
  }

  // Перевірка наявності тексту
  if (!data.text || !data.text.trim()) {
    return messageService.sendError('Message text cannot be empty');
  }

  // Створюємо та відправляємо повідомлення
  const message = messageService.createMessage({
    type: Type.MESSAGE,
    username: socket.nickname,
    text: data.text.trim(),
  });

  messageService.broadcastMessage(message);

  console.log(`Message from ${socket.nickname}: ${data.text}`);
}
