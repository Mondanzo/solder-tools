<template>
  <div
    id="cursemanager"
    class="rounded shadow-lg max-w-lg w-full p-8 m-12 bg-orange-600 text-white"
  >
    <h1 class="text-3xl">Manage Mods handled by Curseforge</h1>
	 <div v-if="mods.length">
      <p class="mt-4">Search Results</p>
      <div class="mods-result overflow-y-auto overflow-x-hidden">
        <div
          class="bg-orange-700 flex justify-between border-b border-orange-300 border-solid mod"
          v-for="mod of mods"
          :key="mod.id"
        >
          <a class="flex-grow ml-2" :href="mod.link"
            ><h1 class="text-2xl m-0 text-blue-200">{{ mod.pretty_name }}</h1>
            <p>{{ mod.author }}</p>
          </a>
          <button
            class="bg-black bg-opacity-25 px-4 hover:bg-opacity-50"
            @click="openModal(mod)"
          >
            Add
          </button>
        </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mods: [],
    };
  },
  beforeMount() {
    axios.get("/mod/curse").then((res) => {
      this.mods = res.data;
    });
  },
};
</script>
