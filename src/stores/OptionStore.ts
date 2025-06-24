import { defineStore } from "pinia";

export const useOptionStore = defineStore("OptionStore", {

  state: () => ({
    storName: "OptionStore",
    tabMenu: "home",
  }),
  
  actions: {
    funcTest() {
      this.tabMenu = "clicked";
    }
  }
});

export type OptionType = ReturnType<typeof useOptionStore>;