<template>
  <main class="mt-[4rem] flex flex-col gap-[4rem] md:mt-0">
    <div class="flex flex-col justify-evenly gap-3 md:flex-row md:gap-0">
      <div class="flex justify-evenly md:flex-col">
        <p>Timelimit</p>
        <p>{{ formatedTimeLimit }}</p>
      </div>
      <div class="flex justify-evenly md:flex-col">
        <p>Rounds</p>
        <p>{{ myStore.lobby.countOfRounds }}</p>
      </div>
      <!-- <div>
        <p>Who checks the words?</p>
        <div class="mt-2 flex justify-center">
          <img src="/icons/players.svg" alt="players button" class="w-8" />
        </div>
      </div> -->
    </div>
    <div class="text-left">
      <p>Categories:</p>
      <div class="mt-2 flex flex-wrap gap-4">
        <TransitionGroup name="span">
          <span v-for="category in myStore.lobby.categories" :key="category" :for="category">{{
            category
          }}</span></TransitionGroup
        >
      </div>
    </div>
    <table>
      <tbody>
        <TransitionGroup name="table">
          <tr v-for="player in myStore.lobby.players" :key="player.id" class="flex items-center">
            <td><img v-show="player.isAdmin" src="/icons/Admin.svg" alt="admin" class="w-8" /></td>
            <td class="name-data" colspan="2">{{ player.name }}</td>
            <td></td>
          </tr>
        </TransitionGroup>
      </tbody>
    </table>
    <div class="flex flex-col justify-between gap-3 md:flex-row md:gap-0">
      <button class="self-center" @click="leaving()">Leave the Lobby</button>
      <!-- <button @click="copyContent()">Invite Players</button> -->
    </div>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const myStore = mainStore();
const router = useRouter();

const formatedTimeLimit = computed(() => {
  let formatedTimeLimit = null;

  formatedTimeLimit = myStore.lobby.timelimit / 1000;
  let minutes = Math.floor(formatedTimeLimit / 60);
  if (minutes < 10) minutes = '0' + minutes;
  let seconds = formatedTimeLimit % 60;
  if (seconds < 10) seconds = '0' + seconds;
  formatedTimeLimit = minutes + ':' + seconds;

  return formatedTimeLimit;
});

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

myStore.socket.on('navigate to letter', () => {
  router.replace('/letter');
});

myStore.socket.on('you have been kicked from lobby', () => {
  myStore.clearStore();
  console.log('You have been kicked from the lobby!');
  window.location = 'http://localhost:8080/';
});

myStore.socket.on('the lobby is removed', () => {
  myStore.clearStore();
  console.log('the lobby is removed!');
  window.location = 'http://localhost:8080/';
});

myStore.socket.on('you are not the admin of this lobby', () => {
  window.alert('you are not the admin of this lobby!');
});
</script>

<style scoped>
button {
  padding: 15px 30px;
}

.span-move,
.span-enter-active,
.span-leave-active {
  transition: all 0.5s ease;
}
.span-enter-from,
.span-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.span-leave-active {
  position: absolute;
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
.table-move,
.table-enter-active,
.table-leave-active {
  transition: all 0.5s ease;
}
.table-enter-from,
.table-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.table-leave-active {
  position: absolute;
}

.name-data {
  width: 60%;
  text-align: left;
}
</style>
