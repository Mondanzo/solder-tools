<template>
  <div
    id="curseforge"
    class="rounded shadow-lg max-w-lg w-full p-8 m-12 bg-blue-600 text-white"
  >
    <h1 class="text-3xl">Upload Mod File</h1>
    <input type="file" @change="filesChange($event.target.files)" />
    <form class="flex flex-col items-center h-100 w-100">
      <h1 class="text-2xl">Mod Info</h1>
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
    <form class="flex flex-col items-center h-100 w-100">
      <h1 class="text-2xl">Mod Build</h1>
      <label for="st-version">Version</label>
      <input
        class="rounded border-gray-500 border"
        id="st-version"
        name="st-version"
        v-model="modversion"
      />
    </form>
  </div>
</template>
<script>
import jszip from "jszip";

export default {
  data() {
    return {
      key: "",
      name: "",
      author: "",
      desc: "",
      website: "",
      side: null,
      curse: null,
      modversion: null,
    };
  },
  methods: {
    loadMeta(meta) {
      console.log(meta.modid);
      this.key = meta.modid || "";
      this.name = meta.name || "";
      this.author = meta.authorList ? meta.authorList[0] : "";
      this.desc = meta.description || "";
      this.website = meta.url || "";
      this.modversion = (meta.mcversion + "-" || "") + (meta.version || "");
    },
    filesChange(files) {
      jszip.loadAsync(files[0]).then((zip) => {
        let mcmod = zip.file("mcmod.info");
        if (mcmod) {
          mcmod.async("text").then((content) => {
            let json = JSON.parse(content);
            if (Array.isArray(json)) {
              this.loadMeta(json[0]);
            } else {
              this.loadMeta(json);
            }
          });
        } else {
          this.$vToastify.error("Couldn't find a mcmod.info file!");
        }
      });
    },
  },
};
</script>

<style scoped>
input,
textarea {
  padding: 2px 4px;
  width: 100%;
  margin-bottom: 12px;
  color: #000;
}

form,
.buttons {
  margin: 24px;
  width: 80%;
}
</style>
