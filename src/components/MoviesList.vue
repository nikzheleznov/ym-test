<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Daily Movies</h1>
    <SearchBar @search="handleSearch" />
    <div v-if="moviesStore.loading" class="text-center my-10">
      Loading movies...
    </div>
    <div v-else>
      <div v-if="moviesStore.movies.length === 0" class="text-center my-10">
        No movies found.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          v-for="movie in moviesStore.movies"
          :key="movie.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            :src="movie.image || 'https://via.placeholder.com/400x600'"
            alt="Movie Poster"
            class="w-full min-h-[360px] object-cover"
          />
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">{{ movie.name }}</h2>
            <p class="text-gray-600 mb-4">
              Genres: {{ getGenres(movie.genres) }}
            </p>
            <router-link
              :to="`/movie/${movie.id}`"
              class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Details
            </router-link>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from "@/stores/moviesStore";
import { GenresMap } from "@/constants/genresEnum";
import { Card } from "@/components/ui/card";
import SearchBar from "./SearchBar.vue";

function getGenres(genres: number[] = []) {
  if (!Array.isArray(genres) || genres.length === 0) {
    return "UNKNOWN";
  }
  return genres.map((genreId) => GenresMap[genreId] || "UNKNOWN").join(", ");
}

const moviesStore = useMoviesStore();
moviesStore.fetchMovies();

function handleSearch(searchParams: Record<string, any>) {
  moviesStore.fetchMovies(searchParams);
}
</script>
