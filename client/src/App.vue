<template>
  <div id="app">
    <NicknameInput v-if="!nickname" @nickname-set="handleNicknameSet" />
    <Chat v-else :nickname="nickname" @disconnect="handleDisconnect" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NicknameInput from './components/NicknameInput.vue';
import Chat from './components/Chat.vue';

const nickname = ref<string>('');

const handleNicknameSet = (newNickname: string): void => {
  nickname.value = newNickname;
};

const handleDisconnect = (): void => {
  nickname.value = '';
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>