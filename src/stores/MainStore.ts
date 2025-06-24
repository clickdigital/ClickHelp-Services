// MainStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useMainStore = defineStore("MainStore", () => {
  // 🔹 State
  const storName = ref("MainStore");
  const tabMenu = ref<string>("home");
  const selectedTab = ref<number>(1);

  // 🔸 Getter
  const uppercaseTab = computed(() => tabMenu.value.toUpperCase());

  // 🔺 Action
  function funcTest() {
    console.log("🧪 MainStore test function");
    tabMenu.value = "test-mode"; // Just an example of modifying state
    return "Action executed!";
  }

  return {
    storName,
    tabMenu,
    uppercaseTab,
    selectedTab,
    funcTest,
  };
});

export type MainType = ReturnType<typeof useMainStore>;