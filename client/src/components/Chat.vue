<template>
  <div class="chat-container">
    <div class="chat-card">
      <div class="chat-header">
        <h2 class="chat-title">Chat</h2>
        <div class="user-info">
          <span class="nickname-badge">{{ nickname }}</span>
          <button @click="disconnect" class="disconnect-button">Exit</button>
        </div>
      </div>

      <div ref="messagesContainer" class="messages-container">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.isOwn ? 'own-message' : 'other-message']"
        >
          <div class="message-header">
            <span class="message-username">{{ message.username || 'System' }}</span>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-text">{{ message.text }}</div>
        </div>
        <div v-if="messages.length === 0" class="empty-state">
          No messages yet. Start a conversation!
        </div>
      </div>

      <div class="input-container">
        <input
          v-model="messageText"
          @keypress.enter="sendMessage"
          type="text"
          placeholder="Enter message..."
          class="message-input"
        />
        <button @click="sendMessage" class="send-button">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { io, Socket } from 'socket.io-client';
import type { Message, InputSocket, OutputSocket } from '../types';

const props = defineProps<{
  nickname: string;
}>();

const emit = defineEmits<{
  (e: 'disconnect'): void;
}>();

const messages = ref<Message[]>([]);
const messageText = ref<string>('');
const messagesContainer = ref<HTMLDivElement | null>(null);
const socket = ref<Socket | null>(null);

const formatTime = (timestamp?: string): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const scrollToBottom = (): void => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const addMessage = (messageData: string | OutputSocket): void => {
  console.log('messageData', messageData);
  try {
    const data: OutputSocket =
      typeof messageData === 'string' ? JSON.parse(messageData) : messageData;

    messages.value.push({
      type: data.type,
      username: data.username,
      text: data.text,
      timestamp: data.timestamp || new Date().toISOString(),
      isOwn: data.username === props.nickname,
    });

    scrollToBottom();
  } catch (error) {
    console.error('Error parsing message:', error);
    messages.value.push({
      type: 'error',
      username: 'Система',
      text: 'Помилка обробки повідомлення',
      timestamp: new Date().toISOString(),
      isOwn: false,
    });
  }
};

const sendMessage = (): void => {
  const text = messageText.value.trim();
  if (!text || !socket.value) return;

  const message: InputSocket = {
    type: 'message',
    username: props.nickname,
    text,
  };

  socket.value.emit('message', JSON.stringify(message));
  messageText.value = '';
};

const joinChat = (): void => {
  if (!socket.value) return;

  const joinMessage: InputSocket = {
    type: 'join',
    username: props.nickname,
  };

  socket.value.emit('message', JSON.stringify(joinMessage));
};

const disconnect = (): void => {
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
  emit('disconnect');
};

onMounted(() => {
  socket.value = io('http://localhost:4000', {
    transports: ['websocket', 'polling'],
  });

  socket.value.on('connect', () => {
    console.log('Connected to server');
    joinChat();
  });

  socket.value.on('message', (data: string | OutputSocket) => {
    addMessage(data);
  });

  socket.value.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.value.on('connect_error', (error: Error) => {
    console.error('Connection error:', error);
    addMessage({
      type: 'error',
      text: 'Помилка підключення до сервера',
      timestamp: new Date().toISOString(),
    });
  });
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 800px;
  height: 90vh;
  max-height: 700px;
}

.chat-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-header {
  padding: 20px 24px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-title {
  font-size: 24px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nickname-badge {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.disconnect-button {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.disconnect-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
}

.message {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 70%;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.own-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.other-message {
  background: white;
  color: #333;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  opacity: 0.9;
  gap: 5px;
}

.message-username {
  font-weight: 600;
}

.message-time {
  opacity: 0.7;
  font-size: 11px;
}

.message-text {
  word-wrap: break-word;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-style: italic;
}

.input-container {
  padding: 20px 24px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  gap: 12px;
  background: white;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s;
}

.message-input:focus {
  border-color: #667eea;
}

.send-button {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.send-button:active {
  transform: translateY(0);
}

/* Scrollbar styling */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>