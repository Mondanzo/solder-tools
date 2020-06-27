<template>
  <div>
    <h1 class="text-center text-3xl py-4 text-white bg-black bg-opacity-25">
      Solder Tools
    </h1>
    <div class="views flex justify-center">
      <div
        @click="setView('CURSEFORGE')"
        class="my-8 mx-4 rounded-full bg-orange-700 text-white py-4 px-8 cursor-pointer text-2xl"
      >
        Mod from Curseforge
      </div>
      <div
        @click="setView('CURSEMANAGER')"
        class="my-8 mx-4 rounded-full bg-orange-700 text-white py-4 px-8 cursor-pointer text-2xl"
      >
        Manage Mods from Curseforge
      </div>
      <div
        @click="setView('CUSTOMMOD')"
        class="my-8 mx-4 rounded-full bg-blue-700 text-white py-4 px-8 cursor-pointer text-2xl"
      >
        Upload Mod
      </div>
    </div>
    <div class="flex justify-center">
      <component :is="cview"></component>
    </div>
    <modals-container></modals-container>
  </div>
</template>

<style lang="postcss">
body {
  background-image: url("./assets/background.png");
}
</style>

<script>
import Curseforge from "./views/Curseforge";
import CurseManager from "./views/CurseManager";
import CMod from "./views/CMod";

export default {
  components: { Curseforge, CMod },
  data() {
    return {
      cview: null,
    };
  },
  methods: {
    setView(view) {
      switch (view.trim()) {
        case "CURSEFORGE":
          this.cview = Curseforge;
          break;
        case "CURSEMANAGER":
          this.cview = CurseManager;
          break;
        case "CUSTOMMOD":
          this.cview = CMod;
          break;
      }
    },
  },
};
</script>
