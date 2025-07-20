<template>
  <div class="outer-box bg-cover bg-center">
    <div></div>
    <div class="w-[65vw] px-6 text-xl">
      <table class="table-dark hidden h-[50vh] md:block">
        <thead>
          <tr>
            <th scope="col" class="w-14">Id</th>
            <th scope="col" class="w-14">Name</th>
            <th scope="col" class="w-14"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in myStore.lobby.players" :key="player">
            <td class="w-14">{{ player.id }}</td>
            <td class="w-14">{{ player.name }}</td>
            <td class="w-14"></td>
          </tr>
        </tbody>
      </table>

      <table class="block md:hidden">
        <tbody>
          <tr v-for="player in myStore.lobby.players" :key="player" class="text-white">
            <td class="w-14">{{ player.name }}</td>
            <td class="w-14"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div></div>
    <div class="flex flex-wrap justify-between">
      <div class="ml-0 w-32 md:ml-[-15%]">
          <img
            src="../assets/images/ArrowLeft.svg"
            class="hover-effect-left"
            alt=""
            @click="leaving()"
          />
      </div>
    </div>
  </div>
</template>

<script setup>
import useDefaultStore from '@/stores/defaultStore.js';
import { useRouter } from 'vue-router';

const myStore = useDefaultStore();
const router = useRouter();

console.log(myStore.lobby);

const leaving = () => {
  myStore.socket.emit('Im leaving, overwrite the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

myStore.socket.on('navigate to letter', (paramLetter) => {
  myStore.letter = paramLetter;
  router.replace('/letter');
});

myStore.socket.on('You habe been kicked from lobby', (message) => {
  myStore.clearStore();
  console.log(message);
  window.location = 'http://localhost:8080/';
});

myStore.socket.on('the lobby is removed', (message) => {
  myStore.clearStore();
  console.log(message);
  window.location = 'http://localhost:8080/';
});
</script>

<style scoped>
@media (max-width: 640px) {
  .outer-box {
    background-image: url('../assets/images/MBackground.webp');
    background-repeat: repeat;
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  .text-xl {
    width: 90vw; /* Adjust the width for mobile */
  }

  table {
    width: 100%; /* Make the table full width */
    table-layout: auto; /* Allow the table to resize based on content */
  }

  .w-14 {
    width: auto; /* Allow the table cells to resize based on content */
  }
}

@media (min-width: 641px) {
  .outer-box {
    background-image: url('../assets/images/BoardFrame.webp');
    background-repeat: repeat;
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
  .text-xl {
    width: 65vw; /* Existing width for larger screens */
  }

  table {
    width: 100%; /* Make the table full width */
    table-layout: fixed; /* Keep the table layout fixed on larger screens */
  }

  .w-14 {
    width: 5%; /* Existing width for larger screens */
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

.notification-box {
  display: none;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  z-index: 1000;
}

.hover-effect {
  transition: background-image 3s ease-in-out;
}

.hover-effect-left:hover {
  background-image: url('../assets/images/ArrowLeft2.svg');
}
.hover-effect-right:hover {
  background-image: url('../assets/images/ArrowRight2.svg');
}

.copy {
  color: white;
}

.copy:hover {
  background-color: #ffffff;
  color: black;
  transition: background-color 3s ease-in-out;
  transition: color 1s ease-in-out;
}
.w-14 {
  width: 5%; /* Jede Spalte nimmt 25% der Tabellenbreite ein */
  text-align: left; /* Ausrichtung des Textes in den Zellen */
  padding: 8px;
  border-bottom: 1px solid #ddd; /* Linie unter jeder Tabellenzeile */
}
</style>
