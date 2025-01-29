<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <router-link to="/" class="text-xl font-bold text-gray-800">
          CinemaApp
        </router-link>
        <div></div>
      </div>
    </nav>
    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
    <footer class="bg-white shadow mt-10">
      <div
        class="px-4 py-4 text-center text-gray-600 fixed bottom-0 bg-white w-full"
      >
        &copy; {{ currentYear }} CinemaApp. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const currentYear = ref(new Date().getFullYear());
</script>
