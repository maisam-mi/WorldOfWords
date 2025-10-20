<template>
  <main class="flex flex-col items-center mt-[10rem] md:mt-0">
    <img src="/logo/logo.webp" alt="logo of World of Words" />
    <input type="text" name="name" placeholder="Name" v-model="username"/>
    <button @click="createLobby()">Create a lobby</button>
    <p>or</p>

    <input type="text" name="link" placeholder="Link" v-model="urlInput" />
    <button @click="enterLobby()">Enter the lobby</button>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const myStore = mainStore();

const router = useRouter();

const username = ref('Maisam');
const urlInput = ref('');

const createLobby = () => {
  if (!username.value.trim()) {
    alert('Geben Sie bitte Ihren Namen ein.');
    return;
  } else {
    myStore.socket.emit('lobby and admin creation', username.value);
    router.push(`/gameroomhost`);
  }
};
const enterLobby = () => {
  if (!username.value.trim()) {
    alert('Geben Sie bitte Ihren Namen ein.');
    return;
  } else {
    myStore.socket.emit('entering the lobby', username.value, urlInput.value);
    router.push(`/gameroomplayer`);
  }
};
</script>

<style scoped>
main{
  gap: 1rem;
}

button{
  padding: 15px 30px;
}

@media only screen and (max-width: 768px) {
  main {
    gap: 3rem;
  }
}
</style>
