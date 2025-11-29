<template>
  <div class="nickname-container">
    <div class="nickname-card">
      <h1 class="title">Enter your nickname</h1>
      <form @submit.prevent="handleSubmit" class="nickname-form">
        <input
          v-model="nickname"
          type="text"
          placeholder="Your name"
          class="nickname-input"
          required
          minlength="1"
          maxlength="20"
        />
        <button type="submit" class="submit-button">Enter the chat</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'nickname-set', nickname: string): void;
}>();

const nickname = ref<string>('');

const handleSubmit = (): void => {
  const trimmedNickname = nickname.value.trim();
  if (trimmedNickname) 
    emit('nickname-set', trimmedNickname);
};
</script>

<style scoped>
.nickname-container {
  width: 100%;
  max-width: 400px;
}

.nickname-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.nickname-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nickname-input {
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s;
}

.nickname-input:focus {
  border-color: #667eea;
}

.submit-button {
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-button:active {
  transform: translateY(0);
}
</style>