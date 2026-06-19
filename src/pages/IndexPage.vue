<template>
  <div class="q-px-md full-width page-wrapper">
    <!-- Navigation Tabs -->
    <div class="row justify-center q-mb-lg">
      <q-card class="glass-panel tabs-card q-py-xs q-px-sm">
        <q-tabs
          v-model="activeTab"
          active-color="accent"
          indicator-color="accent"
          align="justify"
          class="text-grey-4"
        >
          <q-tab name="sorter" icon="casino" label="Sorteador" />
          <q-tab name="quiz" icon="psychology" label="Quiz Humor" />
          <q-tab name="settings" icon="settings" label="Configurações" />
        </q-tabs>
      </q-card>
    </div>

    <!-- Tab Panels -->
    <q-tab-panels
      v-model="activeTab"
      animated
      transition-prev="fade"
      transition-next="fade"
      class="transparent bg-transparent"
    >
      <!-- Sorteador Tab -->
      <q-tab-panel name="sorter" class="q-pa-none">
        <div class="row q-col-gutter-lg justify-center items-stretch">
          <!-- Filters Column -->
          <div class="col-12 col-md-5">
            <q-card
              class="glass-panel filter-card full-height flex flex-column justify-between q-pa-lg"
            >
              <div>
                <div class="text-h6 text-white text-weight-bold q-mb-md flex items-center">
                  <q-icon name="filter_alt" color="accent" class="q-mr-sm" size="24px" />
                  Filtros de Escolha
                </div>

                <!-- Type filter -->
                <div class="q-mb-md">
                  <div class="text-subtitle2 text-grey-4 q-mb-xs">O que você quer ver?</div>
                  <q-btn-toggle
                    v-model="filters.type"
                    spread
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="dark"
                    text-color="grey-4"
                    :options="[
                      { label: 'Tudo', value: 'todos' },
                      { label: 'Filmes', value: 'movie' },
                      { label: 'Séries', value: 'series' },
                    ]"
                  />
                </div>

                <!-- Genre filter -->
                <div class="q-mb-md">
                  <div class="text-subtitle2 text-grey-4 q-mb-xs">Gênero favorito</div>
                  <q-select
                    v-model="filters.genre"
                    :options="genreOptions"
                    outlined
                    dense
                    dark
                    color="accent"
                    label="Selecione um gênero (Opcional)"
                    class="genre-select"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="filters.genre"
                        name="clear"
                        class="cursor-pointer"
                        @click.stop="filters.genre = null"
                      />
                    </template>
                  </q-select>
                </div>

                <!-- Min Year filter -->
                <div class="q-mb-md">
                  <div class="row justify-between text-subtitle2 text-grey-4 q-mb-xs">
                    <span>Ano mínimo de lançamento</span>
                    <span class="text-accent text-weight-bold">{{ filters.minYear }}</span>
                  </div>
                  <q-slider
                    v-model="filters.minYear"
                    :min="1970"
                    :max="2026"
                    :step="1"
                    color="primary"
                    label
                    dark
                  />
                </div>

                <!-- Min Rating filter -->
                <div class="q-mb-lg">
                  <div class="row justify-between text-subtitle2 text-grey-4 q-mb-xs">
                    <span>Nota mínima</span>
                    <span class="text-accent text-weight-bold"
                      >★ {{ filters.minRating.toFixed(1) }}</span
                    >
                  </div>
                  <q-slider
                    v-model="filters.minRating"
                    :min="0"
                    :max="10"
                    :step="0.5"
                    color="secondary"
                    label
                    dark
                  />
                </div>
              </div>

              <!-- Spin Button -->
              <div>
                <q-btn
                  class="btn-neon-primary full-width q-py-md text-h6"
                  label="Sortear Título"
                  icon="casino"
                  :loading="spinning"
                  @click="drawMovie"
                >
                  <template v-slot:loading>
                    <q-spinner-casino class="on-left" />
                    Sorteando...
                  </template>
                </q-btn>

                <div v-if="apiEnabled" class="text-center text-caption text-cyan q-mt-sm">
                  <q-icon name="cloud" size="14px" class="q-mr-xs" />
                  TMDB API Ativa: Sorteando do catálogo online
                </div>
                <div v-else class="text-center text-caption text-grey-5 q-mt-sm">
                  <q-icon name="storage" size="14px" class="q-mr-xs" />
                  Usando catálogo offline (100 filmes populares)
                </div>
              </div>
            </q-card>
          </div>

          <!-- Spinner / Card Display Column -->
          <div class="col-12 col-md-5 flex flex-center">
            <div class="result-display-wrapper full-width">
              <transition name="fade" mode="out-in">
                <!-- Roulette spinner shown when spinning or no result yet -->
                <div
                  v-if="spinning || !resultMovie"
                  key="spinner"
                  class="flex flex-center full-width"
                >
                  <RouletteSpinner
                    :spinning="spinning"
                    :movie-list="localMovies"
                    :target-movie="resultMovie || dummyTarget"
                    @finished="onSpinFinished"
                  />
                </div>

                <!-- Result movie card shown when finished spinning -->
                <div v-else key="result" class="flex flex-center full-width">
                  <div class="result-card-container full-width text-center">
                    <div
                      class="text-h6 text-gradient-primary text-weight-bold q-mb-md animate-pulse"
                    >
                      ✨ SEU MATCH DE HOJE! ✨
                    </div>
                    <MovieCard :movie="resultMovie" />

                    <q-btn
                      flat
                      dense
                      color="grey-4"
                      icon="casino"
                      label="Sortear Novamente"
                      class="q-mt-md btn-draw-again"
                      @click="drawMovie"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </q-tab-panel>

      <!-- Quiz Tab -->
      <q-tab-panel name="quiz" class="q-pa-none">
        <HumorQuiz :movies="localMovies" @goToTab="changeTab" />
      </q-tab-panel>

      <!-- Settings Tab -->
      <q-tab-panel name="settings" class="q-pa-none flex flex-center">
        <q-card class="glass-panel settings-card q-pa-lg">
          <div class="text-h6 text-white text-weight-bold q-mb-md flex items-center">
            <q-icon name="settings" color="accent" class="q-mr-sm" size="24px" />
            Configuração da API do TMDb
          </div>

          <p class="text-body2 text-grey-4 q-mb-lg leading-relaxed">
            Por padrão, o CineMatch sorteia de uma lista offline de 100 títulos populares. Se
            desejar acessar todo o catálogo mundial em tempo real, configure sua chave de API
            gratuita do The Movie Database (TMDb).
          </p>

          <q-banner
            v-if="apiKeyStatus === 'success'"
            class="bg-positive text-white rounded-borders q-mb-md"
          >
            <q-icon name="check_circle" size="22px" class="q-mr-sm" />
            API Key ativa e funcionando corretamente!
          </q-banner>
          <q-banner
            v-else-if="apiKeyStatus === 'error'"
            class="bg-negative text-white rounded-borders q-mb-md"
          >
            <q-icon name="error" size="22px" class="q-mr-sm" />
            Falha na conexão com a API. Verifique a chave inserida.
          </q-banner>

          <div class="q-mb-md">
            <q-input
              v-model="apiKey"
              type="password"
              outlined
              dark
              color="accent"
              label="Chave de API do TMDb (v3 Auth)"
              class="q-mb-sm"
            />
            <div class="text-caption text-grey-5 text-right">
              Não tem uma chave? Crie em
              <a href="https://www.themoviedb.org/settings/api" target="_blank" class="text-accent"
                >themoviedb.org</a
              >
            </div>
          </div>

          <div class="q-mb-lg">
            <q-checkbox
              v-model="apiEnabled"
              dark
              color="accent"
              label="Ativar buscas online do TMDb"
              :disable="!apiKey"
            />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              v-if="apiKey"
              flat
              color="grey-4"
              label="Limpar Chave"
              no-caps
              @click="clearApiKey"
            />
            <q-btn
              class="btn-neon-primary"
              label="Testar e Salvar"
              icon="save"
              no-caps
              @click="saveApiKey"
            />
          </div>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { movies as initialMovies, genresList } from 'src/data/movies.js'
import MovieCard from 'components/MovieCard.vue'
import RouletteSpinner from 'components/RouletteSpinner.vue'
import HumorQuiz from 'components/HumorQuiz.vue'

const activeTab = ref('sorter')

// Configs
const apiKey = ref('')
const apiEnabled = ref(false)
const apiKeyStatus = ref('idle') // idle, checking, success, error

// Sorteador states
const spinning = ref(false)
const resultMovie = ref(null)
const localMovies = ref(initialMovies)

// Filters
const filters = reactive({
  type: 'todos',
  genre: null,
  minYear: 2010,
  minRating: 6.5,
})

// Genre options
const genreOptions = genresList

// Dummy target for spinning placeholder
const dummyTarget = ref({
  id: 0,
  poster_path: null,
})

// TMDB Genre Maps
const tmdbMovieGenres = {
  Ação: 28,
  Aventura: 12,
  Animação: 16,
  Comédia: 35,
  Drama: 18,
  'Ficção Científica': 878,
  Fantasia: 14,
  Terror: 27,
  Suspense: 53,
  Mistério: 9648,
  Romance: 10749,
}

const tmdbTvGenres = {
  Ação: 10759,
  Aventura: 10759,
  Animação: 16,
  Comédia: 35,
  Drama: 18,
  'Ficção Científica': 10765,
  Fantasia: 10765,
  Terror: 9648,
  Suspense: 9648,
  Mistério: 9648,
  Romance: 10749,
}

onMounted(() => {
  const savedKey = localStorage.getItem('cinematch_tmdb_key')
  const savedEnabled = localStorage.getItem('cinematch_tmdb_enabled')
  if (savedKey) {
    apiKey.value = savedKey
    apiKeyStatus.value = 'success'
  }
  if (savedEnabled === 'true') {
    apiEnabled.value = true
  }
})

const changeTab = (tabName) => {
  activeTab.value = tabName
}

const saveApiKey = async () => {
  if (!apiKey.value.trim()) {
    clearApiKey()
    return
  }

  apiKeyStatus.value = 'checking'
  try {
    // Simple test query
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey.value}&language=pt-BR`,
    )
    if (res.ok) {
      apiKeyStatus.value = 'success'
      localStorage.setItem('cinematch_tmdb_key', apiKey.value)
      localStorage.setItem('cinematch_tmdb_enabled', apiEnabled.value ? 'true' : 'false')
    } else {
      apiKeyStatus.value = 'error'
      apiEnabled.value = false
    }
  } catch (err) {
    console.error(err)
    apiKeyStatus.value = 'error'
    apiEnabled.value = false
  }
}

const clearApiKey = () => {
  apiKey.value = ''
  apiEnabled.value = false
  apiKeyStatus.value = 'idle'
  localStorage.removeItem('cinematch_tmdb_key')
  localStorage.removeItem('cinematch_tmdb_enabled')
}

const getGenreNameById = (id, isMovie) => {
  const map = isMovie ? tmdbMovieGenres : tmdbTvGenres
  for (const [name, genreId] of Object.entries(map)) {
    if (genreId === id) return name
  }
  return ''
}

// Filter offline list
const getFilteredOfflineMovies = () => {
  return localMovies.value.filter((movie) => {
    // Type filter
    if (filters.type !== 'todos' && movie.type !== filters.type) {
      return false
    }
    // Genre filter
    if (filters.genre && !movie.genres.includes(filters.genre)) {
      return false
    }
    // Year filter
    if (movie.release_year < filters.minYear) {
      return false
    }
    // Rating filter
    if (movie.rating < filters.minRating) {
      return false
    }
    return true
  })
}

const drawMovie = async () => {
  resultMovie.value = null
  spinning.value = true

  if (apiEnabled.value && apiKey.value) {
    try {
      const drawn = await drawFromTmdb()
      if (drawn) {
        resultMovie.value = drawn
        return
      }
    } catch (e) {
      console.error('TMDB Fetch failed, falling back to local database', e)
    }
  }

  // Fallback to local database draw
  const filtered = getFilteredOfflineMovies()
  if (filtered.length === 0) {
    // Trigger notification if nothing matches
    spinning.value = false
    alert(
      'Nenhum filme offline corresponde aos filtros definidos. Tente relaxar os filtros (ex: diminuir ano ou nota mínima)!',
    )
    return
  }

  // Select random movie
  const randomMovie = filtered[Math.floor(Math.random() * filtered.length)]
  resultMovie.value = randomMovie
}

// Land on selected movie
const onSpinFinished = () => {
  spinning.value = false
}

// Fetch and draw from TMDB discover API
const drawFromTmdb = async () => {
  // Determine query type (if 'todos', pick one at random)
  let queryType = filters.type
  if (queryType === 'todos') {
    queryType = Math.random() > 0.5 ? 'movie' : 'series'
  }

  const isMovie = queryType === 'movie'
  const endpoint = isMovie ? 'discover/movie' : 'discover/tv'

  // Format variables
  let url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey.value}&language=pt-BR&sort_by=popularity.desc&vote_count.gte=30`

  // Rating
  url += `&vote_average.gte=${filters.minRating}`

  // Year release
  if (isMovie) {
    url += `&primary_release_date.gte=${filters.minYear}-01-01`
  } else {
    url += `&first_air_date.gte=${filters.minYear}-01-01`
  }

  // Genre map
  if (filters.genre) {
    const genreId = isMovie ? tmdbMovieGenres[filters.genre] : tmdbTvGenres[filters.genre]
    if (genreId) {
      url += `&with_genres=${genreId}`
    }
  }

  // 1. Fetch first page to find total count
  const initialRes = await fetch(url)
  if (!initialRes.ok) throw new Error('TMDB HTTP error')

  const initialData = await initialRes.json()
  const totalPages = initialData.total_pages || 1

  // Pick random page from top 8 pages (to get popular/relevant matches)
  const maxPage = Math.min(totalPages, 8)
  const randomPage = Math.floor(Math.random() * maxPage) + 1

  // 2. Fetch chosen page
  const pageUrl = `${url}&page=${randomPage}`
  const res = await fetch(pageUrl)
  if (!res.ok) throw new Error('TMDB HTTP error page')

  const data = await res.json()
  const results = data.results || []

  if (results.length === 0) {
    return null
  }

  // Pick random item
  const selected = results[Math.floor(Math.random() * results.length)]

  // Map genres
  const genres = selected.genre_ids
    ? selected.genre_ids.map((id) => getGenreNameById(id, isMovie)).filter((name) => name !== '')
    : []

  if (genres.length === 0 && filters.genre) {
    genres.push(filters.genre)
  }

  // Determine year
  let releaseYear = filters.minYear
  const rawDate = selected.release_date || selected.first_air_date
  if (rawDate) {
    releaseYear = new Date(rawDate).getFullYear()
  }

  return {
    id: selected.id,
    title: selected.title || selected.name,
    type: queryType,
    release_year: releaseYear,
    rating: selected.vote_average,
    genres: genres.length > 0 ? genres : ['Geral'],
    overview: selected.overview || 'Nenhuma sinopse disponível em português para este título.',
    poster_path: selected.poster_path,
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.tabs-card {
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
}

.filter-card {
  border-radius: 24px;
}

.genre-select {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.result-display-wrapper {
  min-height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-card-container {
  max-width: 320px;
  margin: 0 auto;
}

.settings-card {
  max-width: 600px;
  width: 100%;
  border-radius: 24px;

  a {
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

.btn-draw-again {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
}

.animate-pulse {
  animation: pulse-glow-text 1.5s infinite alternate;
}

@keyframes pulse-glow-text {
  0% {
    filter: drop-shadow(0 0 1px rgba(0, 240, 255, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.8));
  }
}

// Custom overrides
:deep(.q-btn-toggle) {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}
</style>
