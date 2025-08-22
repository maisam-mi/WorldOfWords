<template>
  <main class="flex flex-col items-center gap-5">
    <div class="flex gap-10 mt-10">
      <p>A</p>
      <p>01:10</p>
    </div>
    <div class="flex flex-col gap-5">
      <input
        v-for="category in categories"
        :key="category"
        type="text"
        :name="category"
        :placeholder="category"
      />
    </div>
    <button @click="leaving()">Leave the Lobby</button>
  </main>
</template>
<script setup>
import mainStore from '@/stores/store.js';
import CountdownComp from '../components/CountdownComp.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

console.log('Step 4');

const myStore = mainStore();

const categories = ['Name', 'Animal', 'Country', 'Food'];

const router = useRouter();

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const labels = ref([
  {
    category: 'Land',
    label: '',
    points: 0,
  },
  {
    category: 'Tier',
    label: '',
    points: 0,
  },
  {
    category: 'Fluss',
    label: '',
    points: 0,
  },
  {
    category: 'Name',
    label: '',
    points: 0,
  },
  {
    category: 'Arbeit',
    label: '',
    points: 0,
  },
]);

// the time comes from myStore.lobby.timelimit
// setTimeout(() => {
//   myStore.wordlist = { userid: myStore.socket.id, labels: labels.value };
//   myStore.socket.emit('take my words for this round!', myStore.lobby.url, myStore.wordlist);
//   router.push('/result');
// }, 20000);

myStore.updateLobby();
</script>

<style scoped>
button {
  padding: 15px 30px;
  margin-top: 3rem;
}

p{
  font-size: 2rem;
  padding: 0rem 2.5rem;
}
</style>
