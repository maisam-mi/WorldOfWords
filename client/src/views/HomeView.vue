<template>
  <div class="background h-[100vh] w-[100vw]">
    <div class="mt-[17%] grid gap-2">
      <button @click="createLobby()" class="mb-4">
        <div class="image-container mb-6">
          <img src="../assets/images/StartButton.svg" alt="" class="normal-image" />
          <img src="../assets/images/StartButton2.svg" alt="" class="hover-image" />
        </div>
      </button>
      <p class="mx-auto text-white">oder</p>
      <input
        type="text"
        class="bg-transparent my-1 rounded-full pl-4 text-white"
        :style="{ border: '2px solid white' }"
        name=""
        id=""
        placeholder="name"
        v-model="username"
      />
      <input
        type="text"
        class="bg-transparent my-1 rounded-full pl-4 text-white"
        :style="{ border: '2px solid white' }"
        placeholder="link"
        v-model="urlInput"
      />
      <button @click="enterLobby()">
        <div class="image-container">
          <img src="../assets/images/JoinButton.svg" alt="" class="normal-image" />
          <img src="../assets/images/JoinButton2.svg" alt="" class="hover-image" />
        </div>
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import useDefaultStore from '@/stores/defaultStore.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

console.log('Step 1');

const myStore = useDefaultStore();

const router = useRouter();

const username = ref('');
const urlInput = ref('');

const createLobby = () => {
  if (!username.value.trim()) {
    alert('Geben Sie bitte Ihren Namen ein.');
    return;
  } else {
    myStore.socket.emit('connected as admin', myStore.socket.id, 'Admin', username.value);
    myStore.socket.on('user receive your lobby', (paramLobby) => {
      myStore.lobby = paramLobby;
    });
    router.push(`/gameroomhost`);
  }
};
const enterLobby = () => {
  if (!username.value.trim()) {
    alert('Geben Sie bitte Ihren Namen ein.');
    return;
  } else {
    myStore.socket.emit('connected as player', myStore.socket.id, 'Player', username.value);
    myStore.socket.emit('send me the lobby', urlInput.value);
    myStore.updateLobby();
    router.push(`/gameroomplayer`);
  }
};
</script>

<style scoped>
@media (max-width: 640px) {
  .background {
    background-image: url('../assets/images/MBackground.webp');
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

@media (min-width: 641px) {
  .background {
    background-image: url('../assets/images/HomeBackground.webp');
    background-position-y: bottom;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.image-container {
  position: relative;
}

.normal-image,
.hover-image {
  position: absolute;
  transition: opacity 0.3s ease-in-out;
}

.hover-image {
  opacity: 0;
}

.image-container:hover .normal-image {
  opacity: 0;
}

.image-container:hover .hover-image {
  opacity: 1;
}

input:focus-visible {
  outline: none;
}
</style>
