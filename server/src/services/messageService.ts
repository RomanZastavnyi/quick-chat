import { Server } from 'socket.io';
import { OutputSocket, Type } from '../types.js';
import * as messageStorage from '../storage/messageStorage.js';

/**
 * Сервіс для роботи з повідомленнями
 * Містить бізнес-логіку створення, зберігання та відправки повідомлень
 */
class MessageService {
  private io: Server | null = null;

  /**
   * Ініціалізує сервіс з Socket.IO сервером
   */
  initialize(io: Server): void {
    this.io = io;
  }

  /**
   * Створює нове повідомлення з timestamp
   */
  createMessage(data: OutputSocket): OutputSocket {
    return {
      ...data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Створює системне повідомлення
   */
  createSystemMessage(text: string): OutputSocket {
    return this.createMessage({
      type: Type.SYSTEM,
      text,
    });
  }

  /**
   * Створює повідомлення про помилку
   */
  createErrorMessage(text: string): OutputSocket {
    return this.createMessage({
      type: Type.ERROR,
      text,
    });
  }

  /**
   * Відправляє повідомлення всім підключеним клієнтам через Socket.IO
   */
  broadcastMessage(message: OutputSocket): void {
    if (!this.io) {
      console.error('MessageService: Socket.IO server is not initialized');
      return;
    }

    // Зберігаємо повідомлення
    messageStorage.create(message);

    // Відправляємо всім клієнтам
    this.io.emit('message', JSON.stringify(message));
  }

  /**
   * Відправляє повідомлення про помилку
   */
  sendError(message: string): void {
    const errorMessage = this.createErrorMessage(message);
    this.broadcastMessage(errorMessage);
  }

  /**
   * Відправляє всі збережені повідомлення конкретному клієнту
   */
  sendHistoryToClient(socketId: string): void {
    if (!this.io) {
      console.error('MessageService: Socket.IO server is not initialized');
      return;
    }

    const messages = messageStorage.findAll();
    
    // Відправляємо кожне повідомлення окремо
    messages.forEach((message) => {
      this.io!.to(socketId).emit('message', JSON.stringify(message));
    });
  }
}

// Експортуємо singleton екземпляр
export const messageService = new MessageService();
