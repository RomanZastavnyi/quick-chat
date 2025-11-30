<template>
  <div class="users-list-container">
    <div class="users-list-header">
      <h3 class="users-list-title">Online Users</h3>
      <span class="users-count">{{ onlineUsers.length }}</span>
    </div>
    
    <div class="users-list">
      <div
        v-for="user in onlineUsers"
        :key="user.id"
        class="user-item"
        :class="{ 'current-user': user.username === currentUsername }"
      >
        <div class="user-indicator"></div>
        <span class="user-name">{{ user.username }}</span>
        <span v-if="user.username === currentUsername" class="user-badge">You</span>
      </div>
      
      <div v-if="onlineUsers.length === 0" class="empty-users">
        No users online
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OnlineUser } from '../types';

interface Props {
  onlineUsers: OnlineUser[];
  currentUsername: string;
}

defineProps<Props>();
</script>

<style scoped>
.users-list-container {
  width: 250px;
  background: white;
  border-left: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.users-list-header {
  padding: 20px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.users-list-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.users-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: background 0.2s;
}

.user-item:hover {
  background: #e9ecef;
}

.user-item.current-user {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
}

.user-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #28a745;
  flex-shrink: 0;
}

.user-item.current-user .user-indicator {
  background: #667eea;
}

.user-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-badge {
  font-size: 11px;
  padding: 2px 6px;
  background: #667eea;
  color: white;
  border-radius: 10px;
  font-weight: 500;
}

.empty-users {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-style: italic;
  font-size: 14px;
}

/* Scrollbar styling */
.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.users-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

