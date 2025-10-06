<template>
  <main class="flex flex-col items-center gap-5">
    <div class="mt-10 flex gap-10">
      <p>{{ myStore.lobby.rounds[myStore.lobby.rounds.length - 1] }}</p>
      <p>{{ formatedTimeLimit }}</p>
    </div>
    <div class="flex flex-col gap-5">
      <input
        v-for="input in myStore.inputWords"
        :key="input"
        type="text"
        :name="input.category"
        :placeholder="input.category"
        v-model="input.label"
      />
    </div>
    <button @click="leaving()">Leave the Lobby</button>
  </main>
</template>
<script setup>
import mainStore from '@/stores/store.js';
import CountdownComp from '../components/CountdownComp.vue';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const myStore = mainStore();

const router = useRouter();

const remainingtime = ref(myStore.lobby.timelimit);
setInterval(() => {
  remainingtime.value -= 1000;
  if (remainingtime.value < 0) {
    clearInterval(interval);
  }
}, 1000);
const formatedTimeLimit = computed(() => {
  let formatedTimeLimit = null;

  formatedTimeLimit = remainingtime.value / 1000;
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

myStore.socket.on('the lobby is not found', () => {
  myStore.clearStore();
  window.alert('The lobby dosnt exist, you can enter a existed lobby.');
  window.location = 'http://localhost:8080/';
});

myStore.socket.on('you are not a player of this lobby', () => {
  myStore.clearStore();
  window.alert(
    'You are not a player of this lobby, so we lead you to startpage, so you can enter a lobby.',
  );
  window.location = 'http://localhost:8080/';
});

setTimeout(() => {
  myStore.socket.emit(
    'take my words for this round',
    myStore.lobby.url,
    myStore.lobby.rounds[myStore.lobby.rounds.length - 1],
    myStore.inputWords,
  );
  myStore.clearInputs();
  myStore.socket.emit('should I go to check or review', myStore.lobby.url);
}, myStore.lobby.timelimit);

// here admin has to go to checkviewHostview and player to chekcviewplayerview.
myStore.socket.on('you go to check', () => {
  router.push('/check');
});
myStore.socket.on('you go to review', () => {
  router.push('/review');
});
</script>
<style scoped>
button {
  padding: 15px 30px;
  margin-top: 3rem;
}

p {
  font-size: 2rem;
  padding: 0rem 2.5rem;
}
</style>
