<template>
  <main class="mt-[10rem] flex flex-col items-center md:mt-0">
    <p>Round {{ myStore.lobby.rounds.length }}</p>
    <p class="letter">{{ myStore.lobby.rounds[myStore.lobby.rounds.length - 1] }}</p>
    <table>
      <tbody>
        <tr v-for="player in ranks" :key="player.id" class="flex items-center justify-between">
          <td>{{ ranks.indexOf(player) + 1 }}</td>
          <td class="name-data" colspan="2">{{ player.name }}</td>
          <td>{{ player.playerPoints }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';

const myStore = mainStore();

const router = useRouter();

myStore.updateRanks();
const ranks = myStore.ranks.slice(0, 3);

setTimeout(() => {
  router.push('/game');
}, 5000);
</script>

<style scoped>
.letter {
  font-size: 20rem;
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

@media only screen and (max-width: 768px) {
  .letter {
    font-size: 17rem;
  }

  table {
    width: 80%;
  }
}
</style>
