# trabalho_lrm2

Projeto de Programação Web 1

Idéia do projeto: um app / desktop que escolhe um ou mais sugestões de filmes para assistir

Integrantes: Renan Phelipe Vieira , Poliana Masotti e Lucas Lino

prompts Lucas lino: <template>

  <q-card class="glass-card movie-card overflow-hidden full-height flex flex-direction-column">

    <div class="relative-position image-container">

      <!-- Image poster -->

      <q-img

        :src="getImageUrl(movie.poster_path)"

        class="movie-poster"

        fit="cover"

        height="360px"

        no-spinner

      >

        <template v-slot:error>

          <div class="absolute-full flex flex-center bg-dark text-grey-5">

            <q-icon name="movie" size="64px" />

            <div class="q-mt-md text-subtitle2">Sem pôster disponível</div>

          </div>

        </template>

      </q-img>



      <!-- Rating Badge -->

      <div class="absolute-top-right q-ma-md rating-badge-container">

        <div class="rating-badge flex items-center q-px-sm q-py-xs">

          <q-icon name="star" color="amber" size="18px" class="q-mr-xs" />

          <span class="text-white text-weight-bold">{{ formatRating(movie.rating) }}</span>

        </div>

      </div>



      <!-- Type Badge (Movie / Series) -->

      <div class="absolute-bottom-left q-ma-md">

        <q-chip

          :color="movie.type === 'series' ? 'secondary' : 'primary'"

          text-color="white"

          dense

          square

          class="text-weight-bold shadow-2"

        >

          {{ movie.type === 'series' ? 'Série' : 'Filme' }}

        </q-chip>

      </div>

    </div>



    <q-card-section class="col q-pa-md flex flex-column justify-between">

      <div>

        <!-- Title & Year -->

        <div class="row no-wrap items-start justify-between q-mb-xs">

          <div class="text-h6 text-weight-bold text-white line-clamp-2 leading-tight">

            {{ movie.title }}

          </div>

        </div>

        <div class="text-subtitle2 text-grey-4 q-mb-sm">

          Lançamento: <span class="text-white text-weight-bold">{{ movie.release_year }}</span>

        </div>



        <!-- Genres -->

        <div class="row q-gutter-xs q-mb-md">

          <q-chip

            v-for="genre in movie.genres"

            :key="genre"

            outline

            color="grey-4"

            text-color="grey-4"

            dense

            size="11px"

            class="genre-chip"

          >

            {{ genre }}

          </q-chip>

        </div>



        <!-- Synopsis -->

        <p class="text-body2 text-grey-3 line-clamp-4 q-mb-none text-justify">

          {{ movie.overview || 'Nenhuma sinopse disponível para este título.' }}

        </p>

      </div>



      <!-- Actions -->

      <div class="q-mt-md flex justify-end">

        <q-btn

          flat

          dense

          color="accent"

          icon="search"

          label="Onde assistir?"

          @click="searchWhereToWatch"

          class="full-width q-py-xs btn-watch-where"

        />

      </div>

    </q-card-section>

  </q-card>

</template>



<script setup>

// 1. Armazenamos o retorno de defineProps em uma constante para poder usar no JS

const props = defineProps({

  movie: {

    type: Object,

    required: true,

  },

})



// 2. Agora a função pega o caminho correto usando 'props.movie' se nenhum caminho for passado

const getImageUrl = (path) => {

  // Se o path não existir (vazio, nulo ou undefined)

  if (!path) {

    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500'

  }

 

  // Se já for uma URL completa, apenas retorna ela

  if (path.startsWith('http')) {

    return path

  }

 

  // Se for apenas o caminho parcial (ex: /c58yX41AIn66lWpQG10712nC79z.jpg)

  return `https://image.tmdb.org/t/p/w500${path}`

}



const formatRating = (rating) => {

  if (!rating) return 'N/A'

  return Number(rating).toFixed(1)

}



const searchWhereToWatch = () => {

  // Corrigido para acessar via props.movie

  const query = encodeURIComponent(`onde assistir ${props.movie.title} ${props.movie.release_year}`)

  window.open(`https://www.google.com/search?q=${query}`, '_blank')

}

</script>







<style lang="scss" scoped>

.movie-card {

  height: 100%;

  border-radius: 20px !important;

  display: flex;

  flex-direction: column;

}



.image-container {

  overflow: hidden;

  border-top-left-radius: 20px;

  border-top-right-radius: 20px;

}



.movie-poster {

  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);



  &:hover {

    transform: scale(1.05);

  }

}



.rating-badge-container {

  z-index: 10;

}



.rating-badge {

  background: rgba(0, 0, 0, 0.7);

  backdrop-filter: blur(8px);

  border: 1px solid rgba(255, 255, 255, 0.15);

  border-radius: 10px;

  font-size: 14px;

}



.line-clamp-2 {

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  text-overflow: ellipsis;

}



.line-clamp-4 {

  display: -webkit-box;

  -webkit-line-clamp: 4;

  -webkit-box-orient: vertical;

  overflow: hidden;

  text-overflow: ellipsis;

  line-height: 1.5;

}



.genre-chip {

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.1);

  margin: 0;

}



.btn-watch-where {

  border-radius: 10px;

  border: 1px dashed rgba(0, 240, 255, 0.3);

  transition: all 0.3s ease;

  font-weight: 600;



  &:hover {

    background: rgba(0, 240, 255, 0.1);

    border-style: solid;

    border-color: rgba(0, 240, 255, 0.6);

  }

}

</style>

 {

    id: 13,

    title: 'Stranger Things',

    type: 'series',

    release_year: 2016,

    rating: 8.6,

    genres: ['Ficção Científica', 'Drama', 'Suspense', 'Mistério'],

    overview:

      'Quando um garoto desaparece misteriosamente em uma pequena cidade de Indiana, seus amigos começam a investigar e encontram uma menina com superpoderes e uma conspiração governamental sobrenatural.',

    poster_path: '/49WJfeN0mhmj3cntq7ah5G86e6G.jpg',

  },

  {

    id: 14,

    title: 'Coringa',

    type: 'movie',

    release_year: 2019,

    rating: 8.2,

    genres: ['Drama', 'Suspense'],

    overview:

      'Arthur Fleck trabalha como palhaço e vive isolado e ridicularizado pela sociedade de Gotham. Suas condições psicológicas se agravam progressivamente até que ele inicia uma onda de violência anárquica.',

    poster_path: '/6t13ntjh1157V2YYB4j8v5e3JkP.jpg',

  }, a imagem n aparece 
import fs from 'fs'
import axios from 'axios'
import { movies } from './src/data/movies.js' // ajuste o caminho

const API_KEY = 'ad50bc774af1c013c0354a268ce46551'

async function getPoster(title, type) {
  try {
    const mediaType = type === 'tv' || type === 'series' ? 'tv' : 'movie'

    const { data } = await axios.get(`https://api.themoviedb.org/3/search/${mediaType}`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
        query: title,
      },
    })

    if (data.results.length > 0) {
      console.log(`${title} -> ${data.results[0].title || data.results[0].name}`)

      return data.results[0].poster_path
    }

    console.log(`Não encontrado: ${title}`)
    return null
  } catch (err) {
    console.log(`Erro em ${title}`, err.message)
    return null
  }
}

async function updatePosters() {
  const updatedMovies = []

  for (const movie of movies) {
    const title = movie.title || movie.name
    const type = movie.type || (movie.media_type === 'tv' ? 'tv' : 'movie')

    const poster = await getPoster(title, type)

    if (!poster) {
      console.log(`❌ Não encontrado: ${title}`)
    }

    updatedMovies.push({
      ...movie,
      poster_path: poster || null,
    })
  }

  fs.writeFileSync('./movies-updated.json', JSON.stringify(updatedMovies, null, 2), 'utf8')

  console.log('✅ Arquivo movies-updated.json gerado!')
}

updatePosters()
quero arrumar o poster que nao aparece 
.rating-badge {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-size: 14px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.genre-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0;
}

.btn-watch-where {
  border-radius: 10px;
  border: 1px dashed rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: rgba(0, 240, 255, 0.1);
    border-style: solid;
    border-color: rgba(0, 240, 255, 0.6);
  }
}
</style>
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
  return `https://media.themoviedb.org/t/p/w500${path}` // ← funciona sem auth
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
</style> ainda esta com o problema do poster na aparecer
agora so aparece a imagem quando nao encontra o poster
agora so aparece a imagem de postar nao encontrado padrao e nao o poster do filme
43 falharam e nenhum baixados
todos deu certo


