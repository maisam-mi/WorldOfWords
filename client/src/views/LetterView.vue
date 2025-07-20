<template>
  <div class="outer-box bg-cover bg-center">
    <CountdownLetterComp />
    <div class="mt-5"><img :src="`/letters/${myStore.letter}.svg`" alt="" /></div>
    <div></div>
    <div></div>

    <div></div>
  </div>
</template>

<script setup>
import useDefaultStore from '@/stores/defaultStore.js';
import { useRouter } from 'vue-router';
import CountdownLetterComp from '../components/CountdownLetterComp.vue';

console.log('Step 3');

const myStore = useDefaultStore();

const router = useRouter();


setTimeout(() => {
  router.push('/game');
}, 5000);
</script>

<style scoped>
@media (max-width: 640px) {
  .outer-box {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/MBackground.webp');
    background-repeat: repeat;
  }
}

@media (min-width: 641px) {
  .outer-box {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/BackgroundLetterGenerator.webp');
    background-repeat: repeat;
  }
}

.lobby {
  background: rgb(53, 53, 53);
  opacity: 60%;
  height: 50vh;
  width: 50vw;
  margin: auto;
  padding: 5%;
  border-radius: 4em 4em 4em 4em;
}

h1 {
  font-size: xx-large;
  color: #707070;
  margin: auto;
}
</style>
