import type { App } from "vue";

// 🧩 Setup-style stores (defined using defineStore(..., () => {})) - factory version
import { useMainStore } from "./stores/MainStore";
import { useExampleStore } from "./stores/ExampleStore";
import { useFAQStore } from "./stores/FAQStore";
import { useUsersStore } from "./stores/UsersStore";

// 🧩 Options-style stores (defined using defineStore({ ... })) - classic version - simpler
import { useAuthStore } from "./stores/AuthStore";
import { useOptionStore } from "./stores/OptionStore";

export function registerStores(app: App) {
  // ✅ Create instances of each store
  const storMain = useMainStore();
  const storExample = useExampleStore();
  const storAuth = useAuthStore();
  const storOption = useOptionStore();
  const storFAQ = useFAQStore();
  const storUsers = useUsersStore();

  // ✅ Provide each one using app.provide
  app.provide("storMain", storMain);
  app.provide("storExample", storExample);
  app.provide("storAuth", storAuth);
  app.provide("storOption", storOption);
  app.provide("storFAQ", storFAQ);
  app.provide("storUsers", storUsers);
}