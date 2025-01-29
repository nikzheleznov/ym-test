<template>
  <div v-if="moviesStore.loading" class="text-center my-10">
    Loading movie details...
  </div>
  <div v-else-if="moviesStore.selectedMovie">
    <div class="flex flex-col md:flex-row">
      <img
        :src="
          moviesStore.selectedMovie.image ||
          'https://via.placeholder.com/400x600'
        "
        alt="Movie Poster"
        class="w-full md:w-1/3 h-auto rounded-lg shadow-md object-cover"
      />
      <div class="md:ml-6 mt-4 md:mt-0 max-w-[60%]">
        <h1 class="text-3xl font-bold mb-2">
          {{ moviesStore.selectedMovie.name }}
        </h1>
        <p class="text-gray-700 mb-4">
          {{ moviesStore.selectedMovie.description }}
        </p>
        <div v-if="movieDetails">
          <p class="text-gray-600 mb-2">
            <strong>Age Rating:</strong> {{ movieDetails.age }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Year:</strong> {{ movieDetails.year }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Original Title:</strong> {{ movieDetails.originalTitle }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Director:</strong> {{ movieDetails.director }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Screenplay:</strong> {{ movieDetails.screenplay }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Language:</strong> {{ movieDetails.language }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Duration:</strong> {{ movieDetails.duration }}
          </p>
          <p class="text-gray-600 mb-2">
            <strong>Production:</strong> {{ movieDetails.production }}
          </p>
        </div>
        <router-link
          :to="`/book/${moviesStore.selectedMovie.id}`"
          class="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Book Ticket
        </router-link>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">Available Dates</h2>
      <div v-if="availableDates.length === 0" class="text-center my-4">
        No available sessions.
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link
          v-for="date in availableDates"
          :key="date"
          :to="`/book/${moviesStore.selectedMovie.id}?showDate=${date}`"
          class="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-100 transition"
        >
          <p class="text-gray-800 text-lg font-semibold">
            {{ date }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
  <div v-else class="text-center my-10">Movie not found.</div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, computed } from "vue";
import { defineProps } from "vue";
import { useMoviesStore } from "@/stores/moviesStore";

const props = defineProps<{ id: string | number }>();

const moviesStore = useMoviesStore();

async function fetchData() {
  await moviesStore.fetchMovie(props.id);
  if (moviesStore.selectedMovie) {
    await moviesStore.fetchSessions(props.id);
  }
}

fetchData();

onBeforeUnmount(() => {
  moviesStore.resetSelectedMovie();
});

const availableDates = computed(() => {
  return [...new Set(moviesStore.sessions.map((session) => session.showdate))];
});

const movieDetails = computed(() => {
  if (!moviesStore.selectedMovie?.additional) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    moviesStore.selectedMovie.additional,
    "text/html"
  );
  return {
    age: doc.querySelector(".rating .val")?.textContent.trim() || "Unknown",
    year:
      doc.querySelector("li:nth-child(2) .val")?.textContent.trim() ||
      "Unknown",
    originalTitle:
      doc.querySelector("li:nth-child(3) .val")?.textContent.trim() ||
      "Unknown",
    director:
      doc.querySelector("li:nth-child(4) .val")?.textContent.trim() ||
      "Unknown",
    screenplay:
      doc.querySelector("li:nth-child(9) .val")?.textContent.trim() ||
      "Unknown",
    language:
      doc.querySelector("li:nth-child(6) .val")?.textContent.trim() ||
      "Unknown",
    duration:
      doc.querySelector("li:nth-child(8) .val")?.textContent.trim() ||
      "Unknown",
    production:
      doc.querySelector("li:nth-child(7) .val")?.textContent.trim() ||
      "Unknown",
  };
});
</script>
