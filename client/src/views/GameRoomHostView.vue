<template>
  <main class="flex flex-col gap-[4rem]">
    <div class="flex justify-evenly">
      <div>
        <p>Timelimit</p>
        <div class="mt-2 flex gap-3">
          <img
            src="/icons/counter.svg"
            alt="decrease button"
            class="w-4 rotate-180"
            @click="decreaseTimeLimit()"
          />
          <p>{{ formatedTimeLimit }}</p>
          <img
            src="/icons/counter.svg"
            alt="increase button"
            class="w-4"
            @click="increaseTimeLimit()"
          />
        </div>
      </div>
      <div>
        <p>Rounds</p>
        <div class="mt-2 flex gap-3">
          <img
            src="/icons/counter.svg"
            alt="decrease button"
            class="w-4 rotate-180"
            @click="decreaseCountOfRounds()"
          />
          <p>{{ myStore.lobby.countOfRounds }}</p>
          <img
            src="/icons/counter.svg"
            alt="increase button"
            class="w-4"
            @click="increaseCountOfRounds()"
          />
        </div>
      </div>
      <!-- <div>
        <p>Who checks the words?</p>
        <div class="mt-2 flex justify-evenly gap-3">
          <img src="/icons/players.svg" alt="players button" class="w-8" />
          <img src="/icons/artificial_intelligence.svg" alt="ai button" class="w-8" />
        </div>
      </div> -->
    </div>
    <div class="text-left">
      <p>Categories:</p>
      <form class="mt-2 flex gap-4">
        <div v-for="category in myStore.categories" :key="category">
          <input
            type="checkbox"
            :id="category"
            :name="category"
            :value="category"
            v-model="choosedCategories"
          />
          <label :for="category">{{ category }}</label>
        </div>
      </form>
    </div>
    <table>
      <tbody>
        <TransitionGroup name="table">
          <tr v-for="player in myStore.lobby.players" :key="player.id" class="flex items-center">
            <td><img v-show="player.isAdmin" src="/icons/Admin.svg" alt="admin" class="w-8" /></td>
            <td class="name-data" colspan="2">{{ player.name }}</td>
            <td>
              <button v-show="!player.isAdmin" class="kick-button" @click="kick(player.id)">
                Kick
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </tbody>
    </table>
    <div class="flex justify-between">
      <button @click="leaving()">Leave the Lobby</button>
      <button @click="copyContent()">Invite Players</button>
      <button @click="startTheGame()">Start the Game</button>
    </div>
  </main>
</template>

<script setup>
import mainStore from '@/stores/store.js';
import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';

const myStore = mainStore();

const router = useRouter();

// to convert the milliseconds to "min:sec" format
const formatedTimeLimit = computed(() => {
  let formatedTimeLimit = null;

  formatedTimeLimit = myStore.lobby.timelimit / 1000;
  let minutes = Math.floor(formatedTimeLimit / 60);
  if (minutes < 10) minutes = '0' + minutes;
  let seconds = formatedTimeLimit % 60;
  if (seconds < 10) seconds = '0' + seconds;
  formatedTimeLimit = minutes + ':' + seconds;

  return formatedTimeLimit;
});

const decreaseTimeLimit = () => {
  if (myStore.lobby.timelimit - 1000 >= 10000)
    myStore.socket.emit(
      'change the amount of timelimit',
      myStore.lobby.url,
      myStore.lobby.timelimit - 1000,
    );
  else {
    window.alert('The amount of timelimit is less than the minimum!');
  }
};
const increaseTimeLimit = () => {
  myStore.socket.emit(
    'change the amount of timelimit',
    myStore.lobby.url,
    myStore.lobby.timelimit + 1000,
  );
};

const decreaseCountOfRounds = () => {
  if (myStore.lobby.countOfRounds - 1 >= 1)
    myStore.socket.emit(
      'change the amount of rounds',
      myStore.lobby.url,
      myStore.lobby.countOfRounds - 1,
    );
  else {
    window.alert('The amount of rounds is less than the minimum!');
  }
};
const increaseCountOfRounds = () => {
  if (myStore.lobby.countOfRounds + 1 <= 26) {
    myStore.socket.emit(
      'change the amount of rounds',
      myStore.lobby.url,
      myStore.lobby.countOfRounds + 1,
    );
  } else {
    window.alert('The amount of rounds is more than the amount of letters!');
  }
};

const choosedCategories = ref(['Name', 'Animal']);
watch(choosedCategories, () => {
  myStore.socket.emit(
    'change the amount of choosenCategories',
    myStore.lobby.url,
    choosedCategories.value,
  );
});

const copyContent = async () => {
  let url = myStore.lobby.url;
  try {
    await navigator.clipboard.writeText(url);
    window.alert('The url is copied!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const leaving = () => {
  myStore.socket.emit('im leaving the lobby', myStore.lobby.url);
  myStore.clearStore();
  window.location = 'http://localhost:8080/';
};

const startTheGame = () => {
  if (myStore.lobby.categories.length >= 1) {
    myStore.updateInputs();
    myStore.socket.emit('start the game', myStore.lobby.url);
  } else {
    window.alert('You have to choose at least one category!');
  }
};

myStore.socket.on('amount of rounds N/A', (moreOrLess) => {
  if (moreOrLess) window.alert('The amount of rounds is more than the amount of letters!');
  else window.alert('The amount of rounds is less than the minimum!');
});

myStore.socket.on('amount of timelimit N/A', () => {
  window.alert('The amount of timelimit is less than the minimum!');
});

myStore.socket.on('navigate to letter', () => {
  router.replace('/letter');
});

const kick = (playerId) => {
  myStore.socket.emit('remove the player from lobby', myStore.lobby.url, playerId);
};
</script>

<style scoped>
button {
  padding: 15px 30px;
}

[type='checkbox'] {
  opacity: 0;
}
[type='checkbox'] + label {
  padding-left: 25px;
  cursor: pointer;
  position: relative;
}
[type='checkbox'] + label::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 0px;
  width: 18px;
  height: 18px;
  outline: 2px solid #eaeaea;
  background: none;
}
[type='checkbox']:checked + label::after {
  content: '';
  position: absolute;
  left: 0px;
  top: 0px;
  width: 18px;
  height: 18px;
  background-image: url(icons/check_mark.svg);
  background-size: contain;
}

table {
  border-collapse: collapse;
  width: 100%;
}
tr {
  border-bottom: 3px solid #eaeaea;
}
td {
  width: 20%;
  padding: 10px;
  padding-left: 2rem;
}
.kick-button {
  padding: 10px 45px;
}
.table-enter-active,
.table-leave-active {
  transition: all 0.5s ease;
}
.table-enter-from,
.table-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.name-data {
  width: 60%;
  text-align: left;
}
</style>
