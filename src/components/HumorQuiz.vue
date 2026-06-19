<template>
  <div class="q-pa-md flex flex-center full-width">
    <q-card class="glass-panel quiz-card q-pa-lg full-width">
      <!-- Quiz Header -->
      <div class="text-center q-mb-md">
        <div class="text-h5 text-gradient-primary q-mb-xs">🎬 CineMatch Quiz</div>
        <div class="text-subtitle2 text-grey-4">
          Descubra o que assistir com base no seu humor de hoje
        </div>
      </div>

      <!-- Progress bar -->
      <q-linear-progress
        v-if="step <= totalSteps"
        :value="(step - 1) / totalSteps"
        color="secondary"
        track-color="dark"
        class="q-mb-lg"
        rounded
      />

      <!-- Question Phase -->
      <div v-if="step <= totalSteps" class="question-container">
        <!-- Question Title -->
        <div class="text-h6 text-white text-center q-mb-lg question-text">
          {{ currentQuestion.question }}
        </div>

        <!-- Options list -->
        <div class="column q-gutter-md">
          <q-btn
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="quiz-option-btn text-left justify-start"
            align="left"
            no-caps
            flat
            @click="answerQuestion(option.genres, option.typeScore)"
          >
            <div class="row items-center no-wrap full-width">
              <div class="option-badge q-mr-md flex flex-center">{{ getOptionLetter(index) }}</div>
              <div class="text-body1 option-text col">{{ option.text }}</div>
            </div>
          </q-btn>
        </div>
      </div>

      <!-- Results Phase -->
      <div v-else class="results-container text-center">
        <!-- Personality Header -->
        <div class="text-h4 text-accent text-weight-bolder q-mb-sm">
          {{ resultProfile.title }}
        </div>

        <p class="text-subtitle1 text-grey-3 q-mb-xl text-center profile-description">
          {{ resultProfile.description }}
        </p>

        <!-- Recommendations Grid Title -->
        <div class="text-h6 text-white text-left q-mb-md flex items-center">
          <q-icon name="local_movies" color="secondary" class="q-mr-sm" size="24px" />
          Filmes indicados para você agora:
        </div>

        <!-- Movie recommendation items -->
        <div class="row q-col-gutter-md q-mb-xl">
          <div v-for="movie in recommendedMovies" :key="movie.id" class="col-12 col-sm-6 col-md-4">
            <q-card
              class="glass-card recommended-movie-card q-pa-sm flex flex-column justify-between h-100"
            >
              <div class="row no-wrap">
                <!-- Poster -->
                <q-img
                  :src="getImageUrl(movie.poster_path)"
                  class="recommended-poster q-mr-sm rounded-borders"
                  fit="cover"
                  height="110px"
                  width="75px"
                  no-spinner
                />
                <!-- Text Details -->
                <div class="col text-left flex flex-column justify-between">
                  <div>
                    <div
                      class="text-subtitle1 text-weight-bold text-white leading-tight line-clamp-1"
                    >
                      {{ movie.title }}
                    </div>
                    <div class="text-caption text-grey-4 q-mb-xs">
                      {{ movie.release_year }} • ★ {{ formatRating(movie.rating) }}
                    </div>
                    <!-- Genres -->
                    <div class="row q-gutter-xxs">
                      <span
                        v-for="g in movie.genres.slice(0, 2)"
                        :key="g"
                        class="text-xxs text-grey-3 q-mr-xs border-grey q-px-xs"
                      >
                        {{ g }}
                      </span>
                    </div>
                  </div>
                  <!-- Description (Short) -->
                  <p class="text-xxs text-grey-4 q-mb-none line-clamp-2 q-mt-xs">
                    {{ movie.overview }}
                  </p>
                </div>
              </div>
              <q-btn
                flat
                dense
                color="accent"
                icon="search"
                label="Ver Onde Assistir"
                size="11px"
                class="q-mt-xs full-width btn-watch-now"
                @click="searchWhereToWatch(movie)"
              />
            </q-card>
          </div>

          <div v-if="recommendedMovies.length === 0" class="col-12 text-center text-grey-4 q-py-lg">
            Nenhum filme correspondente encontrado. Que tal refazer o teste?
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="row justify-center q-gutter-md">
          <q-btn
            class="btn-neon-primary q-px-lg"
            label="Refazer Quiz"
            icon="replay"
            no-caps
            @click="resetQuiz"
          />
          <q-btn
            class="btn-neon-secondary q-px-lg"
            label="Voltar para Sorteador"
            icon="casino"
            no-caps
            @click="navigateHome"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['goToTab'])

const navigateHome = () => {
  emit('goToTab', 'sorter')
}

const step = ref(1)
const totalSteps = 4

// Scores mapping
const genreScores = ref({
  Ação: 0,
  'Ficção Científica': 0,
  Aventura: 0,
  Drama: 0,
  Romance: 0,
  Comédia: 0,
  Animação: 0,
  Suspense: 0,
  Mistério: 0,
  Terror: 0,
})

const typeScores = ref({
  A: 0, // Action/Sci-Fi focus
  B: 0, // Drama/Romance focus
  C: 0, // Comedy/Animation focus
  D: 0, // Thriller/Mystery/Horror focus
})

const questions = [
  {
    question: 'Como está sua bateria social hoje?',
    options: [
      {
        text: 'Quero ver explosões e zero interações humanas.',
        genres: ['Ação', 'Ficção Científica', 'Aventura'],
        typeScore: 'A',
      },
      {
        text: 'Quero chorar em posição fetal debaixo das cobertas.',
        genres: ['Drama', 'Romance'],
        typeScore: 'B',
      },
      {
        text: 'Quero gargalhar até meu abdômen pedir arrego.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
      },
      {
        text: 'Quero desvendar crimes escabrosos com um café frio.',
        genres: ['Suspense', 'Mistério', 'Terror'],
        typeScore: 'D',
      },
    ],
  },
  {
    question: 'Se você pudesse mandar seu chefe/vizinho chato para um lugar, seria para:',
    options: [
      {
        text: 'Uma nave espacial à deriva no vácuo eterno.',
        genres: ['Ficção Científica', 'Aventura'],
        typeScore: 'A',
      },
      {
        text: 'Um almoço interminável discutindo política familiar.',
        genres: ['Drama', 'Comédia'],
        typeScore: 'B',
      },
      {
        text: 'Uma cabana escura no meio de uma floresta macabra.',
        genres: ['Terror', 'Suspense'],
        typeScore: 'D',
      },
      {
        text: "Um musical onde as pessoas dançam em vez de responder 'bom dia'.",
        genres: ['Romance', 'Animação'],
        typeScore: 'C',
      },
    ],
  },
  {
    question: 'O lanche ideal para acompanhar o seu filme é...',
    options: [
      {
        text: 'Pipoca temperada com o sal das lágrimas de quem me irritou.',
        genres: ['Ação', 'Suspense'],
        typeScore: 'A',
      },
      {
        text: 'Uma barra de chocolate gigante para suprir carências emocionais.',
        genres: ['Romance', 'Drama'],
        typeScore: 'B',
      },
      {
        text: 'Um miojo cru às duas da manhã porque sim.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
      },
      {
        text: 'Um banquete vitoriano que provavelmente está envenenado.',
        genres: ['Mistério', 'Terror'],
        typeScore: 'D',
      },
    ],
  },
  {
    question: 'Como você define seu estado mental neste exato momento?',
    options: [
      {
        text: 'Pronto para combater o crime organizado ou alienígenas.',
        genres: ['Ação', 'Ficção Científica'],
        typeScore: 'A',
      },
      {
        text: 'Melodramático. Tudo me comove, até comercial de sabão em pó.',
        genres: ['Drama', 'Romance'],
        typeScore: 'B',
      },
      {
        text: 'Besta. Qualquer mosca voando me faz dar risadinha.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
      },
      {
        text: 'Cético e desconfiado até da minha própria sombra.',
        genres: ['Suspense', 'Mistério', 'Terror'],
        typeScore: 'D',
      },
    ],
  },
]

const currentQuestion = computed(() => questions[step.value - 1])

const getOptionLetter = (index) => {
  return ['A', 'B', 'C', 'D'][index]
}

const getImageUrl = (path) => {
  if (!path)
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500'
  if (path.startsWith('http')) return path
  return `https://image.tmdb.org/t/p/w500${path}`
}

const formatRating = (rating) => {
  if (!rating) return 'N/A'
  return Number(rating).toFixed(1)
}

const answerQuestion = (genres, type) => {
  genres.forEach((g) => {
    genreScores.value[g] += 1
  })
  typeScores.value[type] += 1
  step.value += 1
}

// Calculate results profile
const resultProfile = computed(() => {
  let maxScore = -1
  let dominantType = 'A'

  for (const [key, value] of Object.entries(typeScores.value)) {
    if (value > maxScore) {
      maxScore = value
      dominantType = key
    }
  }

  const profiles = {
    A: {
      title: '⚔️ O Guerreiro do Sofá (Adrenalina & Sci-Fi)',
      description:
        'Você quer explosão, ficção científica de ponta, socos no ar e efeitos visuais impressionantes. Conversas longas? Não, obrigado. Você quer ver o destino do universo ser salvo antes da sua hora de dormir!',
    },
    B: {
      title: '😭 Manteiga Derretida (Drama & Emoção)',
      description:
        'Você está com o coração aberto hoje. Quer tramas intensas, romances arrebatadores ou dramas profundos que façam você soluçar debaixo das cobertas. Prepare os lenços e afogue as mágoas em um bom chocolate!',
    },
    C: {
      title: '🤪 Crise de Riso (Divertido & Leve)',
      description:
        'Sua meta é pura descontração. Você quer gargalhar até a barriga doer ou assistir a uma animação colorida e fofa. Zero estresse, zero mistérios sombrios. Apenas entretenimento puro e leveza!',
    },
    D: {
      title: '🕵️‍♂️ O Detetive Paranoico (Suspense & Terror)',
      description:
        'Você quer suspense que faça roer as unhas, quebra-cabeças psicológicos ou monstros que dão susto. Você desconfia de todos os personagens e gosta da sensação de adrenalina de estar bem seguro no seu sofá.',
    },
  }

  return profiles[dominantType]
})

// Recommended movies based on preferred genres in the score
const recommendedMovies = computed(() => {
  // Sort genres by score
  const sortedGenres = Object.entries(genreScores.value)
    .filter((entry) => entry[1] > 0)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  if (sortedGenres.length === 0) {
    // Return popular default
    return props.movies.slice(0, 3)
  }

  // Filter movies that contain at least one of the top 3 scored genres
  const topGenres = sortedGenres.slice(0, 3)

  // Find movies matching top genres
  const matches = props.movies.filter((movie) => {
    return movie.genres.some((g) => topGenres.includes(g))
  })

  // Sort matched movies by rating desc, slice top 3
  return matches.sort((a, b) => b.rating - a.rating).slice(0, 3)
})

const searchWhereToWatch = (movie) => {
  const query = encodeURIComponent(`onde assistir ${movie.title} ${movie.release_year}`)
  window.open(`https://www.google.com/search?q=${query}`, '_blank')
}

const resetQuiz = () => {
  step.value = 1
  for (const g in genreScores.value) {
    genreScores.value[g] = 0
  }
  for (const t in typeScores.value) {
    typeScores.value[t] = 0
  }
}
</script>

<style lang="scss" scoped>
.quiz-card {
  max-width: 650px;
  margin: 0 auto;
  border-radius: 24px;
}

.question-text {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quiz-option-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(138, 43, 226, 0.15) !important;
    border-color: rgba(138, 43, 226, 0.5);
    transform: translateX(4px);
  }
}

.option-badge {
  background: rgba(138, 43, 226, 0.25);
  color: $accent;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.option-text {
  color: #dedede;
  font-size: 15px;
}

.profile-description {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.recommended-movie-card {
  border-radius: 12px;
  height: 100%;
}

.recommended-poster {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.text-xxs {
  font-size: 10px;
  line-height: 1.2;
}

.text-xxs.border-grey {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.q-gutter-xxs {
  margin-top: 2px;
}

.btn-watch-now {
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 600;

  &:hover {
    background: rgba(0, 240, 255, 0.1);
    color: #fff;
    border-color: rgba(0, 240, 255, 0.4);
  }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
