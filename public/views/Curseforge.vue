<template>
  <div
    id="curseforge"
    class="rounded shadow-lg max-w-lg w-full p-8 m-12 bg-orange-600 text-white"
  >
    <h1 class="text-3xl">Add new mod from curseforge</h1>
    <form class="flex mt-2" @submit.prevent="newSearch()">
      <input
        id="cf-search"
        type="text"
        class="rounded-l p-2 text-black m-0 flex-grow"
        placeholder="Search Mods"
        v-model="cf.searchTerm"
      />
      <button
        id="cf-searchBtn"
        class="rounded-r m-0 bg-orange-800 p-2"
        type="submit"
      >
        Search
      </button>
    </form>
    <div class="flex my-2 justify-between">
      <div>
        <label for="cf-version" class="mr-2">Minecraft Version</label>
        <v-select
          v-model="cf.mcversion"
          name="cf-version"
          id="cf-version"
          :clearable="false"
          :options="versions"
        ></v-select>
      </div>
      <div>
        <label for="cf-size" class="mr-2">Items per page</label>
        <v-select
          v-model="cf.limit"
          name="cf-size"
          id="cf-size"
          :clearable="false"
          :options="[5, 10, 25, 50, 75, 100]"
        ></v-select>
      </div>
    </div>
    <div v-if="cf.items.length">
      <p class="mt-4">Search Results</p>
      <div class="mods-result overflow-y-auto overflow-x-hidden">
        <div
          class="bg-orange-700 flex justify-between border-b border-orange-300 border-solid mod"
          v-for="mod of mods"
          :key="mod.id"
        >
          <img
            :src="mod.hasOwnProperty('logo') ? mod.logo.url : ''"
            :alt="mod.name"
          />
          <a class="flex-grow ml-2" :href="mod.url"
            ><h1 class="text-2xl m-0 text-blue-200">{{ mod.name }}</h1>
            <p>{{ mod.authors[0].name }}</p>
          </a>
          <button
            class="bg-black bg-opacity-25 px-4 hover:bg-opacity-50"
            @click="openModal(mod)"
          >
            Add
          </button>
        </div>
      </div>
      <div class="flex mt-1 justify-between">
        <div class="flex">
          <button
            :disabled="!this.canBack"
            class="bg-orange-800 rounded-l-full px-6 py-2 hover:bg-orange-900"
            @click="
              cf.page--;
              searchCF();
            "
          >
            Back
          </button>
          <button
            :disabled="!this.canNext"
            class="bg-orange-800 rounded-r-full px-6 py-2 hover:bg-orange-900"
            @click="
              cf.page++;
              searchCF();
            "
          >
            Forward
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import AddNewMod from "./AddNewMod";

import mcversions from "../resources/version.json";

export default {
  components: { AddNewMod },
  data() {
    return {
      versions: mcversions,
      cf: {
        searchTerm: "",
        mcversion: mcversions[0],
        items: [],
        page: 0,
        limit: 5,
        usedLimit: 0,
      },
    };
  },
  computed: {
    canNext() {
      return this.cf.items.length > this.cf.usedLimit;
    },
    canBack() {
      return this.cf.page > 0;
    },
    mods() {
      return this.cf.items.slice(0, -1);
    },
  },
  methods: {
    newSearch() {
      this.cf.items = [];
      this.cf.page = 0;
      this.cf.usedLimit = this.cf.limit;
      this.searchCF();
    },
    searchCF() {
      let opts = {
        term: this.cf.searchTerm,
        limit: this.cf.usedLimit,
        page: this.cf.page * this.cf.usedLimit,
      };
      if (this.cf.mcversion !== "Any") opts.gameVersion = this.cf.mcversion;
      axios
        .get("/curseforge", {
          params: opts,
        })
        .then((response) => {
          this.cf.items = response.data;
        });
    },
    openModal(mod) {
      this.$modal.show(
        AddNewMod,
        {
          mod: {
            name: mod.name,
            key: mod.key,
            author: mod.authors[0].name,
            description: mod.summary,
            website: mod.url,
            curse: mod.id,
          },
        },
        {
          height: "auto",
        }
      );
    },
    addMod() {},
  },
};
</script>

<style scoped>
.mod img {
  width: 64px;
  height: 64px;
}

button:disabled {
  background-color: #000 !important;
  opacity: 0.3;
}

.mods-result {
  max-height: 500px;
}
</style>
