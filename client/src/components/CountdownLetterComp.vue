<template>
  <div class="countdown">
    <div class="bloc-time sec" :data-init-value="totalSeconds">
      <div class="figure sec sec-1">
        <span class="top">{{ seconds[0] }}</span>
        <span class="top-back">
          <span>{{ seconds[0] }}</span>
        </span>
        <span class="bottom">{{ seconds[0] }}</span>
        <span class="bottom-back">
          <span>{{ seconds[0] }}</span>
        </span>
      </div>
      <div class="figure sec sec-2">
        <span class="top">{{ seconds[1] }}</span>
        <span class="top-back">
          <span>{{ seconds[1] }}</span>
        </span>
        <span class="bottom">{{ seconds[1] }}</span>
        <span class="bottom-back">
          <span>{{ seconds[1] }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<!-- No Animation -->
<!-- <script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { TweenMax, Quart } from "gsap";

const totalSeconds = ref(60);
const seconds = ref(["6", "0"]);
let countdownInterval = null;

const count = () => {
  countdownInterval = setInterval(() => {
    if (totalSeconds.value > 0) {
      let sec = parseInt(seconds.value.join(""));
      sec--;

      if (sec < 0) {
        sec = 59;
      }

      seconds.value = sec.toString().padStart(2, "0").split("");

      totalSeconds.value--;
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

onMounted(count);
onBeforeUnmount(() => {
  clearInterval(countdownInterval);
});
</script> -->

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { TweenMax, Quart } from "gsap";

const totalSeconds = ref(5);
const seconds = ref(["0", "5"]);
let countdownInterval = null;

const animateFigure = (el, value) => {
  const $top = el.querySelector(".top");
  const $bottom = el.querySelector(".bottom");
  const $backTop = el.querySelector(".top-back");
  const $backBottom = el.querySelector(".bottom-back");

  $backTop.querySelector("span").innerHTML = value;
  $backBottom.querySelector("span").innerHTML = value;

  TweenMax.to($top, 0.8, {
    rotationX: "-180deg",
    transformPerspective: 300,
    ease: Quart.easeOut,
    onComplete: function () {
      $top.innerHTML = value;
      $bottom.innerHTML = value;
      TweenMax.set($top, { rotationX: 0 });
    },
  });

  TweenMax.to($backTop, 0.8, {
    rotationX: 0,
    transformPerspective: 300,
    ease: Quart.easeOut,
    clearProps: "all",
  });
};

const count = () => {
  countdownInterval = setInterval(() => {
    if (totalSeconds.value > 0) {
      let sec = parseInt(seconds.value.join(""));
      sec--;

      if (sec < 0) {
        sec = 2;
      }

      const newSeconds = sec.toString().padStart(2, "0").split("");
      const sec1El = document.querySelector(".sec-1");
      const sec2El = document.querySelector(".sec-2");

      if (seconds.value[0] !== newSeconds[0]) {
        animateFigure(sec1El, newSeconds[0]);
      }

      if (seconds.value[1] !== newSeconds[1]) {
        animateFigure(sec2El, newSeconds[1]);
      }

      seconds.value = newSeconds;

      totalSeconds.value--;
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

onMounted(count);
onBeforeUnmount(() => {
  clearInterval(countdownInterval);
});
</script>

<style scoped>
.countdown {
  margin: auto;
}
.countdown .bloc-time {
  float: left;
  margin-right: 45px;
  text-align: center;
}
.countdown .bloc-time:last-child {
  margin-right: 0;
}
.countdown .count-title {
  display: block;
  margin-bottom: 15px;
  font: normal 0.94em "Lato";
  color: #1a1a1a;
  text-transform: uppercase;
}
.countdown .figure {
  position: relative;
  float: left;
  height: 80px;
  width: 70px;
  margin-right: 10px;
  margin-bottom: 20px; /* Add vertical margin to the countdown figures */
  background-color: #ce9a53;
  border-radius: 8px;
  -moz-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), inset 2px 4px 0 0 rgba(255, 255, 255, 0.08);
  -webkit-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), inset 2px 4px 0 0 rgba(255, 255, 255, 0.08);
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.2), inset 2px 4px 0 0 rgba(255, 255, 255, 0.08);
}
.countdown .figure:last-child {
  margin-right: 0;
  margin-bottom: 0; /* Remove margin for the last countdown figure */
}
.countdown .figure > span {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  /* font: normal 5.94em/107px "Lato"; */
  font: normal 4em "Lato";
  font-weight: 700;
  color: white;
}
.countdown .figure .top:after,
.countdown .figure .bottom-back:after {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.countdown .figure .top {
  z-index: 3;
  background-color: #ce9a53;
  transform-origin: 50% 100%;
  -webkit-transform-origin: 50% 100%;
  -moz-border-radius-topleft: 10px;
  -webkit-border-top-left-radius: 10px;
  border-top-left-radius: 10px;
  -moz-border-radius-topright: 10px;
  -webkit-border-top-right-radius: 10px;
  border-top-right-radius: 10px;
  -moz-transform: perspective(200px);
  -ms-transform: perspective(200px);
  -webkit-transform: perspective(200px);
  transform: perspective(200px);
}
.countdown .figure .bottom {
  z-index: 1;
}
.countdown .figure .bottom:before {
  content: "";
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.02);
}
.countdown .figure .bottom-back {
  z-index: 2;
  top: 0;
  height: 50%;
  overflow: hidden;
  background-color: #ce9a53;
  -moz-border-radius-topleft: 10px;
  -webkit-border-top-left-radius: 10px;
  border-top-left-radius: 10px;
  -moz-border-radius-topright: 10px;
  -webkit-border-top-right-radius: 10px;
  border-top-right-radius: 10px;
}
.countdown .figure .bottom-back span {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.countdown .figure .top,
.countdown .figure .top-back {
  height: 50%;
  overflow: hidden;
  -moz-backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.countdown .figure .top-back {
  z-index: 4;
  bottom: 0;
  background-color: #ce9a53;
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  -moz-transform: perspective(200px) rotateX(180deg);
  -ms-transform: perspective(200px) rotateX(180deg);
  -webkit-transform: perspective(200px) rotateX(180deg);
  transform: perspective(200px) rotateX(180deg);
  -moz-border-radius-bottomleft: 10px;
  -webkit-border-bottom-left-radius: 10px;
  border-bottom-left-radius: 10px;
  -moz-border-radius-bottomright: 10px;
  -webkit-border-bottom-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.countdown .figure .top-back span {
  position: absolute;
  top: -100%;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
