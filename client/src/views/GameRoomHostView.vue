<template>
  <main class="flex flex-col gap-[4rem]">
    <div class="flex justify-evenly">
      <div>
        <p>Timelimit</p>
        <div class="mt-2 flex gap-3">
          <img src="icons/counter.svg" alt="decrease button" class="w-4 rotate-180" />
          <p>01:05</p>
          <img src="icons/counter.svg" alt="increase button" class="w-4" />
        </div>
      </div>
      <div>
        <p>Rounds</p>
        <div class="mt-2 flex gap-3">
          <img src="icons/counter.svg" alt="decrease button" class="w-4 rotate-180" />
          <p>5</p>
          <img src="icons/counter.svg" alt="increase button" class="w-4" />
        </div>
      </div>
      <div>
        <p>Who checks the words?</p>
        <div class="mt-2 flex justify-evenly gap-3">
          <img src="icons/players.svg" alt="players button" class="w-8" />
          <img src="icons/artificial_intelligence.svg" alt="ai button" class="w-8" />
        </div>
      </div>
    </div>
    <div class="text-left">
      <p>Categories:</p>
      <form class="mt-2 flex gap-4">
        <div>
          <input type="checkbox" id="name" name="name" value="Name" />
          <label for="name">Name</label>
        </div>
        <div>
          <input type="checkbox" id="city" name="city" value="City" />
          <label for="city">City</label>
        </div>
        <div>
          <input type="checkbox" id="food" name="food" value="Food" />
          <label for="food">Food</label>
        </div>
        <div>
          <input type="checkbox" id="sport" name="sport" value="Sport" />
          <label for="sport">Sport</label>
        </div>
      </form>
    </div>
    <table>
      <tbody>
        <tr v-for="player in myStore.lobby.players" :key="player.id" class="flex items-center">
          <td><img v-show="player.isAdmin" src="icons/Admin.svg" alt="admin" class="w-8" /></td>
          <td class="name-data" colspan="2">{{ player.name }}</td>
          <td><button v-show="!player.isAdmin" class="kick-button" @click="kick(player.id)">Kick</button></td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-between">
      <button @click="leaving()">Leave the Lobby</button>
      <button @click="copyContent()">Invite Players</button>
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
  let url = myStore.lobby.url;
  try {
    await navigator.clipboard.writeText(url);
    window.alert('The url is copied!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const startTheGame = () => {
  myStore.socket.emit('start the game', myStore.lobby.url);
};

myStore.socket.on('navigate to letter', () => {
  router.replace('/letter');
});

const kick = (playerId) => {
  myStore.socket.emit('remove the player from lobby', myStore.lobby.url, playerId);
};

</script>

<style scoped>
button {
  padding: 15px 30px;
}

[type='checkbox'] {
  opacity: 0;
}
[type='checkbox'] + label {
  padding-left: 25px;
  cursor: pointer;
  position: relative;
}
[type='checkbox'] + label::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 0px;
  width: 18px;
  height: 18px;
  outline: 2px solid #EAEAEA;
  background: none;
}
[type='checkbox']:checked + label::after {
content: '';
  position: absolute;
  left: 0px;
  top: 0px;
  width: 18px;
  height: 18px;
  background-image: url(icons/check_mark.svg);
  background-size: contain;
}

table {
  border-collapse: collapse;
  width: 100%;
}
tr {
  border-bottom: 3px solid #eaeaea;
}
td {
  width: 20%;
  padding: 10px;
  padding-left: 2rem;
}
.kick-button {
  padding: 10px 45px;
}

.name-data {
  width: 60%;
  text-align: left;
}
</style>
