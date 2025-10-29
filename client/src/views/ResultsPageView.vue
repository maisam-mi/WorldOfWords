<template>
  <main>
    <div v-if="!showWholeResult" class="flex flex-col gap-[6rem]">
      <div class="flex justify-center gap-[5rem]">
        <div v-if="myStore.ranks[1] != null" class="place secondPlace mt-20">
          <p class="rank">2</p>
          <p>{{ myStore.ranks[1].name }} {{ myStore.ranks[1].playerPoints }} points</p>
        </div>
        <div class="place firstPlace">
          <p class="rank">1</p>
          <p>{{ myStore.ranks[0].name }} {{ myStore.ranks[0].playerPoints }} points</p>
        </div>

        <div v-if="myStore.ranks[2] != null" class="place thirdPlace mt-40">
          <p class="rank">3</p>
          <p>{{ myStore.ranks[2].name }} {{ myStore.ranks[2].playerPoints }} points</p>
        </div>
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row md:gap-0">
        <button class="self-center" @click="leaving()">Leave the Lobby</button>
        <button class="self-center" @click="showWholeResult = !showWholeResult">Result List</button>
        <button class="self-center" @click="backToLobby()">Back to the Lobby</button>
      </div>
    </div>
    <div v-else class="flex flex-col items-center gap-[6rem]">
      <p>Result List</p>
      <table>
        <tbody>
          <tr
            v-for="player in myStore.ranks"
            :key="player"
            class="flex items-center justify-between"
          >
            <td>{{ myStore.ranks.indexOf(player) + 1 }}</td>
            <td class="name-data" colspan="2">{{ player.name }}</td>
            <td>{{ player.playerPoints }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="showWholeResult = !showWholeResult">Back to Result</button>
    </div>
  </main>
</template>
<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const myStore = mainStore();
const router = useRouter();

myStore.updateRanks();

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const backToLobby = () => {
  myStore.socket.emit('go back to lobbyroom', myStore.lobby.url);
};

myStore.socket.on('admin go to gameroomhost', () => {
  router.push(`/gameroomhost`);
});

myStore.socket.on('player go to gameroomplayer', () => {
  router.push(`/gameroomplayer`);
});

const showWholeResult = ref(false);

myStore.socket.on('the lobby is removed', (message) => {
  myStore.clearStore();
  console.log(message);
  window.location = 'http://localhost:8080/';
});

const ranks = [
  {
    rank: 1,
    name: 'Maisam',
    points: 50,
  },
  {
    rank: 2,
    name: 'Rana',
    points: 30,
  },
  {
    rank: 3,
    name: 'Anar',
    points: 20,
  },
  {
    rank: 4,
    name: 'Oktalon',
    points: 15,
  },
];
</script>

<style scoped>
button {
  padding: 15px 30px;
}

.place {
  opacity: 0;
  animation: appearing 1s ease forwards;
}
.firstPlace {
  animation-delay: 1s;
}
.secondPlace {
  animation-delay: 2s;
}
.thirdPlace {
  animation-delay: 3s;
}

@keyframes appearing {
  to {
    opacity: 1;
  }
}

.rank {
  font-size: 8rem;
}

table {
  border-collapse: collapse;
  width: 25%;
}
td {
  width: 25%;
  padding: 5px 0px;
}
.name-data {
  width: 40%;
  text-align: left;
}
</style>
