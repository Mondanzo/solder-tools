<template>
  <div class="flex flex-col items-center modal w-100 pt-6">
    <h1 class="text-2xl">Add new mod</h1>
    <form class="flex flex-col items-center h-100 w-100">
      <label for="st-key">Mod Slug</label>
      <input
        class="rounded border-gray-500 border"
        id="st-key"
        name="st-key"
        v-model="key"
      />
      <label for="st-name">Mod Name</label>
      <input
        class="rounded border-gray-500 border"
        id="st-name"
        name="st-name"
        v-model="name"
      />
      <label for="st-author">Author</label>
      <input
        class="rounded border-gray-500 border"
        id="st-author"
        name="st-author"
        v-model="author"
      />
      <label for="st-desc">Mod Description</label>
      <textarea
        class="rounded border-gray-500 border"
        id="st-desc"
        name="st-desc"
        v-model="desc"
      ></textarea>
      <label for="st-website">Website</label>
      <input
        class="rounded border-gray-500 border"
        id="st-website"
        name="st-website"
        type="url"
        v-model="website"
      />
      <div>
        <label for="st-type"></label>
      </div>
    </form>
    <div class="buttons">
      <button
        class="bg-teal-500 text-white rounded-full w-full py-3"
        @click="addMod()"
      >
        Add Mod to DB
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["mod"],
  data() {
    return {
      key: "",
      name: "",
      author: "",
      desc: "",
      website: "",
      side: null,
      curse: null,
    };
  },
  created() {
    this.key = this.mod.key;
    this.name = this.mod.name;
    this.author = this.mod.author;
    this.desc = this.mod.description;
    this.website = this.mod.website;
    this.curse = this.mod.curse || null;
  },
  methods: {
    addMod() {
      axios
        .post("/mod/add", this.$data)
        .then((result) => {
          this.$vToastify.success("Mod added.");
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="postcss" scoped>
input,
textarea {
  padding: 2px 4px;
  width: 100%;
  margin-bottom: 12px;
}

form,
.buttons {
  margin: 24px;
  width: 80%;
}
</style>
