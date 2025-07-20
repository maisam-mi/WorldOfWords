<template>
  <div class="outer-box grid h-[100vh] items-center justify-center">
    <div class="mx-auto h-[45%]"></div>
    <h1 class="block text-3xl md:hidden">Ergebnisse</h1>

    <div
      class="space-between mx-auto hidden grid-flow-col items-end justify-end gap-12 text-xl md:flex"
    >
      <div v-if="myStore.lobby.result.length > 1"  class="h-[10vh] text-center">
        <img src="../assets/images/Num2.svg" class="row-start-2" alt="" />

        <p class="text-[#A1A1A1]" style="text-align: center">{{ myStore.lobby.result[1].name }}</p>
        <label class="text-white"
          >Punkte:
          {{ myStore.lobby.result[1].points }}
        </label>
      </div>
      <div class="text-center">
        <img src="../assets/images/Num1.svg" class="row-end-3" alt="" />

        <p class="text-[#B19467]" style="text-align: center">
          {{ myStore.lobby.result[0].name }}
        </p>
        <label class="text-white">Punkte: {{ myStore.lobby.result[0].points }}</label>
      </div>
      <div v-if="myStore.lobby.result.length > 2"  class="h-[10vh] text-center">
        <img src="../assets/images/Num3.svg" class="row-start-2" alt="" />
        <p class="text-[#8B6222]" style="text-align: center">
          {{ myStore.lobby.result[2].name }}
        </p>
        <label class="text-white">Punkte: {{ myStore.lobby.result[2].points }}</label>
      </div>
    </div>

    <div
      class="space-between mx-auto grid-flow-col flex-col items-end justify-end text-2xl md:hidden"
    >
      <div class="mb-8 flex items-center gap-4">
        <img src="../assets/images/Num1.svg" class="w-32" alt="" />
        <div class="flex-row">
          <p class="text-[#B19467]" style="text-align: center">
            {{ myStore.lobby.result[0].name }}
          </p>
          <label class="text-white">Punkte: {{ myStore.lobby.result[0].points }}</label>
        </div>
      </div>

      <div v-if="myStore.lobby.result.length > 1" class="my-8 flex items-center gap-4">
        <img src="../assets/images/Num2.svg" class="w-32" alt="" />
        <div class="flex-row">
          <p class="text-[#A1A1A1]" style="text-align: center">
            {{ myStore.lobby.result[1].name }}
          </p>
          <label class="text-white">Punkte: {{ myStore.lobby.result[1].points }}</label>
        </div>
      </div>

      <div v-if="myStore.lobby.result.length > 2" class="my-8 flex items-center gap-4">
        <img src="../assets/images/Num3.svg" class="w-32" alt="" />
        <div class="flex-row">
          <p class="text-[#8B6222]" style="text-align: center">
            {{ myStore.lobby.result[2].name }}
          </p>
          <label class="text-white">Punkte: {{ myStore.lobby.result[2].points }}</label>
        </div>
      </div>
    </div>

    <div class="image-container flex items-center justify-center" @click="restartGame()">
      <img src="../assets/images/RestartButton.svg" alt="" class="normal-image" />
      <img src="../assets/images/RestartButton2.svg" alt="" class="hover-image" />
    </div>

    <div></div>
  </div>
</template>
<script setup>
import useDefaultStore from '@/stores/defaultStore.js';

const myStore = useDefaultStore();

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
@media (max-width: 640px) {
  .outer-box {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/Background.webp');
    background-repeat: repeat;
    background-size: cover;
    background-position: center;
  }
}

@media (min-width: 641px) {
  .outer-box {
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url('../assets/images/Result.webp');
    background-repeat: repeat;
    background-size: cover;
    background-position: center;
  }
}
h1 {
  font-size: xx-large;
  color: #d8b37c;
  margin: auto;
}

.image-container {
  position: relative;
}

.normal-image,
.hover-image {
  position: absolute;
  transition: opacity 0.3s ease-in-out;
}

.hover-image {
  opacity: 0;
}

.image-container:hover .normal-image {
  opacity: 0;
}

.image-container:hover .hover-image {
  opacity: 1;
}
</style>
