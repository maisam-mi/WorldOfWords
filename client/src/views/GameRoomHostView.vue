<template>
  <main class="flex flex-col gap-[4rem]">
    <div>settings</div>
    <div>categries</div>
    <table>
      <tbody>
        <tr v-for="player in myStore.lobby.players" :key="player.id" class="flex items-center">
          <td><img src="icons/Admin.svg" class="w-8"/></td>
          <td class="name-data" colspan="2">{{ player.name }}</td>
          <td><button class="kick-button" @click="kick(player.id)">Kick</button></td>
        </tr>
      </tbody>
    </table>
    <!-- <div
      class="bord mx-auto mt-[-12%] hidden h-10 w-[40vw] rounded-full border-2 border-white md:block"
    >
      <label class="text-l mt-[5px] pl-6 text-start text-white" id="link">
        {{ myStore.lobby.url }}
      </label>
      <div class="flex justify-end">
        <button
          @click="copyContent()"
          class="copy absolute mt-[-30px] h-[39px] w-[9.2vw] rounded-full border-2 border-white text-sm"
        >
          Copy Link
        </button>
      </div>

      <div class="notification-box" id="notification-box">Link copied!</div>
    </div> 
    <div
      class="bord mx-auto mt-[-12%] block h-10 w-[90vw] rounded-full border-2 border-white md:hidden"
    >
      <label class="text-l mt-[5px] pl-6 text-start text-white" id="link">
        {{ myStore.lobby.url }}
      </label>
      <div class="flex justify-end">
        <button
          @click="copyContent()"
          class="copy absolute mt-[-30px] h-[39px] w-[10vw] rounded-full border-2 border-white text-sm"
        >
          <img src="../../src/assets/images/copy.png" class="mx-auto w-7" alt="" />
        </button>
      </div>

      <div class="notification-box" id="notification-box">Link copied!</div>
    </div> -->
    <div class="flex justify-between">
      <button @click="leaving()">Leave the Lobby</button>
      <button>Invite Players</button>
      <button @click="startTheGame()">Start the Game</button>
    </div>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';

console.log('Step 2');

const myStore = mainStore();

const router = useRouter();

const copyContent = async () => {
  let text = document.getElementById('link').innerText;
  try {
    await navigator.clipboard.writeText(text);
    showNotification();
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const showNotification = () => {
  const notificationBox = document.getElementById('notification-box');
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 2000);
};

const leaving = () => {
  myStore.socket.emit('Im leaving, remove the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const startTheGame = () => {
  myStore.socket.emit('start the game', myStore.lobby.url);
};

myStore.socket.on('navigate to letter', (paramLetter) => {
  myStore.letter = paramLetter;
  router.replace('/letter');
});

const kick = (playerId) => {
  myStore.socket.emit('kick the player', myStore.lobby.url, playerId);
};
</script>

<style scoped>
button {
  padding: 15px 30px;
}

.kick-button {
  padding: 10px 45px;
}

table{
  border-collapse: collapse;
  width: 100%;
}
tr{
  border-bottom: 3px solid #eaeaea;
}
td{
  width: 20%;
  padding: 10px;
  padding-left: 2rem;
}

.name-data{
  width: 60%;
  text-align: left;
}
</style>
