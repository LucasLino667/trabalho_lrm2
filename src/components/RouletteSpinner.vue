<template>
  <div class="roulette-container flex flex-center relative-position">
    <!-- Neon glowing outline -->
    <div class="roulette-frame" :class="{ 'is-spinning': spinning }">
      <!-- Horizontal / Vertical slot reel viewport -->
      <div class="reel-viewport">
        <!-- Reel inner track -->
        <div class="reel-track flex flex-center" :style="trackStyle">
          <!-- Current visible poster -->
          <div class="poster-wrapper">
            <q-img
              v-if="currentPoster"
              :src="getImageUrl(currentPoster)"
              fit="cover"
              class="roulette-poster"
              height="360px"
              width="240px"
              no-spinner
            >
              <div v-if="spinning" class="absolute-full flex flex-center blur-overlay">
                <q-spinner-oval color="accent" size="40px" />
              </div>
            </q-img>
            <div v-else class="empty-poster flex flex-center">
              <q-icon name="videogame_asset" size="64px" color="accent" />
              <div class="text-subtitle2 q-mt-md text-grey-4">Pressione Sortear!</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Arrow pointers on the sides -->
      <div class="pointer-left"></div>
      <div class="pointer-right"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  spinning: {
    type: Boolean,
    default: false,
  },
  movieList: {
    type: Array,
    required: true,
  },
  targetMovie: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['finished'])

const currentPoster = ref(null)
const rotationX = ref(0)

const getImageUrl = (path) => {
  if (!path)
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500'
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/w500${path}`
}

const trackStyle = computed(() => {
  if (!props.spinning) return {}
  return {
    transform: `rotateX(${rotationX.value}deg) scale(0.97)`,
    transition: 'transform 0.05s ease-out',
  }
})

// Sound / Vibration simulation or visual ticks
const spinTick = () => {
  rotationX.value += 360
}

let timerId = null

// Watch the spinning prop
watch(
  () => props.spinning,
  (isSpinning) => {
    if (isSpinning) {
      startSpinAnimation()
    }
  },
)

const startSpinAnimation = () => {
  if (!props.movieList.length || !props.targetMovie) {
    emit('finished')
    return
  }

  // Generate sequence of random movie posters to flash
  const totalSteps = 30 // Number of flashes before stopping
  let step = 0
  let delay = 40 // Initial delay in milliseconds

  const nextStep = () => {
    spinTick()

    if (step < totalSteps - 1) {
      // Pick a random movie from the list that is NOT the target (to build suspense)
      let randomMovie
      do {
        randomMovie = props.movieList[Math.floor(Math.random() * props.movieList.length)]
      } while (randomMovie.id === props.targetMovie.id && props.movieList.length > 1)

      currentPoster.value = randomMovie.poster_path
      step++

      // Exponential deceleration formula
      delay = delay * 1.12
      timerId = setTimeout(nextStep, delay)
    } else {
      // Final step: land on the target movie
      currentPoster.value = props.targetMovie.poster_path
      // Flashing animation trigger
      setTimeout(() => {
        emit('finished')
      }, 400)
    }
  }

  if (timerId) clearTimeout(timerId)
  nextStep()
}
</script>

<style lang="scss" scoped>
.roulette-container {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.roulette-frame {
  position: relative;
  background: rgba(25, 15, 48, 0.8);
  border: 4px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease;
  perspective: 800px;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -4px;
    border-radius: 28px;
    border: 2px solid transparent;
    background: linear-gradient(135deg, $primary, $secondary) border-box;
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &.is-spinning {
    border-color: rgba(0, 240, 255, 0.2);
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.3);

    &::before {
      opacity: 1;
      animation: spin-glow 1s infinite alternate;
    }
  }
}

@keyframes spin-glow {
  0% {
    filter: drop-shadow(0 0 2px rgba(138, 43, 226, 0.4));
  }
  100% {
    filter: drop-shadow(0 0 12px rgba(255, 20, 147, 0.8));
  }
}

.reel-viewport {
  width: 240px;
  height: 360px;
  overflow: hidden;
  border-radius: 16px;
  background: #0d061a;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
}

.reel-track {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.poster-wrapper {
  width: 100%;
  height: 100%;
}

.roulette-poster {
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.blur-overlay {
  background: rgba(10, 5, 22, 0.4);
  backdrop-filter: blur(2px);
}

.empty-poster {
  width: 240px;
  height: 360px;
  border: 2px dashed rgba(138, 43, 226, 0.3);
  border-radius: 16px;
  flex-direction: column;
}

// Reel pointers
.pointer-left,
.pointer-right {
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  transform: translateY(-50%);
  z-index: 10;
  filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.8));
}

.pointer-left {
  left: 4px;
  border-left: 12px solid $accent;
}

.pointer-right {
  right: 4px;
  border-right: 12px solid $accent;
}
</style>
