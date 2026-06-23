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
        <div class="row q-col-gutter-lg items-center justify-center">
          
          <!-- Genie Column (Akinator Roxo Animado) -->
          <div class="col-12 col-sm-4 flex flex-center">
            <div class="genie-container">
              <!-- SVG Gênio Roxo -->
              <svg 
                viewBox="0 0 200 200" 
                class="purple-genie" 
                :class="{ 'thinking': isTransitioning }"
                width="160" 
                height="160"
              >
                <defs>
                  <radialGradient id="genieGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#8a2be2" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#8a2be2" stop-opacity="0" />
                  </radialGradient>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#d8b4fe" />
                    <stop offset="60%" stop-color="#a855f7" />
                    <stop offset="100%" stop-color="#701a75" />
                  </linearGradient>
                  <linearGradient id="turbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f3e8ff" />
                    <stop offset="100%" stop-color="#c084fc" />
                  </linearGradient>
                  <linearGradient id="vestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#3b0764" />
                    <stop offset="100%" stop-color="#1e1b4b" />
                  </linearGradient>
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <!-- Glow de Fundo -->
                <circle cx="100" cy="110" r="70" fill="url(#genieGlow)" />

                <!-- Cauda de Fumaça do Gênio -->
                <path d="M100,160 Q80,180 100,195 Q120,180 100,160" fill="url(#bodyGrad)" opacity="0.8" />
                <path d="M100,140 Q60,165 100,185 Q130,160 100,140" fill="url(#bodyGrad)" opacity="0.6" />
                <path d="M100,120 Q50,150 100,170 Q140,145 100,120" fill="url(#bodyGrad)" />

                <!-- Braços Cruzados -->
                <path d="M60,110 Q45,115 50,125 Q55,135 75,130 Q90,125 100,125" fill="url(#bodyGrad)" stroke="#6b21a8" stroke-width="1.5" />
                <path d="M140,110 Q155,115 150,125 Q145,135 125,130 Q110,125 100,125" fill="url(#bodyGrad)" stroke="#6b21a8" stroke-width="1.5" />

                <!-- Colete -->
                <path d="M80,95 Q100,90 120,95 Q130,120 100,125 Q70,120 80,95" fill="url(#vestGrad)" />
                <path d="M80,95 Q100,105 100,125" fill="none" stroke="#e9d5ff" stroke-width="1" />
                <path d="M120,95 Q100,105 100,125" fill="none" stroke="#e9d5ff" stroke-width="1" />

                <!-- Orelhas -->
                <path d="M75,70 Q60,70 70,80 Z" fill="url(#bodyGrad)" stroke="#6b21a8" stroke-width="1" />
                <path d="M125,70 Q140,70 130,80 Z" fill="url(#bodyGrad)" stroke="#6b21a8" stroke-width="1" />

                <!-- Cabeça -->
                <ellipse cx="100" cy="78" rx="26" ry="24" fill="url(#bodyGrad)" />

                <!-- Bigode e Barba -->
                <path d="M88,84 Q100,88 100,82 Q100,88 112,84 Q100,92 88,84" fill="#3b0764" />
                <path d="M96,94 Q100,105 100,105 Q100,105 104,94 Z" fill="#3b0764" />

                <!-- Olhos -->
                <ellipse cx="91" cy="72" rx="4" ry="6" fill="#fff" />
                <circle cx="91" cy="72" r="2" fill="#581c87" />
                <ellipse cx="109" cy="72" rx="4" ry="6" fill="#fff" />
                <circle cx="109" cy="72" r="2" fill="#581c87" />

                <!-- Sobrancelhas -->
                <path d="M85,65 Q91,62 97,67" fill="none" stroke="#3b0764" stroke-width="2" stroke-linecap="round" />
                <path d="M115,65 Q109,62 103,67" fill="none" stroke="#3b0764" stroke-width="2" stroke-linecap="round" />

                <!-- Sorriso -->
                <path d="M94,80 Q100,85 106,80" fill="none" stroke="#3b0764" stroke-width="1.5" stroke-linecap="round" />
                <!-- Nariz -->
                <path d="M98,74 Q100,77 102,74" fill="none" stroke="#6b21a8" stroke-width="1.5" />

                <!-- Turbante -->
                <path d="M72,62 Q100,45 128,62 Q130,50 100,40 Q70,50 72,62" fill="url(#turbanGrad)" stroke="#7e22ce" stroke-width="1" />
                <path d="M82,60 Q100,50 118,60" fill="url(#turbanGrad)" />

                <!-- Gema do Turbante (Neon) -->
                <polygon points="100,46 104,52 100,58 96,52" fill="#00f0ff" filter="url(#neonGlow)" />
                <path d="M100,46 Q105,30 95,20 Q92,32 100,46" fill="#c084fc" />
              </svg>
            </div>
          </div>

          <!-- Question & Options Column -->
          <div class="col-12 col-sm-8">
            <!-- Balão de Fala com a Pergunta -->
            <div class="speech-bubble q-mb-lg">
              <div class="text-h6 text-white text-center question-text">
                {{ isTransitioning ? genieReaction : currentQuestion.question }}
              </div>
            </div>

            <!-- Lista de Opções -->
            <div class="column q-gutter-md">
              <q-btn
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="quiz-option-btn text-left justify-start"
                align="left"
                no-caps
                flat
                :disable="isTransitioning"
                @click="answerQuestion(option)"
              >
                <div class="row items-center no-wrap full-width">
                  <div class="option-badge q-mr-md flex flex-center">{{ getOptionLetter(index) }}</div>
                  <div class="text-body1 option-text col">{{ option.text }}</div>
                </div>
              </q-btn>
            </div>
          </div>

        </div>
      </div>

      <!-- Results Phase -->
      <div v-else class="results-container text-center">
        <!-- Gênio comemorando nos Resultados -->
        <div class="flex flex-center q-mb-md">
          <div class="genie-container">
            <svg viewBox="0 0 200 200" class="purple-genie celebrating" width="140" height="140">
              <defs>
                <radialGradient id="genieGlowRes" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#8a2be2" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="#8a2be2" stop-opacity="0" />
                </radialGradient>
                <linearGradient id="bodyGradRes" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#d8b4fe" />
                  <stop offset="60%" stop-color="#a855f7" />
                  <stop offset="100%" stop-color="#701a75" />
                </linearGradient>
                <linearGradient id="turbanGradRes" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f3e8ff" />
                  <stop offset="100%" stop-color="#c084fc" />
                </linearGradient>
                <linearGradient id="vestGradRes" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#3b0764" />
                  <stop offset="100%" stop-color="#1e1b4b" />
                </linearGradient>
                <filter id="neonGlowRes" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <circle cx="100" cy="110" r="70" fill="url(#genieGlowRes)" />
              <path d="M100,160 Q80,180 100,195 Q120,180 100,160" fill="url(#bodyGradRes)" opacity="0.8" />
              <path d="M100,140 Q60,165 100,185 Q130,160 100,140" fill="url(#bodyGradRes)" opacity="0.6" />
              <path d="M100,120 Q50,150 100,170 Q140,145 100,120" fill="url(#bodyGradRes)" />
              <path d="M60,110 Q45,115 50,125 Q55,135 75,130 Q90,125 100,125" fill="url(#bodyGradRes)" stroke="#6b21a8" stroke-width="1.5" />
              <path d="M140,110 Q155,115 150,125 Q145,135 125,130 Q110,125 100,125" fill="url(#bodyGradRes)" stroke="#6b21a8" stroke-width="1.5" />
              <path d="M80,95 Q100,90 120,95 Q130,120 100,125 Q70,120 80,95" fill="url(#vestGradRes)" />
              <path d="M80,95 Q100,105 100,125" fill="none" stroke="#e9d5ff" stroke-width="1" />
              <path d="M120,95 Q100,105 100,125" fill="none" stroke="#e9d5ff" stroke-width="1" />
              <path d="M75,70 Q60,70 70,80 Z" fill="url(#bodyGradRes)" stroke="#6b21a8" stroke-width="1" />
              <path d="M125,70 Q140,70 130,80 Z" fill="url(#bodyGradRes)" stroke="#6b21a8" stroke-width="1" />
              <ellipse cx="100" cy="78" rx="26" ry="24" fill="url(#bodyGradRes)" />
              <path d="M88,84 Q100,88 100,82 Q100,88 112,84 Q100,92 88,84" fill="#3b0764" />
              <path d="M96,94 Q100,105 100,105 Q100,105 104,94 Z" fill="#3b0764" />
              <ellipse cx="91" cy="72" rx="4" ry="6" fill="#fff" />
              <circle cx="91" cy="72" r="2" fill="#581c87" />
              <ellipse cx="109" cy="72" rx="4" ry="6" fill="#fff" />
              <circle cx="109" cy="72" r="2" fill="#581c87" />
              <path d="M85,65 Q91,62 97,67" fill="none" stroke="#3b0764" stroke-width="2" stroke-linecap="round" />
              <path d="M115,65 Q109,62 103,67" fill="none" stroke="#3b0764" stroke-width="2" stroke-linecap="round" />
              <path d="M94,80 Q100,85 106,80" fill="none" stroke="#3b0764" stroke-width="1.5" stroke-linecap="round" />
              <path d="M98,74 Q100,77 102,74" fill="none" stroke="#6b21a8" stroke-width="1.5" />
              <path d="M72,62 Q100,45 128,62 Q130,50 100,40 Q70,50 72,62" fill="url(#turbanGradRes)" stroke="#7e22ce" stroke-width="1" />
              <path d="M82,60 Q100,50 118,60" fill="url(#turbanGradRes)" />
              <polygon points="100,46 104,52 100,58 96,52" fill="#00f0ff" filter="url(#neonGlowRes)" />
              <path d="M100,46 Q105,30 95,20 Q92,32 100,46" fill="#c084fc" />
            </svg>
          </div>
        </div>

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

// Estados de transição e fala do gênio
const isTransitioning = ref(false)
const genieReaction = ref('')

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

// Perguntas com falas de reações integradas
const questions = [
  {
    question: 'Como está sua bateria social hoje?',
    options: [
      {
        text: 'Quero ver explosões e zero interações humanas.',
        genres: ['Ação', 'Ficção Científica', 'Aventura'],
        typeScore: 'A',
        reaction: 'Nada como um bom isolamento com dinamite! 💥'
      },
      {
        text: 'Quero chorar em posição fetal debaixo das cobertas.',
        genres: ['Drama', 'Romance'],
        typeScore: 'B',
        reaction: 'Entendo perfeitamente, já vou preparando os lenços... 🥺'
      },
      {
        text: 'Quero gargalhar até meu abdômen pedir arrego.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
        reaction: 'Rir é o melhor remédio, prepare-se para gargalhar! 😂'
      },
      {
        text: 'Quero desvendar crimes escabrosos com um café frio.',
        genres: ['Suspense', 'Mistério', 'Terror'],
        typeScore: 'D',
        reaction: 'Pegue sua lupa, caro detetive... O mistério nos aguarda! 🔍'
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
        reaction: 'No espaço ninguém vai ouvir ele reclamar! 🚀🌌'
      },
      {
        text: 'Um almoço interminável discutindo política familiar.',
        genres: ['Drama', 'Comédia'],
        typeScore: 'B',
        reaction: 'Isso que é punição cruel... Fiquei até com pena! 🫠'
      },
      {
        text: 'Uma cabana escura no meio de uma floresta macabra.',
        genres: ['Terror', 'Suspense'],
        typeScore: 'D',
        reaction: 'Gostei da sua vibe sombria... Que comece o suspense! 💀'
      },
      {
        text: "Um musical onde as pessoas dançam em vez de responder 'bom dia'.",
        genres: ['Romance', 'Animação'],
        typeScore: 'C',
        reaction: 'Que pesadelo ritmado! Dançar logo cedo... 🕺🏽✨'
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
        reaction: 'Eita, que tempero vingativo! Gostei! 🍿⚡'
      },
      {
        text: 'Uma barra de chocolate gigante para suprir carências emocionais.',
        genres: ['Romance', 'Drama'],
        typeScore: 'B',
        reaction: 'O chocolate cura tudo, inclusive a alma! 🍫❤️'
      },
      {
        text: 'Um miojo cru às duas da manhã porque sim.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
        reaction: 'Um clássico da culinária da madrugada! Muito refinado! 🍜'
      },
      {
        text: 'Um banquete vitoriano que provavelmente está envenenado.',
        genres: ['Mistério', 'Terror'],
        typeScore: 'D',
        reaction: 'Espero que você tenha um provador de comida real... 👑☠️'
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
        reaction: 'Equipe suas armas, a batalha já vai começar! 👽⚔️'
      },
      {
        text: 'Melodramático. Tudo me comove, até comercial de sabão em pó.',
        genres: ['Drama', 'Romance'],
        typeScore: 'B',
        reaction: 'Um grande drama nos espera no final desse quiz! 🎭'
      },
      {
        text: 'Besta. Qualquer mosca voando me faz dar risadinha.',
        genres: ['Comédia', 'Animação'],
        typeScore: 'C',
        reaction: 'Hahaha, mantenha esse sorriso no rosto! 🤪'
      },
      {
        text: 'Cético e desconfiado até da minha própria sombra.',
        genres: ['Suspense', 'Mistério', 'Terror'],
        typeScore: 'D',
        reaction: 'Não confie em ninguém... nem mesmo nas minhas indicações! 🕵️'
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

// Ao responder a pergunta, reage antes de avançar
const answerQuestion = (option) => {
  if (isTransitioning.value) return

  // Adicionar pontuação
  option.genres.forEach((g) => {
    genreScores.value[g] += 1
  })
  typeScores.value[option.typeScore] += 1
  
  // Ativa reação e bloqueia novos cliques rápidos
  genieReaction.value = option.reaction || 'Hum, interessante...'
  isTransitioning.value = true

  // Espera 1.6 segundos para mostrar o comentário e depois avança
  setTimeout(() => {
    step.value += 1
    isTransitioning.value = false
    genieReaction.value = ''

    // Se o quiz terminou, dispara confete
    if (step.value > totalSteps) {
      dispararConfete()
    }
  }, 1600)
}

// Função de confete carregada via CDN online diretamente no navegador (evita erros do npm)
const dispararConfete = async () => {
  try {
    if (!window.confetti) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
        script.onload = () => resolve(window.confetti)
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#8a2be2', '#00f0ff', '#ff007f']
      })
    }
  } catch (err) {
    console.error('Erro ao disparar confetes:', err)
  }
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
  const sortedGenres = Object.entries(genreScores.value)
    .filter((entry) => entry[1] > 0)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  if (sortedGenres.length === 0) {
    return props.movies.slice(0, 3)
  }

  const topGenres = sortedGenres.slice(0, 3)

  const matches = props.movies.filter((movie) => {
    return movie.genres.some((g) => topGenres.includes(g))
  })

  return matches.sort((a, b) => b.rating - a.rating).slice(0, 3)
})

const searchWhereToWatch = (movie) => {
  const query = encodeURIComponent(`onde assistir ${movie.title} ${movie.release_year}`)
  window.open(`https://www.google.com/search?q=${query}`, '_blank')
}

const resetQuiz = () => {
  step.value = 1
  isTransitioning.value = false
  genieReaction.value = ''
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
  max-width: 750px; /* Aumentado ligeiramente para comportar o gênio ao lado no desktop */
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

/* === ESTILOS DO GÊNIO AKINATOR ROXO === */

.genie-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.purple-genie {
  animation: bobbing 4s ease-in-out infinite;
  filter: drop-shadow(0 8px 16px rgba(138, 43, 226, 0.4));
  transition: filter 0.4s ease;

  &.thinking {
    animation: bobbing 1.2s ease-in-out infinite; /* Balanço acelerado */
    filter: drop-shadow(0 8px 24px rgba(0, 240, 255, 0.75)); /* Brilho Ciano ao pensar */
  }

  &.celebrating {
    animation: bobbing 3s ease-in-out infinite, pulse-glow 2s infinite alternate;
  }
}

@keyframes bobbing {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(1deg);
  }
}

@keyframes pulse-glow {
  0% {
    filter: drop-shadow(0 8px 16px rgba(138, 43, 226, 0.4));
  }
  100% {
    filter: drop-shadow(0 8px 24px rgba(0, 240, 255, 0.7));
  }
}

/* === BALÃO DE FALA (SPEECH BUBBLE) === */

.speech-bubble {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(138, 43, 226, 0.35);
  border-radius: 20px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  &::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: rgba(20, 15, 35, 0.98); /* Fundo escuro sólido para o balão */
    border-left: 1px solid rgba(138, 43, 226, 0.35);
    border-bottom: 1px solid rgba(138, 43, 226, 0.35);
  }
}

/* Setas do Balão de Fala Dinâmicas */
@media (min-width: 600px) {
  .speech-bubble::before {
    left: -8px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }
}

@media (max-width: 599.99px) {
  .speech-bubble::before {
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(135deg);
  }
}
</style>
