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
            <td class="w-14"><button class="ui-btn" @click="kick(player.id)">Kick</button></td>
          </tr>
        </tbody>
      </table>

      <table class="block md:hidden">
        <tbody>
          <tr v-for="player in myStore.lobby.players" :key="player" class="text-white">
            <td class="w-14">{{ player.name }}</td>
            <td class="w-14"><button class="ui-btn">Kick</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="bord mx-auto mt-[-12%] hidden h-10 w-[40vw] rounded-full border-2 border-white md:block"
    >
      <label class="text-l mt-[5px] pl-6 text-start text-white" id="link">
        {{ myStore.lobby.url }}
      </label>
      <div class="flex justify-end">
        <button
          @click="copyContent()"
          class="copy absolute mt-[-30px] h-[39px] w-[9.2vw] rounded-full border-2 border-white text-sm"
        >
          Copy Link
        </button>
      </div>

      <div class="notification-box" id="notification-box">Link copied!</div>
    </div>
    <div
      class="bord mx-auto mt-[-12%] block h-10 w-[90vw] rounded-full border-2 border-white md:hidden"
    >
      <label class="text-l mt-[5px] pl-6 text-start text-white" id="link">
        {{ myStore.lobby.url }}
      </label>
      <div class="flex justify-end">
        <button
          @click="copyContent()"
          class="copy absolute mt-[-30px] h-[39px] w-[10vw] rounded-full border-2 border-white text-sm"
        >
          <img src="../../src/assets/images/copy.png" class="mx-auto w-7" alt="" />
        </button>
      </div>

      <div class="notification-box" id="notification-box">Link copied!</div>
    </div>
    <div class="flex flex-wrap justify-between">
      <div class="ml-0 w-32 md:ml-[-15%] md:w-40">
        <img
          src="../assets/images/ArrowLeft.svg"
          class="hover-effect-left"
          alt=""
          @click="leaving()"
        />
      </div>
      <div class="ml-0 w-32 md:mr-[-15%] md:w-40">
        <img
          src="../assets/images/ArrowRight.svg"
          class="hover-effect-right"
          alt=""
          @click="startTheGame()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import useDefaultStore from '@/stores/defaultStore.js';
import { useRouter } from 'vue-router';

console.log('Step 2');

const myStore = useDefaultStore();

const router = useRouter();

const copyContent = async () => {
  let text = document.getElementById('link').innerText;
  try {
    await navigator.clipboard.writeText(text);
    showNotification();
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const showNotification = () => {
  const notificationBox = document.getElementById('notification-box');
  notificationBox.style.display = 'block';
  setTimeout(() => {
    notificationBox.style.display = 'none';
  }, 2000);
};

const leaving = () => {
  myStore.socket.emit('Im leaving, remove the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const startTheGame = () => {
  myStore.socket.emit('start the game', myStore.lobby.url);
};

myStore.socket.on('navigate to letter', (paramLetter) => {
  myStore.letter = paramLetter;
  router.replace('/letter');
});

const kick = (playerId) => {
  myStore.socket.emit('kick the player', myStore.lobby.url, playerId);
};
</script>

<style scoped>
.bord {
  border: solid rgb(255, 255, 255) 2px;
}

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
  transition: background-image 0.3s ease-in-out;
}

.hover-effect-left:hover {
  background-image: url('../assets/images/ArrowLeft2.svg');
}

.hover-effect-right:hover {
  background-image: url('../assets/images/ArrowRight2.svg');
}
@media (max-width: 640px) {
  .copy {
    color: white;
    background-color: white;
  }
}

@media (min-width: 641px) {
  .copy {
    color: white;
  }
}
.copy:hover {
  background-color: #ffffff;
  color: black;
  transition: background-color 3s ease-in-out;
  transition: color 1s ease-in-out;
}

.w-14 {
  width: 5%;
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.ui-btn {
  cursor: pointer;
  border-radius: 5px;
  color: rgb(219, 218, 218);
  border-style: solid;
  background-color: transparent;
  border-color: rgb(219, 218, 218);
  width: 120px;
  height: 40px;
  transition: 0.2s ease;
  text-transform: uppercase;
  border-width: 2px;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 2px;
}

.ui-btn:hover {
  color: rgb(247, 247, 247);
  background-color: rgb(202, 25, 25);
  border-color: rgb(202, 25, 25);
  text-shadow: 0 0 50px white, 0 0 20px white, 0 0 15px white;
  box-shadow: 0 0 50px rgb(202, 25, 25), 0 0 30px rgb(202, 25, 25), 0 0 60px rgb(202, 25, 25),
    0 0 120px rgb(202, 25, 25);
  font-size: 20px;
  width: 130px;
  height: 50px;
  letter-spacing: 3px;
}

.ui-btn:active {
  width: 115px;
  height: 38px;
  letter-spacing: 0px;
}
</style>
