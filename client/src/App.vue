<template>
  <div class="mx-[2rem] md:mx-[10rem] xl:mx-[20rem] md:mt-[15rem]">
    <Transition>
      <RouterView />
    </Transition>
  </div>
</template>
<script setup>
import mainStore from '@/stores/store.js';
import { RouterView } from 'vue-router';

const store = mainStore();

store.updateLobby();
</script>
<style>
/* font Mua */
@font-face {
  font-family: 'Mua';
  src: url(/font/Jua-Regular.woff2) format('woff2');
  font-weight: normal;
  font-style: normal;
}

div {
  font-family: 'Mua';
  font-weight: normal;
  text-align: center;
  scrollbar-width: none;
  color: #eaeaea;
  font-size: 15pt;
}

img {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Standard syntax */
}

button {
  background: transparent;
  border: 2px solid #eaeaea;
}
button:hover {
  background: #eaeaea;
  border: 2px solid #eaeaea;
  color: #333333;
}

input {
  background: transparent;
  border: none;
  border-bottom: 2px solid #eaeaea;
}
input[type='text'] {
  padding: 0px 5px;
}
input:focus {
  outline: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media only screen and (max-width: 768px) {
  button, input {
    width: 90%;
  }
}
</style>
