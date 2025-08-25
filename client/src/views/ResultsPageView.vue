<template>
  <main class="flex flex-col gap-[6rem]">
    <div>
      <div class="flex justify-center gap-[5rem]">
        <div class="mt-20">
          <p class="rank">2</p>
          <p>Rana 30 points</p>
        </div>
        <div>
          <p class="rank">1</p>
          <p>Maisam 50 points</p>
        </div>

        <div class="mt-40">
          <p class="rank">3</p>
          <p>Anar 20 points</p>
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="leaving()">Leave the Lobby</button>
        <button @click="changeResult()">Result List</button>
        <button @click="backToLobby()">Back to the Lobby</button>
      </div>
    </div>
    <div>
      <p>Result List</p>
      <table>
        <tbody>
          <tr v-for="player in bests" :key="player.id" class="flex items-center justify-between">
            <td>{{ bests.indexOf(player) + 1 }}</td>
            <td class="name-data" colspan="2">{{ player.name }}</td>
            <td>{{ player.playerPoints }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="changeResult()">Back to Result</button>
    </div>
  </main>
</template>
<script setup>
import mainStore from '@/stores/store.js';

const myStore = mainStore();

console.log('Step 5');

const restartGame = () => {
  if (myStore.socket.id === myStore.lobby.admin.id) {
    myStore.socket.emit('Im leaving, remove the lobby', myStore.lobby.url);
    myStore.clearStore();
    window.location = 'http://localhost:8080/';
  } else {
    myStore.socket.emit('Im leaving, overwrite the lobby', myStore.lobby.url);
    myStore.clearStore();
    window.location = 'http://localhost:8080/';
  }
};

myStore.socket.on('the lobby is removed', (message) => {
  myStore.clearStore();
  console.log(message);
  window.location = 'http://localhost:8080/';
});
</script>

<style scoped>
button {
  padding: 15px 30px;
}

.rank {
  font-size: 8rem;
}
</style>
