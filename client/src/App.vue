<template>
  <div class="mx-[20rem] mt-[15rem]">
    <RouterView />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router';
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

button {
  background: transparent;
  border: 2px solid #eaeaea;
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
</style>
