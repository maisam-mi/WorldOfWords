<template>
  <main class="flex flex-col items-center gap-5">
    <div class="mt-10 flex gap-10">
      <p>A</p>
      <p>01:10</p>
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
import { ref } from 'vue';

console.log('Step 4');

const myStore = mainStore();

const router = useRouter();

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
  myStore.socket.emit('decide my next view', myStore.lobby.url);
}, 5000);

// here admin has to go to checkviewHostview and player to chekcviewplayerview.
myStore.socket.on('you go to check', () => {
  router.push('/check');
});
myStore.socket.on('you go to review', () => {
  router.push('/review');
});

myStore.updateLobby();
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
