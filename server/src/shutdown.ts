import { io, server } from './server.js';

async function shutdown(signal: string) {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
    // Відключаємо всіх клієнтів Socket.io
    io.disconnectSockets(true);
    console.log('All socket connections closed.');
  
    // Закриваємо HTTP сервер
    server.close((err) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
        process.exit(1);
      }
      console.log('HTTP server closed.');
      
      console.log('Graceful shutdown finished.');
      process.exit(0);
    });
  
    // Запобіжник: Якщо сервер не закрився за 10 секунд — вбиваємо примусово
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));