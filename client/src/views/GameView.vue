<template>
  <div class="outer-box grid h-full items-center justify-center py-3">
    <CountdownComp />
    <div class="flex h-[60vh] w-[85vw] justify-center">
      <div class="flex h-[100%] w-[75%] flex-col justify-start text-lg">
        <h2 class="mx-2 text-white">Land</h2>
        <input
          v-model="labels[0].label"
          type="text"
          class="bg-transparent m-2 mb-4 h-20 rounded-md pl-2 text-white"
          :style="{ border: '2px solid white' }"
          :placeholder="letterPH"
        />
        <h2 class="mx-2 text-white">Tier</h2>
        <input
          v-model="labels[1].label"
          type="text"
          class="bg-transparent m-2 mb-4 rounded-md pl-2 text-white"
          :style="{ border: '2px solid white' }"
          :placeholder="letterPH"
        />
        <h2 class="mx-2 text-white">Fluss</h2>
        <input
          v-model="labels[2].label"
          type="text"
          class="bg-transparent m-2 mb-4 h-10 rounded-md pl-2 text-white"
          :style="{ border: '2px solid white' }"
          :placeholder="letterPH"
        />
        <h2 class="mx-2 text-white">Name</h2>
        <input
          v-model="labels[3].label"
          type="text"
          class="bg-transparent m-2 mb-4 h-10 rounded-md pl-2 text-white"
          :style="{ border: '2px solid white' }"
          :placeholder="letterPH"
        />
        <h2 class="mx-2 text-white">Arbeit</h2>
        <input
          v-model="labels[4].label"
          type="text"
          class="bg-transparent m-2 mb-3 h-10 rounded-md pl-2 text-white"
          :style="{ border: '2px solid white' }"
          :placeholder="letterPH"
        />
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>
<script setup>
import useDefaultStore from '@/stores/defaultStore.js';
import CountdownComp from '../components/CountdownComp.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

console.log('Step 4');

const myStore = useDefaultStore();

const router = useRouter();

const letterPH = myStore.letter + '..';

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

setTimeout(() => {
  myStore.wordlist = { userid: myStore.socket.id, labels: labels.value };
  myStore.socket.emit('take my words for this round!', myStore.lobby.url, myStore.wordlist);
  router.push('/result');
}, 20000);
</script>

<style scoped>
input {
  height: 20vh;
}

input:focus-visible {
  outline: none;
}

@media (max-width: 640px) {
  .outer-box {
    display: grid;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/BackgroundGameRoom.webp');
    background-repeat: repeat;
    background-size: cover;
    background-position: left;
  }
}

@media (min-width: 641px) {
  .outer-box {
    display: grid;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/BackgroundLetterGenerator.webp');
    background-repeat: repeat;
    background-size: cover;
    background-position: center;
  }
}
</style>
