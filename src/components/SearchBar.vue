<template>
  <form @submit.prevent="onSearch" class="mb-6">
    <div class="flex flex-col md:flex-row md:items-end md:space-x-4">
      <div class="flex-1 mb-4 md:mb-0">
        <label class="block text-gray-700 mb-2">Movie Name:</label>
        <Input
          type="text"
          v-model="name"
          placeholder="Enter movie name"
          class="w-full px-3 py-2 border rounded"
        />
      </div>
      <div class="mb-4 md:mb-0">
        <label class="block text-gray-700 mb-2">Genres:</label>
        <multiselect
          v-model="selectedGenres"
          :options="genresOptions"
          :multiple="true"
          :close-on-select="false"
          placeholder="Select genres"
          label="label"
          track-by="value"
          class="w-[300px]"
          :limit="1"
        ></multiselect>
      </div>
      <div>
        <Button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </Button>
        <Button
          type="button"
          @click="onReset"
          class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GenresEnum } from "@/constants/genresEnum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Multiselect from "vue-multiselect";

const name = ref("");
const selectedGenres = ref<any[]>([]);

const genresOptions = Object.entries(GenresEnum).map(([label, value]) => ({
  label,
  value,
}));

function onSearch() {
  const params: Record<string, string> = {};
  if (name.value.trim()) {
    params.name = name.value.trim();
  }
  if (selectedGenres.value.length > 0) {
    params.genres = selectedGenres.value.map((genre) => genre.value).join(",");
  }
  emit("search", params);
}

function onReset() {
  name.value = "";
  selectedGenres.value = [];
  emit("search", {});
}

const emit = defineEmits(["search"]);
</script>

<style>
@import "vue-multiselect/dist/vue-multiselect.css";
</style>
