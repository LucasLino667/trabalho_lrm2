<template>
  <q-card class="glass-card movie-card overflow-hidden full-height column">
    <div class="relative-position image-container">
      <img
        :src="getImageUrl(movie.poster_path)"
        class="movie-poster"
        referrerpolicy="no-referrer"
        loading="lazy"
        @error="onImgError"
        style="width: 100%; height: 360px; object-fit: cover; display: block"
      />

      <div class="absolute-top-right q-ma-md rating-badge-container">
        <div class="rating-badge flex items-center q-px-sm q-py-xs">
          <q-icon name="star" color="amber" size="18px" class="q-mr-xs" />
          <span class="text-white text-weight-bold">
            {{ formatRating(movie.rating) }}
          </span>
        </div>
      </div>

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

    <q-card-section class="col q-pa-md column justify-between">
      <div>
        <div class="row no-wrap items-start justify-between q-mb-xs">
          <div class="text-h6 text-weight-bold text-white line-clamp-2 leading-tight">
            {{ movie.title }}
          </div>
        </div>

        <div class="text-subtitle2 text-grey-4 q-mb-sm">
          Lançamento:
          <span class="text-white text-weight-bold">
            {{ movie.release_year }}
          </span>
        </div>

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

        <p class="text-body2 text-grey-3 line-clamp-4 q-mb-none text-justify">
          {{ movie.overview || 'Nenhuma sinopse disponível para este título.' }}
        </p>
      </div>

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
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

const onImgError = (event) => {
  event.target.src =
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500'
}

// Gerador de URLs robusto
const getImageUrl = (path) => {
  if (!path)
    return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500'
  if (path.startsWith('http')) return path
  return `/posters/${path.slice(1)}` // aponta para public/posters/
}

const formatRating = (rating) => {
  if (!rating) return 'N/A'
  return Number(rating).toFixed(1)
}

const searchWhereToWatch = () => {
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
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
    border-color: rgba(0, 240, 255, 0.6);
  }
}
</style>
