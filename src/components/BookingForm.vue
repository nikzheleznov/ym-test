<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Book Ticket</h1>
    <div
      v-if="moviesStore.loading || bookingStore.bookingLoading"
      class="text-center my-10"
    >
      Loading booking information...
    </div>
    <div
      v-else-if="moviesStore.selectedMovie && moviesStore.sessions.length > 0"
    >
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-2">
          {{ moviesStore.selectedMovie.name }}
        </h2>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Select Date:</label>
          <select
            v-model="selectedDate"
            @change="filterSessionsByDate"
            class="w-full px-3 py-2 border rounded"
          >
            <option v-for="date in availableDates" :key="date" :value="date">
              {{ date }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Select Time:</label>
          <select
            v-model="selectedSession"
            class="w-full px-3 py-2 border rounded"
          >
            <option
              v-for="session in filteredSessions"
              :key="session.showId"
              :value="session"
            >
              {{ session.time }}
            </option>
          </select>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Row:</label>
            <input
              type="number"
              v-model.number="form.row"
              required
              min="1"
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-2">Seat:</label>
            <input
              type="number"
              v-model.number="form.seat"
              required
              min="1"
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Book Now
          </Button>
        </form>
        <div
          v-if="bookingStore.bookingConfirmation"
          class="mt-4 p-4 bg-green-100 rounded"
        >
          <p class="text-green-700">
            Ticket booked successfully! Your ticket key:
            {{ bookingStore.bookingConfirmation.ticketkey }}
          </p>
        </div>
        <div
          v-if="bookingStore.bookingError"
          class="mt-4 p-4 bg-red-100 rounded"
        >
          <p class="text-red-700">Error: {{ bookingStore.bookingError }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center my-10">
      No available sessions for this movie.
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  ref,
  computed,
  watch,
  reactive,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import { useMoviesStore } from "@/stores/moviesStore";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";

const props = defineProps<{ id: string | number }>();

const moviesStore = useMoviesStore();
const bookingStore = useBookingStore();
const route = useRoute();

const selectedDate = ref<string>((route.query.showDate as string) || "");
const selectedSession = ref<any>(null);

async function fetchData() {
  await moviesStore.fetchMovie(props.id);
  if (moviesStore.selectedMovie) {
    await moviesStore.fetchSessions(props.id);
  }
}

fetchData();

onBeforeUnmount(() => {
  moviesStore.resetSelectedMovie();
  bookingStore.resetBooking();
});

const availableDates = computed(() => {
  return [...new Set(moviesStore.sessions.map((session) => session.showdate))];
});

const filteredSessions = computed(() => {
  return moviesStore.sessions.filter(
    (session) => session.showdate === selectedDate.value
  );
});

watch(
  () => moviesStore.sessions,
  (sessions) => {
    if (sessions.length > 0 && !selectedDate.value) {
      selectedDate.value = sessions[0].showdate;
    }
  }
);

function filterSessionsByDate() {
  if (filteredSessions.value.length > 0) {
    selectedSession.value = filteredSessions.value[0];
  } else {
    selectedSession.value = null;
  }
}

watch(selectedDate, filterSessionsByDate);

const form = reactive({
  movie_id: props.id,
  row: null as number | null,
  seat: null as number | null,
  showdate: "",
  daytime: "",
});

async function handleSubmit() {
  if (!selectedSession.value) {
    bookingStore.bookingError = "Please select a session.";
    return;
  }

  const bookingData = {
    movie_id: form.movie_id,
    row: form.row,
    seat: form.seat,
    showdate: selectedSession.value.showdate,
    daytime: selectedSession.value.time,
  };

  await bookingStore.bookPlace(bookingData);
}
</script>
