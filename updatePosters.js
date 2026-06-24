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
